'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { ChatApp } from "../../components/chatapp";



type Portalprops = {
    params: {
        slug: string
    }
}

const Slug = ({ params: paramsPromise }: Portalprops) => {
      const params = React.use(paramsPromise); 

    // got the slug
    const { slug } = params;

    // this will return only 1 portal (or an array if your Convex query returns multiple)
    // The 'data' will be 'undefined' initially while fetching.
    const data = useQuery(api.portals.getSpecificPortal, {
        slug: slug
    });

    console.log("data : ", data);

    // --- Add the loader logic here ---
    if (data === undefined) {
        return (
            <div className="flex justify-center items-center h-screen">
                {/* You can use any loader component or simple text here */}
                <p>Loading portal data...</p>
                {/* Example of a simple spinner (requires some CSS or a library like Tailwind's spin animation) */}
                {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div> */}
            </div>
        );
    }
    // --- End loader logic ---

    // Now 'data' is either an array (if multiple items match) or null/empty array if none.
    // Ensure 'data' is treated as an array for the map function.
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
                        "No portal found with this slug." // Message if no data is found after loading
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