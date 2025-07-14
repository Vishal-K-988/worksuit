import { v } from "convex/values";
import { query, mutation, internalQuery, internalMutation, action } from "./_generated/server";

import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { File_Upload_Limit } from "./userLimit";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:




export const example = query({
  args : {a: v.number() , b: v.number()},
  handler : (_, args) => {
    const message = " this is an example!\n   " 
    const sum =args.a + args.b;
    return ( message  + sum )
  }
});


// querying the db using email 
export const userID = query({
  args: {email : v.string()},
  handler : async(ctx , args) => {
    const id = await ctx.db.query("users").filter( 
      (q) => q.eq(q.field("email"),  args.email) 
    ).first();

    if (id) {
      const data =id
      return data;
    }
    else {
      return null ;
    }
  }
})



export const smartUserId = internalQuery({
  handler : async( ctx) => {
    const userID = await getAuthUserId(ctx);
    if(userID) {
      return await ctx.db.get(userID)
    }
    else {
      return null;
    }
  }
})







export const user_plans = internalMutation({

  handler :  async (ctx ) => {
       const user = await ctx.runQuery(internal.myFunctions.smartUserId)
        if (!user) {
            return null;
        }

        const userName: string = ( user && user.name)  ? user.name : "";
        const userEmail: string = ( user && user.email ) ? user.email : "";
      


       const present : any =  await ctx.db.query("user_plans").filter((q) => q.eq(q.field("email"), userEmail)).first();

        if (!present) {
           let validity;
           let tag ; 
           let plan = "Free"

      // special emails
      const specialEmails = [
        "himanshu8115832782@gmail.com",
        "randomshivam7@gmail.com",
        "ratneshtiwari389@gmail.com",
        "gautamsudhanshu2911@gmail.com",
        "shubhams12138@gmail.com",
        "utk2665@gmail.com",
        "vishalkumarvkvk977@gmail.com",
        "1112prajwal.m@gmail.com",
      ];

     const today = new Date();
      // setting the validity for 10years 
   
      const futureDate = new Date() ; 
      futureDate.setFullYear(
        today.getFullYear() + 100
      )

      const validityTimestamp = futureDate.getTime();


      // setting the validity for 1 week for normal users 
      const normalUser = new Date() ; 
      normalUser.setHours(
        today.getHours()  + 168 
      )

      const weekLimit = normalUser.getTime()




      // Assign validity based on email
      if (specialEmails.includes(userEmail)) {
          validity = validityTimestamp;
          tag = "Special"
          plan= "Premium"
          
      } else {
        // Default validity for non-special users (e.g., current time, or 0, or 1 year)
        // Let's set it to the current timestamp for others as per your `let validity = Date.now();`
        validity = weekLimit; 
        tag  = "Normal"
        plan = "Free"

      }

     const readable = new Date (validity)
      const rdate = readable.getDate()
      const rmonth = readable.getMonth()
      const rYear = readable.getFullYear() 
      
      const readableValidity ="D-"+ rdate + " M-" + rmonth +  " Y-"+  rYear 
      
      await ctx.db.insert("user_plans", {
        name: userName,
        email: userEmail,
        validity: validity, 
        validityInReadableForm : readableValidity, 
        tag, 
        plan : plan
      });

      
      console.log(`New user plan inserted for: ${userEmail} with validity timestamp: ${validity}`);
    } else {
      console.log(`User plan already exists for: ${userEmail}. Skipping insert.`);
    }
      }

        
  
})


// GET messages
export const messages = query({
  handler : async (ctx) => {
    const data = await ctx.db.query("messages").collect();

    if(data.length === 0){
        return null
    }
    else {
      return data
    }
  }
})

// POST messages 
export const insertMessages: ReturnType<typeof mutation> = mutation ({
  args : {author : v.string() , 
        message : v.string(),
       
  },
  handler :  async (ctx, args): Promise<string | null> => {

     const user = await ctx.runQuery(internal.myFunctions.smartUserId);

  const userName: string | null = user ? (user.name ?? null) : null;
    const userId: string | null = user ? user._id : null;


    const messageinsertID: string = await ctx.db.insert("messages" , {
      userId : userId ?? "undefined",
      author : args.author,
      message: args.message,
      name : userName ?? "undefined"
    });

    if (messageinsertID) {
      return messageinsertID;
    }
    else {
      return null;
    }
  } 
})


export const updateMessage = mutation({
  handler : () => {}
})

//  fetching the data with resepct to particular userID 
export const fetchData = query ({
  handler : async   (ctx): Promise<any[] | null> => {
      const user = await ctx.runQuery(internal.myFunctions.smartUserId);

      if (!user){
        return null
      } 

      const currentUserID: string | null = user ? user._id : null;

        const userMessage = await ctx.db.query("messages").filter( (q) => q.eq(q.field("userId"), currentUserID) ).collect()

        return userMessage
  }
})    


export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});



export const sendImage = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, args) => {

    // getting the userId 
     const user = await ctx.runQuery(internal.myFunctions.smartUserId);
      if(!user) {
    return null 
  }

  const ID : string | null = user ? (user._id ?? null) : null;
 
   

    await ctx.db.insert("messages", {
      userId : ID ?? "undefined",
      message: args.storageId,
      author: args.author,
      name: "image",
    });
  },
});




