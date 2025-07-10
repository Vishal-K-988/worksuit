
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";



// // Sending Message 
// export const sendMessage = mutation({
//     args : {
//         portalSlug : v.string(), 
//         message : v.string(),
//     }, 
//     handler : async (ctx , args ) => {

//         // getting the userID 
//         const user = await ctx.runQuery(internal.myFunctions.smartUserId);
//         if (! user) {
//             return null ;
//         }
//         const userID : string  = user ? user._id : "";

//         await ctx.db.insert("chatApp" , {
//             ...args , 
//             senderID : userID,
//             createdAT : Date.now()
//         })
//     }
// })

// // recive message 
// export const getMessages = query({
//     args : {
//         portalSlug : v.string()
//     }, 
//     handler : async (ctx, args ) => {
//      const user = await ctx.runQuery(internal.myFunctions.smartUserId);
//         if (! user) {
//             return null ;
//         }
//         const userID : string  = user ? user._id : "";



//         const data = await ctx.db.query("chatApp").filter( (q) : any  => q.and (
//             q.eq(q.field("senderID"),userID ),
//             q.eq(q.field("portalSlug"), args.portalSlug)
//         ) ).order("desc").take(50);

//         return data 

//     }
// })


// Sending Messages 
export const sendMessage = mutation({
    args : {
        message : v.string(),
        chatID : v.string()
    }, 
    handler : async (ctx, args) => {
        //   getting the userID 
        const user = await ctx.runQuery(internal.myFunctions.smartUserId);
        if (! user) {
            return null ;
        }
        const userID : string  = user ? user._id : "";
        const userName: string = ( user && user.name)  ? user.name : "";


        const data = await ctx.db.insert("chatApp" , {
            user : userID, 
            message : args.message,
            chatID : args.chatID,
            userName : userName 
        })

        console.log ("message inserted into chatroomID ")
        return data ;
    }
})

// Recieving Message 
export const getMessages = query({
    args : {
        chatID : v.string()
    } ,
    handler : async (ctx, args ) => {

        if (args.chatID === undefined ) {
            return null
        }
        const messages : any = await ctx.db.query("chatApp").filter((q ) : any => {
           return  q.eq(q.field("chatID") , args.chatID)
        }).order("desc").take(50);

        console.log ("Grabbing the messages ");
        return messages
    }
})