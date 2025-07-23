'use Client'
import { api } from "@/convex/_generated/api"
import { useMutation,  useQuery } from "convex/react"
import { LetterText,  SendHorizonal } from "lucide-react"
import {  useEffect, useState } from "react"
import React from "react"
  import { GoogleGenAI } from "@google/genai";

import { InputFile } from "@/components/ui/fileUpload"


type Message = {
    _id : string, 
    userName: string;
  message: string;
  _creationTime: number;

}


    // console.log("Gemini api key:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export interface ChatAppProps {
    slug: string;
    // other props...
}

export const ChatApp =  ({ slug}: ChatAppProps) => { 
     const [Message, setMessage] = useState(""); // This is for USER INPUT
    const [GeminiResponse, setGeminiResponse] = useState(""); // This is for GEMINI'S STREAMED OUTPUT
    const [Loading, setLoading] = useState(false);
    //    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    
    const sendMessage = useMutation(api.chatapp.sendMessage);

    // getting all the details of the user ! 
    const userDetails = useQuery(api.myFunctions.userPlansandQuota);
    let strictlyTruncatedNumber : number = 0 ;

    if (userDetails?.validity) {
        const rawValue = userDetails?.totalUsedBytes / 1048576;;
        strictlyTruncatedNumber = Math.floor(rawValue * 100) / 100;
    }
   
    // if (!slug || slug === undefined) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <p>Loading portal data...</p>
    //         </div>
    //     );
    // }

    const getMessages = useQuery(api.chatapp.getMessages, {
        chatID: slug
    })

    useEffect(() => {
        console.log("messages are : ", getMessages)
    }, [getMessages])

    // Using gemini to enhance the message 
    async function Enhancer() {
        // 1. Capture the current user message to send to Gemini
        const currentMessageToEnhance = Message;

        // 2. Clear the user's input textarea immediately
        setMessage("");

        // 3. Clear the previous Gemini response and set loading state
        setGeminiResponse(""); // Clear previous Gemini output
        setLoading(true);

        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

        try {
            const response = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: [{ text: currentMessageToEnhance }], // Send the captured message
                config: {
                    systemInstruction: "Make the response slightly professional but in human written manner. Don't use * in the repsonse. If the user has used bullet points in the content make sure you also use the points in the response  ",
                },
            });

            for await (const chunk of response) {
                // Append each chunk to the GeminiResponse state
                setGeminiResponse(prevResponse => prevResponse + chunk.text);
            }
        } catch (error) {
            console.error("Error fetching Gemini response:", error);
            setGeminiResponse("Error: Could not retrieve response.");
        } finally {
            setLoading(false);
        }
    }


    // file upload Logic 
    // async  function FileUpload (event: React.ChangeEvent<HTMLInputElement>) {
    //         if (event.target.files && event.target.files.length > 0) {
    //     setSelectedFile(event.target.files[0]);
    //     console.log("selectedFile: " , selectedFile )
    //   }
    // }


 

    
    return(<>

 {!slug ? (
      <div className="flex justify-center items-center h-screen">
        <p>Loading portal data...</p>
      </div>
    ) : (
      <div> {/* normal page UI */} </div>
    )}
 
    
    <div className="flex justify-center text-5xl font-serif">
                <h1>
                    Chat Application
                    <p className="border border-zinc-500 rounded-2xl mx-8 px-2 my-0.5 ">

                    </p>
                </h1>
                <br /><br />
            </div>
            <br />

            {/* chat application interface */}
            <div className=" border-2 border-amber-300 gap-1 py-4 my-3 px-4 rounded-2xl mx-4 flex justify-around">

                {/* chat section */}
                <div className=" border-2 px-3 py-3 rounded-2xl border-amber-600 ">

                    {/* Display list of messages */}
                    <div className="px-2 m-1 h-96 overflow-y-auto">
                        {Array.isArray(getMessages) ? (
                            [...getMessages].reverse().map((msg: Message) => (
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

                    {/* Send Message Input Section */}
                    <div className=" border-2 rounded-2xl flex items-center border-b-emerald-500 py-3 px-2 my-2 mx-2">
                        {/* User Input Textarea */}
                        <textarea
                            placeholder="Enter your message"
                            className="flex-grow text-2xl font-serif rounded-lg p-2 mr-2 resize min-w-[200px]"
                            value={Message} // This textarea is solely for user input
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            rows={1}
                            style={{ minHeight: '45px' }}
                        />

                        {/* Enhance button */}
                        <button className="rounded-3xl px-3 flex-shrink-0" onClick={Enhancer} disabled={Loading || Message.trim() === ''}>
                            <LetterText className="border rounded-2xl px-2 my-2 items-center" width={50} height={45} />
                        </button>

                        {/* Send button */}
                        <button className="rounded-4xl pr-1 flex-shrink-0 ml-2" onClick={async () => {
                            const data = await sendMessage({ message: Message, chatID: slug });
                            console.log("Inserted Message : ", data);
                            setMessage(""); // Clear message after sending to Convex
                        }}>
                            <SendHorizonal className="border rounded-2xl px-2 my-2 items-center" width={50} height={45} />
                        </button>

                       
                               
                     

                       
                    </div>

                    {/* Gemini Response Display Area */}
                    <div className="mt-4 border-2 rounded-2xl p-3 border-purple-500">
                        <h3 className="font-bold text-lg mb-2"> Gemini&apos;s Suggestion:</h3>
                        {Loading && GeminiResponse === "" ? ( // Show loader text only if loading and no partial response yet
                            <p className="text-gray-500 italic">Just a sec...</p>
                        ) : (
                            <textarea
                                value={GeminiResponse} // This textarea displays Gemini's output
                                readOnly
                                placeholder="Gemini's enhanced message will appear here..."
                                className="w-full text-lg font-serif p-2 resize-y rounded-lg bg-gray-800 text-white" // Added text styling and background
                                rows={Math.max(3, GeminiResponse.split('\n').length)} // Dynamic rows, min 3
                                style={{ minHeight: '100px' }}
                            />
                        )}

                        <button onClick={() => {
                            setMessage(GeminiResponse)
                        }}>
                            Use this 
                        </button>
                    </div>
                        
                        
                    
                </div>
                   
                   {/* File Upload Section  */}
                   <div>
                    <InputFile/>
                    <br /><br /><br /><br /><br /><br /><br />

{/* reset of the code  */}
                    {/* diplaying user quotas and all  */}
                    
                    {userDetails ?<div className="ring-2 ring-green-500 font-mono text-xl rounded-2xl px-6 py-5 mx-2">
                        <h1> Plan : {userDetails?.Plan}</h1>
                        <h1> Tag : {userDetails?.tag}</h1>
                         <h1> Used Storage :{strictlyTruncatedNumber}MB</h1>
                        <h1> Upload Limit Storage :  {userDetails?.Max_File_Upload_Limit / 1048576} MB</h1>
                        <h1> Upload Limit Storage : {userDetails?.validity}</h1>


                        
                    </div> : <div></div> }



                   </div>
                        
               

            </div>

    </>)
 }

