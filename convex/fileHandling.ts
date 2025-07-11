import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } from "./s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";


// const userLimit ; 

// link  :https://chatgpt.com/share/687145e9-f524-8006-83a0-55680fbd221f

export const getUploadUrl = mutation({
    args : {
   
    filename: v.string(),
    fileSize: v.number(),
    }, 
    handler : async (ctx ,args ) => {

        const {filename , fileSize } = args;


        // taking the userID 
          const user = await ctx.runQuery(internal.myFunctions.smartUserId)
                if (!user) {
                    return null;
                }
        const userId: string | " " = user ? user._id : " ";
        // const userEmail : string | "" = user ? user.email : "";


    

    
    // checking aws credentials 
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
    console.error('AWS environment variables are not set. or AWS credentials are missing ');
    return null
    }

    const files = await ctx.db.query("user_files").filter((q) => q.eq(q.field("userID"), userId) ).collect()


    const usedBytes = files.reduce((total, file ) => total + file.size , 0 );

    // replacing this with special users ! 
    // need to fetch the validity parameter of the user ! 
    const userPlans = await ctx.db.query("user_plans").filter((q) => q.eq(q.field("email"), userId)).collect();
    const validity = userPlans.length > 0 ? userPlans[0].validity : null;

    // now let's get today's date in timestamp 
    const today = new Date () ;
    const todayDateinTimestamp = today.getTime();

    // checking if validity is not null 
    
    if(!validity) {
        return null;
    }

    if (todayDateinTimestamp <= validity ) {
    
    
        // generate s3 presigned url 
        const s3Key = `${userId}/${Date.now()}-${filename}`;
        const command  = new PutObjectCommand({
            Bucket : AWS_BUCKET_NAME,
            Key : s3Key,
            ContentType : "application/pdf" 
        })

        const uploadURL  = await getSignedUrl(s3Client , command , {expiresIn : 300});


        // now storing the meta data into convex db ! 
        await ctx.db.insert("user_files" , {
            userID : userId, 
            filename : filename, 
            size : fileSize, 
            s3Key : s3Key, 
            uploadedAt : Date.now()
        })

        // returning presigned URL so that it can be used by NEXT in order to upload the file to 
        // bucket
        return uploadURL;
    }
    



    }
})

