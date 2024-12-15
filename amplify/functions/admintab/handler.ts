import type { S3Handler } from 'aws-lambda';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler: S3Handler = async (event) => {

  try {
    for (const record of event.Records) {
      const sourceBucket = record.s3.bucket.name;
      const sourceKey = record.s3.object.key;
      const fileExtension = sourceKey.split('.').pop()?.toLocaleLowerCase();
      const audioExtensions = ['mp3', 'wave', 'flac'];

      if (audioExtensions.includes(fileExtension || '')) {
        console.log('audio file detected')
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