export const UploadURL = mutation({
  args :  {
    filename  : v.string(), 
    filesize : v.number(),
    filetype : v.string()
  }, 
  handler :async  (ctx, args) => {

    // getting the userID 

           const user = await ctx.runQuery(internal.myFunctions.smartUserId)
        if (!user) {
            return null;
        }
           const userId: string | null = user ? user._id : null;
           const userEmail: string = ( user && user.email ) ? user.email : "";
           
          // checking user's tag 
        const userPlanData  = await ctx.db.query("user_plans").filter((q) => q.eq(q.field("email"), userEmail)).first()
        const Plan = userPlanData?.plan
        console.log("Plan is : " , Plan)

        if (userPlanData?.tag === "Special") {
          console.log("user tag is :" , userPlanData?.tag)
        }else {
          console.log("User tag is :", userPlanData?.tag)

        

         // if (userPlanData?.tag === "Special"){

        //     //  DIRECT UPLOAD THE FILES 
        //     // File Upload Limit  : 1000 / 1gb
        //     // Plan : Premium

            

        // } 
      
            
        // Tag : Normal 
        // Plan : Free / Pro 
        // Upload_Limit : 500 / 1000

      


            if (userPlanData?.tag === "Normal") {
            let Max_File_Upload_Limit: number = 0;
            
            if (Plan === "Free") { 
                // 100 mb 
                Max_File_Upload_Limit = File_Upload_Limit.Free * 1024 * 1024;
            } else if (Plan === "Pro") { 
                // 500mb 
                Max_File_Upload_Limit = File_Upload_Limit.Pro * 1024 * 1024; 
            }

            // checking user's current usage 
            const files = await ctx.db.query("user_files").filter((q) => q.eq(q.field("userID"), userId)).collect();
           
            

            const usedBytes = await files.reduce((total, file) => total + Number(file.size), 0);
            console.log("usedBytes : " , usedBytes)

            const fileSizeNum = Number(args.filesize);
            const uploadingSize = usedBytes + fileSizeNum

            // if the limits exceeds then throw an error
            if (uploadingSize >= Max_File_Upload_Limit) {
                console.log(`Upload Limits Exceeds ! Storage : ${Max_File_Upload_Limit} < ${uploadingSize}`);

                throw new Error(`Upload Limits Exceeds ! Storage : ${Max_File_Upload_Limit} < ${uploadingSize}`)
               
            }
        //   If everyhting goes fine move to generating the url 
          
        }
      }

        // Preparing command
        const s3Key : string = `${userId}/${args.filename}`;

        
        const command = new PutObjectCommand({
            Bucket : process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key : s3Key,
            ContentType : args.filetype
        })


         // Generating the Pre-Signed URL and then returning it ! 
        const uploadURL = await getSignedUrl(s3Client , command , {
            expiresIn : 300 
        });

        console.log("Presigned URL from the mutation is :" , uploadURL)

         // Storing htis into user_files as metaData 
        if (!userId) {
            throw new Error("User ID is missing, cannot upload file.");
        }

        await ctx.db.insert("user_files" , {
            userID : userId,
            filename: args.filename,
            size : args.filesize , 
            s3Key , 
            uploadedAt: Date.now()
        });



        


           
    
        
   return uploadURL;
  }
})

export const userPlansandQuota = query({
  handler : async (ctx) => {
         const user = await ctx.runQuery(internal.myFunctions.smartUserId)
        if (!user) {
            return null;
        }
           const userId: string | null = user ? user._id : null;
           const userEmail: string = ( user && user.email ) ? user.email : "";

           // checking user's tag 
        const userPlanData  = await ctx.db.query("user_plans").filter((q) => q.eq(q.field("email"), userEmail)).first()
        const validity = userPlanData?.validityInReadableForm
        const Plan = userPlanData?.plan
        const tag = userPlanData?.tag
        let Max_File_Upload_Limit : number = 0 ;

         if (Plan === "Free") { 
                // 100 mb 
                Max_File_Upload_Limit = File_Upload_Limit.Free * 1024 * 1024;
            } else if (Plan === "Pro") { 
                // 500mb 
                Max_File_Upload_Limit = File_Upload_Limit.Pro * 1024 * 1024; 
            } else {
               Max_File_Upload_Limit = File_Upload_Limit.Premium * 1024 * 1024; 
            }


         // checking user's current usage 
            const files  = await ctx.db.query("user_files").filter((q) => q.eq(q.field("userID"), userId)).collect();

            const totalUsedBytes : number = files.reduce((sum, file) => sum + file.size, 0);
           
         
            return {Plan, tag, totalUsedBytes, Max_File_Upload_Limit, validity}
  }
})


export const fetchS3Key = query({
  handler :async (ctx) => {
     const user = await ctx.runQuery(internal.myFunctions.smartUserId)
        if (!user) {
            return null;
        }
           const userId: string | null = user ? user._id : null;


           const details   = await ctx.db.query("user_files").filter((q) => q.eq(q.field("userID"),userId)).order("desc").first()
           const s3Key : string = details?.s3Key || "";

       

           return s3Key

  }
})

export const ViewPDF = action ({
  args  : {
    s3Key : v.string()
  }, 
  handler : async (ctx, args) => {

    try {
      const command =  new GetObjectCommand({
        Bucket : process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key : args.s3Key
      })

       // Generating the Pre-Signed URL and then returning it ! 
        const viewURL = await getSignedUrl(s3Client , command , {
            expiresIn : 300 
        });

        console.log("viewURL : " , viewURL);

        return viewURL


    }catch (error){
      console.error("Error generating presigned URL:", error);
      // throw new Error("Failed to generate presigned URL for PDF viewing.");
    }

  }
})