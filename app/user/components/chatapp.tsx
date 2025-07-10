'use Client'
import { api } from "@/convex/_generated/api"
import { useMutation, useQueries, useQuery } from "convex/react"
import { SendHorizonal } from "lucide-react"
import {  useEffect, useState } from "react"
import React from "react"


export interface ChatAppProps {
    slug: string;
    // other props...
}

export const ChatApp =  ({ slug}: ChatAppProps) => { 
     
    
        // got the slug
        
    

    const [Message , setMessage] = useState("");

    const sendMessage = useMutation(api.chatapp.sendMessage);
   


        // if the slug is not present or undefined or not loaded till now then do this ! 
    if(!slug || slug === undefined){
        return (
            <div className="flex justify-center items-center h-screen">
                {/* You can use any loader component or simple text here */}
                <p>Loading portal data...</p>
                {/* Example of a simple spinner (requires some CSS or a library like Tailwind's spin animation) */}
                {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div> */}
            </div>
        );

    }
    
    console.log("slug value:  ",  slug)

    const getMessages = useQuery(api.chatapp.getMessages ,{
            chatID : slug
    })

    
    useEffect(()=>{

    console.log("messages are : " , getMessages)

    } , [getMessages] )





    // useEffect( () => {
    //     console.log ("Messasge : "  , Message)
    // } , [Message] )

    
    return(<>
    
      <div className=" flex  justify-center text-5xl font-serif">
            <h1>
                Chat Application
                 <p className="border-1 border-zinc-500 rounded-2xl mx-8 px-2 my-0.5 ">

            </p>
            </h1>
           
            <br /><br />

            
      </div>
      <br />


      
       {/* chat application interface  */}
            <div className=" border-2 border-amber-300 gap-1 py-4 my-3 px-4 rounded-2xl mx-4 flex justify-around">

        {/* chat section  */}
                <div className=" border-2   px-3 py-3  rounded-2xl border-amber-600 ">
                
                      {/* Display list of messages  */}
                      {/* Display list of messages */}
                    <div className="px-2 m-1 h-96 overflow-y-auto"> {/* Added fixed height and scroll for chat display */}
    {Array.isArray(getMessages) ? (
        [...getMessages].reverse().map((msg: any) => (
            <div key={msg._id} className="mb-2 p-2 border rounded-lg bg-gray-100">
                <p className="font-semibold text-blue-800">{msg.userName}:</p>
                <p className="text-gray-700">{msg.message}</p>
                <p className="text-xs text-gray-500 text-right">
                    {new Date(msg._creationTime).toLocaleTimeString()}
                </p>
            </div>
        ))
    ) : (
        <p className="text-gray-400 text-center">Loading messages...</p>
    )}
</div>

                    {/* send Message Section  */}

                    <div className=" border-2 rounded-2xl border-b-emerald-500 py-3 px-2 my-2 mx-2 ">

                        {/* text message area */}
                        <input type="text" placeholder="Write message " className="text-2xl items-center font-serif" onChange={async ( e) => {
                            setMessage(e.target.value)
                          


                        }} />

                        {/* send button  */}
                        <button className=" rounded-4xl  " onClick={async () => {
                           
                            
                           const data =  await sendMessage({message : Message, chatID : slug})
                            console.log ("Inserted Message : " , data )
                        
                            
                        }}>
                            
                                <SendHorizonal className=" border-1 rounded-2xl px-2 my-2 items-center  " width={50} height={45}/>
                          
                        </button>


                    </div>
                    
                </div>
                   
                   {/* user section  */}
                {/* <div className=" border-2 border-amber-800  rounded-2xl px-3 py-2 ">
                     <h2 className=" text-xl  flex justify-center ">
                        Users  
                     </h2>
                     <p className="border-2 border-b-gray-700 px-2 mb-2 ">

                     </p>
                     <h2 className=" text-xl ">
                        Vishal 
                     </h2>
                        <h2 className=" text-xl ">
                        Karthik  
                     </h2>
                </div> */}

            </div>

    </>)
 }

