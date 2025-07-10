import { v } from "convex/values";
import { query, mutation, internalQuery, internalMutation } from "./_generated/server";

import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

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
      const futureDate = new Date() ; 
      futureDate.setFullYear(
        today.getFullYear() + 100
      )

      const validityTimestamp = futureDate.getTime();




      // Assign validity based on email
      if (specialEmails.includes(userEmail)) {
          validity = validityTimestamp;
      } else {
        // Default validity for non-special users (e.g., current time, or 0, or 1 year)
        // Let's set it to the current timestamp for others as per your `let validity = Date.now();`
        validity = Date.now(); 
      }

      
      await ctx.db.insert("user_plans", {
        name: userName,
        email: userEmail,
        validity: validity, 
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

