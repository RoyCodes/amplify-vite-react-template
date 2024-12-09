import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { userTab } from './functions/usertab/resource';
import { Stack } from 'aws-cdk-lib';
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

// Create an HTTP Lambda integration
const httpLambdaIntegration = new HttpLambdaIntegration(
  'LambdaIntegration',
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

// Add a single route for the Lambda function
httpApi.addRoutes({
  path: '/chat',
  methods: [HttpMethod.POST], // Only POST requests
  integration: httpLambdaIntegration,
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