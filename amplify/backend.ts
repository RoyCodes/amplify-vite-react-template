import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { userTab } from './functions/usertab/resource';
import { adminTab } from './functions/admintab/resource';
import { storage } from './storage/resource';
import { Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const backend = defineBackend({
  auth,
  userTab,
  adminTab,
  storage
});

// Create a new API stack
const apiStack = backend.createStack('api-stack');

// Create a User Pool authorizer
const userPoolAuthorizer = new HttpUserPoolAuthorizer(
  'userPoolAuth',
  backend.auth.resources.userPool,
  {
    userPoolClients: [backend.auth.resources.userPoolClient],
  }
);

// Create an HTTP Lambda integration for user tab
const httpUserLambdaIntegration = new HttpLambdaIntegration(
  'UserLambdaIntegration',
  backend.userTab.resources.lambda
);

// Create an HTTP API
const httpApi = new HttpApi(apiStack, 'HttpApi', {
  apiName: 'chatApi',
  corsPreflight: {
    allowMethods: [CorsHttpMethod.POST], // Only allow POST for this route
    allowOrigins: ['*'], // Replace with specific domains in production
    allowHeaders: ['*'], // Restrict headers as needed
  },
  createDefaultStage: true,
});

// Add a route which hits the user tab Lambda function
httpApi.addRoutes({
  path: '/chat',
  methods: [HttpMethod.POST], // Only POST requests
  integration: httpUserLambdaIntegration,
  authorizer: userPoolAuthorizer, // Only logged-in users can access
});

// Add API Gateway outputs for deployment references
backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});

// Add permission for User Tab Lambda to invoke Bedrock Models
backend.userTab.resources.lambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['bedrock:InvokeModel', 'bedrock:Retrieve'],
    resources: ['*'],
  })
);