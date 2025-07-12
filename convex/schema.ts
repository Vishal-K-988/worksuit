import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";


// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  messages : defineTable({
    userId : v.string(),
    author : v.string(),
    message : v.string(),
    name : v.string()
  }), 

  clientPortal : defineTable(
    v.object({
      title : v.string(), 
      description : v.string() , 
      freelancerId : v.string(),
      clientEmail : v.string(), 
      sharedURLslug : v.string(), 
      createdAt : v.number()
    })
  ), 

  chatApp : defineTable(
    v.object({
      user : v.string(), 
      message : v.string() ,
      chatID : v.string(),
      userName : v.string()
    })
  ), 

 user_files :  defineTable(
  v.object({
    userID : v.string() , 
    filename : v.string() , 
    size : v.number(), 
    s3Key  : v.string(),
    uploadedAt : v.number()
  })
 ), 

 user_plans : defineTable(
  v.object({
    email : v.string(), 
    name : v.string(),
    validity : v.number(),
    validityInReadableForm : v.string(),
    // tag : normal / special
    tag : v.string() ,
    plan: v.string()

  })
 )



});
