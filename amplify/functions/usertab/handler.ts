import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime"; // ES Modules import
import { env } from '$amplify/env/usertab';
import { v4 as uuidv4 } from 'uuid';

const bedrockClient = new BedrockAgentRuntimeClient({ region: "us-west-2" });
const newUuid = uuidv4();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("Received event:", event);

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const userInput = body.message;

    if (!userInput) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No user input provided." }),
      };
    }

    const command = new InvokeAgentCommand({
      agentAliasId: env.ALIAS_ID,
      agentId: env.AGENT_ID,
      sessionId: newUuid,
      inputText: userInput,
    });

    const response = await bedrockClient.send(command);

    console.log("Initial Bedrock Agent Response:", response);

    let responseText = "";
    let attributions: any[] = [];

      if (response.completion) {
        for await (const event of response.completion) {
          if (event.chunk?.bytes) {
            responseText += Buffer.from(event.chunk.bytes).toString("utf-8");
          }
          if (event.chunk?.attribution) {
            attributions.push({
              citation: event.chunk.attribution.citations
            })
          }

        }
      
      } else {
        console.warn("No completion stream found in the response.");
      }
      
    console.log("Final Bedrock Agent Response:", responseText);
    console.log("Response Attributions:", attributions);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ 
        response: responseText,
        attributions: attributions,
       }),
    };
  } catch (error) {
    console.error("Error invoking Bedrock Agent:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process the request." }),
    };
  }
};