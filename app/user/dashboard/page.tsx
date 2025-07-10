'use client'


import { SignOut } from "@/components/Authentication/Signout";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Forms } from "../components/forms";





export default function Dashboard () {

  const [PortalList , setPortalList] = useState<any[]>([]);
  const data : any  =  useQuery(api.portals.getListofPortals);


  useEffect(() => {
    if (data) {
      setPortalList(data);
    }
  }, [data]);
  console.log("list of client POrtals : " , data )


 
     const generateUploadUrl = useMutation(api.myFunctions.generateUploadUrl);
  const sendImage = useMutation(api.myFunctions.sendImage);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    console.log("postURl: ", postUrl )
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    console.log("result: ", result)
    const { storageId } = await result.json();
    console.log("storageID : " , storageId)
    // Step 3: Save the newly allocated storage id to the database
    await sendImage({ storageId, author: name });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }


    if (data === undefined) {
        return (
            <div className="flex justify-center items-center h-screen  ">
                {/* You can use any loader component or simple text here */}
                <p>Did you know? Every client portal in workSuit comes with real-time chat, file sharing, and e-signing — all in one link.</p>
                {/* Example of a simple spinner (requires some CSS or a library like Tailwind's spin animation) */}
                {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div> */}
            </div>
        );
    }

  
  return (
    <>
      <div>
        {/* navbar  */}
        <div className="flex justify-around  shadow-sm shadow-amber-50  rounded-b-md  "> 
          <h1 className="font-semibold  font-mono "> workSuit</h1>
          <div>
            <SignOut/>
          </div>
        </div>

        {/* Title  */}
        <div className="flex justify-center py-2 m-5">
          <h1 className="font-serif  font-semibold  text-6xl ">Dashboard</h1>
        </div>

        <div className="flex justify-center items-baseline-last ">
          <form onSubmit={handleSendImage}>
            <input
            className=" shadow-amber-800  shadow-2xl rounded-3xl "
              type="file"
              accept="image/*"
              ref={imageInput}
              onChange={(event) => setSelectedImage(event.target.files![0])}
              disabled={selectedImage !== null}
            />
            <input
            className=""
              type="submit"
              value="Send Image"
              disabled={selectedImage === null}
            />
          </form>
        </div>

        {/* serving the file  */}
        <div className="flex items-center py-10 mx-10  my-5  rounded-3xl justify-around ring-2 ring-amber-300">
              Create a Portal ! 
        </div>

      {/* forms  */}
      <div>
       <Forms/>
      </div>

    
      {/*  Showing the list portals created by the user  ! */}

     
  <br /><br /><br />
      <div className=" border-t-amber-300 border-4 py-6 my-8 flex justify-center ">
      

        {/* here would be the list of portals  */}
        <div>
         
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PortalList.length > 0 ? (
                    PortalList.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg 
                                       transform hover:scale-105 transition-transform duration-300 ease-in-out
                                       border border-gray-200"
                        >
                          <a href={`http://localhost:3000/user/portals/${item.sharedURLslug}`}                                 target= {"_parent"}>                                              
                            <h3 className="text-xl font-semibold mb-2 text-blue-700">{item.title || "Untitled Portal"}</h3>

                          </a>
                            <p className="text-gray-600 mb-2">
                                <strong>Description:</strong> {item.description || "No description provided."}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Client Email:</strong> {item.clientEmail || "N/A"}
                            </p>
                           
                            <p className="text-sm text-gray-500">
                                <strong>Created:</strong> {new Date(item._creationTime).toLocaleString()}
                            </p>
                            <a
                                href={`http://localhost:3000/user/portals/${item.sharedURLslug}`}
                               target= {"_parent"}
                                rel="noopener noreferrer"
                                className="mt-4 inline-block text-blue-500 hover:underline"
                            >
                                View Portal
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500"> Create Portals  </p>
                )}
            </div>
        </div>
        
      </div>


      </div>
    </>
  );
}