import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { nanoid } from "nanoid";

import { api, internal } from "./_generated/api";






export const createPortal = mutation({
    args : {
        title : v.string(),
        description : v.string(), 
        clientEmail : v.string(), 

    },
    handler : async(ctx, args) => {
         const slug =  nanoid(10)


        


        const user = await ctx.runQuery(internal.myFunctions.smartUserId)
        if (!user) {
            return null;
        }
           const userId: string | null = user ? user._id : null;


         
        await ctx.db.insert("clientPortal" , {
            ...args,
            sharedURLslug: slug,
            createdAt: Date.now(),
            freelancerId: userId ?? "undefined "
        })

        //  inserting data into user-plans table 
        await ctx.runMutation(internal.myFunctions.user_plans);
        
        
    return slug

    }
})


// getting the data from the table : clientPortals using slug ! 
// usually returns only one portal ! 
export const getSpecificPortal = query({
    args : {
        slug : v.string()
    },
    handler : async (ctx , args) => {

        //  const user = await ctx.runQuery(internal.myFunctions.smartUserId)
        // if (!user) {
        //     return null;
        // }
        //    const userId: string | null = user ? user._id : null;
         

        const values = await ctx.db.query("clientPortal").filter( 
            (q) : any => 
                q.and(
                    q.eq(q.field("sharedURLslug"), args.slug) ,
                    // q.eq(q.field("freelancerId") , userId)
                )
        
        ).order("asc").collect();


        return values;
    }
})


// get the list of all the portals crated by the user ! 
export const getListofPortals = query ({
    handler : async (ctx ) => {
        // taking the userID 
        
         const user = await ctx.runQuery(internal.myFunctions.smartUserId)
        if (!user) {
            return null;
        }
           const userId: string | null = user ? user._id : null;

        // querying the table : clientPortal 
        const values: object = await ctx.db.query("clientPortal").filter((q) => q.eq(q.field("freelancerId"), userId)).order("desc").collect()

        return values;
    }
})


