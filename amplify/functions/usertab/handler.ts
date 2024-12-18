import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { BedrockAgentRuntimeClient, RetrieveCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { env } from "$amplify/env/usertab";

const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });
const bedrockAgentClient = new BedrockAgentRuntimeClient({ region: "us-west-2" });

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

    const retrieveInput = {
      knowledgeBaseId: env.KNOWLEDGE_BASE_ID,
      retrievalQuery: {
        text: userInput,
      },
    };

    const retrieveCommand = new RetrieveCommand(retrieveInput);
    const retrievalResponse = await bedrockAgentClient.send(retrieveCommand);
    console.log("Retrieval Response:", retrievalResponse);

    const retrievalResults = retrievalResponse.retrievalResults || [];
    const formattedResults = retrievalResults.map((result) => ({
      content: result.content?.text || "",
      location: result.location,
      score: result.score,
      metadata: result.metadata
    }));

    console.log("Formatted Results:", formattedResults);

    const payload = {
      inputText: `you are a friendly chatbot that answers technical questions from users. Once they submit question, it is first sent to a knowledge base to gather supplemental materials, where possible, to help you build your reply. The following will be an inquiry from a user, as well as the results from a knowledge base look-up. Your task is to create a detailed response using the provided results when applicable. Please include the file name and page numbers from the knowledge base results as citations in your final reply. Here is the user's inquiry: <start of inquiry> "${userInput}" <end of inquiry>. And, here are the results from the knowledge base look-up: <start of knowledge base look-up> "${formattedResults}" < end of knowledge base look-up>.`
    };

    console.log("payload for InvokeModelCommand: ", payload)

    const modelCommand = new InvokeModelCommand({
      body: JSON.stringify(payload),
      modelId: env.MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await bedrockClient.send(modelCommand);
    console.log("Initial Bedrock Agent Response:", response);

    const parsedResponse = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Bedrock Model Response:", parsedResponse);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ 
        response: parsedResponse,
        formattedResults
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