import type { S3Handler } from 'aws-lambda';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';
import { TranscribeClient, StartTranscriptionJobCommand} from '@aws-sdk/client-transcribe';

const s3 = new S3Client({ region: process.env.AWS_REGION });

const transcribe = new TranscribeClient({ region: process.env.AWS_REGION });

export const handler: S3Handler = async (event) => {

  try {
    for (const record of event.Records) {
      const sourceBucket = record.s3.bucket.name;
      const sourceKey = record.s3.object.key;
      const fileExtension = sourceKey.split('.').pop()?.toLocaleLowerCase();
      const audioExtensions = ['mp3', 'wav', 'flac'];

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
  } catch (error) {
    console.error('Error processing S3 event: ', error);
    throw error;
  }
};