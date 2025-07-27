'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { ChatApp } from "../../components/chatapp";

type PageProps = {
  params: Promise <{
    slug: string;
  } >
};

const Slug = ({ params }: PageProps) => {
  const { slug } = React.use(params);

    
    const data = useQuery(api.portals.getSpecificPortal, {
        slug: slug
    });

    console.log("data : ", data);

//    loader
    if (data === undefined) {
        return (
            <div className="flex justify-center items-center h-screen">
              
                <p>Loading portal data...</p>
              
            </div>
        );
    }
   

   
    const portalItems = Array.isArray(data) ? data : (data ? [data] : []);


    return (
        <>
            <h1> ChatRoom Id : {slug}</h1>

            <div className="flex justify-center px-2">
                <h1 className="text-3xl ">
                    {portalItems.length > 0 ? ( // Check if there are items to map
                        portalItems.map((item) => (
                            <div key={item._id} className="mb-2 p-2 border rounded ring-2 ring-blue-400">
                                <div><strong> Title: </strong> {item.title}</div>
                                <div><strong>Description:</strong> {item.description}</div>
                                <div><strong>ClientEmail:</strong> {item.clientEmail}</div>
                                <div><strong>PortalURL :</strong>
                                    http://localhost:3000/user/portals/{item.sharedURLslug}
                                </div>
                                <div className="font-mono mask-y-to-yellow-900"><strong>Created:</strong> {new Date(item._creationTime).toLocaleString()}</div>
                            </div>
                        ))
                    ) : (
                        "No portal found with this slug."
                    )}
                </h1>
            </div>
                
                {/* chat application */}

                    <div className="my-8 py-8 px-2 r ">
                        <ChatApp slug={slug} />

                    </div>
           

        </>
    );
}

export default Slug;