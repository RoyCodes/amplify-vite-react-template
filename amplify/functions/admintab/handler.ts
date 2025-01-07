import type { S3Handler } from 'aws-lambda';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';
import { TranscribeClient, StartTranscriptionJobCommand} from '@aws-sdk/client-transcribe';
import { BedrockAgentClient, StartIngestionJobCommand } from "@aws-sdk/client-bedrock-agent";
import { env } from "$amplify/env/admintab";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const transcribe = new TranscribeClient({ region: process.env.AWS_REGION });

const bedrockAgentClient = new BedrockAgentClient({ region: process.env.AWS_REGION });

const knowledgeBaseId = env.KNOWLEDGE_BASE_ID!;
const dataSourceId = env.DATA_SOURCE_ID!;

const startIngestionJob = async (knowledgeBaseId: string, dataSourceId: string) => {
  try {
    const input = {
      knowledgeBaseId,
      dataSourceId,
      clientToken: `token-${Date.now()}`,
      description: "Triggered ingestion from Lambda",
    };

    const command = new StartIngestionJobCommand(input);
    const response = await bedrockAgentClient.send(command);

    console.log('Ingestion job started:', response);
    return response;
  } catch (error) {
    console.error('Error starting ingestion job:', error);
    throw error;
  }
};


export const handler: S3Handler = async (event) => {

  try {
    for (const record of event.Records) {
      const sourceBucket = record.s3.bucket.name;
      const sourceKey = record.s3.object.key;
      const fileExtension = sourceKey.split('.').pop()?.toLocaleLowerCase();
      const audioExtensions = ['mp3', 'wav', 'flac'];


      // Check if S3 PUT trigger was to knowledge-base-raw-files/ and if so, process it.
      if (sourceKey.startsWith('knowledge-base-raw-files/')) {
        console.log('Processing raw file:', sourceKey);

        if (audioExtensions.includes(fileExtension || '')) {

          const jobName = `transcription-${Date.now()}-${sourceKey.replace(/[^a-zA-Z0-9-_]/g, '_')}`;
          const mediaUri = `s3://${sourceBucket}/${sourceKey}`;
          const outputBucket = sourceBucket;
          console.log(`this is what I have for the sourceBucket value: ${sourceBucket}`)
  
          const transcribeCommand = new StartTranscriptionJobCommand({
            TranscriptionJobName: jobName,
            LanguageCode: 'en-US',
            MediaFormat: fileExtension as "mp3" | "wav" | "flac",
            Media: { MediaFileUri: mediaUri },
            OutputBucketName: outputBucket,
            OutputKey: `knowledge-base-processed-files/${jobName}.json`
          });
          const response = await transcribe.send(transcribeCommand);
          console.log('Transcription job started:', response);
          continue;
        }
  
        const destinationKey = `knowledge-base-processed-files/${sourceKey.split('/').pop()}`;
  
        const copyCommand = new CopyObjectCommand({
          Bucket: sourceBucket,
          CopySource: `${sourceBucket}/${sourceKey}`,
          Key: destinationKey,
        });
  
        await s3.send(copyCommand);

      }

      // Check if S3 PUT trigger was to knowledge-base-processed-files/ and if so, refresh Knowledge Base.
      if (sourceKey.startsWith('knowledge-base-processed-files/')) {
        console.log('Handling processed file upload: ', sourceKey);

        // Ignore .temp files
        if (sourceKey.endsWith('.temp')) {
          console.log('Skipping temp file:', sourceKey);
          continue;
        }

        await startIngestionJob(knowledgeBaseId, dataSourceId);
        console.log('Ingestion job triggered successfully for:', sourceKey);

      }
    }
  } catch (error) {
    console.error('Error processing S3 event: ', error);
    throw error;
  }
};