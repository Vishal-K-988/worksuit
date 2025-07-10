"use client";

import { SignInWithGoogle } from "@/components/Authentication/Signin";
import { SignOut } from "@/components/Authentication/Signout";
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import Image from "next/image";





export default function Home() {

  const data = useQuery(api.myFunctions.example, {a : 6 , b : 8})
  const user_id = useQuery(api.myFunctions.userID, {email: "vishalkumarvkvk977@gmail.com"})
  console.log(user_id)



  // testing Schema 
  const testingSchemas = useQuery(api.myFunctions.messages);
  console.log(testingSchemas)

  // inserting into messages schema 
  const insertMessage = useMutation(api.myFunctions.insertMessages,)
  const handleClick = () => {
    insertMessage( {
    author : "vishal" ,
    message : "first message"
  })
  }
  

    // quering the data 
 
            const fetch = useQuery(api.myFunctions.fetchData)

  
  // updating messages docs using 
  return (
    <>
  {/* loader */}
    <AuthLoading>

      <div className="flex justify-center items-center h-screen ">
            <h1 className="text-4xl  font-mono font-semibold "> workSuit is loading ...</h1>
      </div>
      
    </AuthLoading>

      <Unauthenticated>
        <div>
           {/* to make the content at the center  */}
                <div className="h-screen flex justify-center items-center  ">
          
                {/*  image and login button  */}
                  <div className="flex flex-row justify-around items-center gap-60 ">
          
                     <div  className="row-1">
                          
                            <Image src={"/Main.jpg"} alt="Main image" className="rounded-2xl"   width={430}  height={1}/>
                      </div>
                          <SignInWithGoogle/>
                     
          
                  </div>
                   
                </div>
        </div>
    
      </Unauthenticated>
      <Authenticated>

        <div>
           {/* to make the content at the center  */}
                <div className="h-screen flex justify-center items-center  ">
          
                {/*  image and login button  */}
                  <div className="flex flex-row justify-around items-center gap-60 ">
          
                     <div  className="row-1">
                          
                            <Image src={"/Main.jpg"} alt="Main image" className="rounded-2xl"   width={430}  height={1}/>
                      </div>
                     <SignOut/>
                     
          
                  </div>
                   
                </div>
        </div>

   


        <div className="mb-9">
          <h1 className="flex justify-center font-bold font-serif text-3xl">Please press the above logout button </h1>
        </div>
        <div className="flex justify-center text-2xl ">
           {data}
           <br />
           <p className=" px-8 mx-2 items-center ring-2 ring-amber-400"> 
            {user_id ? (typeof user_id === "string" ? user_id :  `Users table id:  "${user_id._id}" `) : "not available"}
           </p>

        </div>
        


       


{/* inserting into the messages table  */}
        <div>
          <div className="ring ring-amber-700 p-4 m-5 font-mono justify-center flex  ">
            <button onClick={handleClick}>click to insert the data </button>
          </div>
        </div>


<div>
  <div>
    {fetch
            ? fetch.map((item) => (
                <div key={item._id} className="mb-2 p-2 border rounded ring-2 ring-blue-400">
                  <div><strong>Author:</strong> {item.author}</div>
                  <div><strong>Message:</strong> {item.message}</div>
                  <div className="font-mono mask-y-to-yellow-900"><strong>Created:</strong> {new Date(item._creationTime).toLocaleString()}</div>
                </div>
              ))
            : "No messages found."}
  </div>
</div>
<br /> <br /><br />
      </Authenticated>




   
    </>
  );
}
