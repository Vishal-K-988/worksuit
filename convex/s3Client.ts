import { S3Client } from "@aws-sdk/client-s3";

  export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  export const AWS_REGION = process.env.AWS_REGION;
  export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
    throw new Error("Missing required AWS environment variables.");
  }
  
  export const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  });