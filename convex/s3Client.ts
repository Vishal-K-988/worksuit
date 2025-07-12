import { S3Client } from "@aws-sdk/client-s3";

  export const AWS_ACCESS_KEY_ID = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  export const AWS_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
  export const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;
  export const AWS_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
    throw new Error("Missing required AWS environment variables.");
  }
  
  export const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID as string,
      secretAccessKey: AWS_SECRET_ACCESS_KEY as string
    }
  });