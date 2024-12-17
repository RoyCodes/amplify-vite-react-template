import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { env } from '$amplify/env/usertab';
import { v4 as uuidv4 } from 'uuid';

// trying via the bedrock agent
const bedrockAgentClient = new BedrockAgentRuntimeClient({ region: "us-west-2" });

// trying via the bedrock api directly w/ knowledge base
const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });


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

    const agentCommand = new InvokeAgentCommand({
      agentAliasId: env.ALIAS_ID,
      agentId: env.AGENT_ID,
      sessionId: newUuid,
      inputText: userInput,
    });

    const payload = {
      knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
      retrievalQuery: userInput,
      generationConfiguration: {
        modelId: process.env.MODEL_ID,
      },
    };

    const modelCommand = new InvokeModelCommand({
      body: JSON.stringify(payload),
      modelId: env.MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
    })

    const response = await bedrockClient.send(modelCommand);
    // const response = await bedrockAgentClient.send(agentCommand);

    console.log("Initial Bedrock Agent Response:", response);


    const parsedResponse = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Knowledge Base Response:", parsedResponse);

    // let responseText = "";
    // let attributions: any[] = [];

    //   if (response.completion) {
    //     for await (const event of response.completion) {
    //       if (event.chunk?.bytes) {
    //         responseText += Buffer.from(event.chunk.bytes).toString("utf-8");
    //       }

    //       const attribution = event.chunk?.attribution;
    //       if (attribution) {
    //         attributions.push(attribution);
    //       }
    //     }
      
    //   } else {
    //     console.warn("No completion stream found in the response.");
    //   }
      
    // console.log("Final Bedrock Agent Response:", responseText);
    // console.log("Response Attributions:", attributions);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ 
        parsedResponse
        // response: responseText,
        // attributions: attributions,
       }),
    };
  } catch (error) {
    console.error("Error invoking Bedrock API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process the request." }),
    };
  }
};