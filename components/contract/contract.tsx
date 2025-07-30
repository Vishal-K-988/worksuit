'use client'
import Pdfview from "@/app/user/components/pdfview"
import SignPreview from "@/app/user/components/signPreview"
import { useAction, useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { useState } from "react"

const   Contract  = () =>  {
    

    
    const [URL, setURL]= useState("");

    // we are getting the s3Key from "useFiles "
    const getS3Key =  useQuery(api.myFunctions.fetchS3Key);
        console.log("getS3Key : " , getS3Key)

    const ViewURL = useAction(api.myFunctions.ViewPDF)

   
    // wrapping logic into main() as I need to await the response ! <Promise>
    async function main () {
        try {

            const ActiveViewPresignedURL =await  ViewURL({
                s3Key : getS3Key || "" 
            })
            
            setURL(ActiveViewPresignedURL || "")


        }catch{
            console.log("Error while  getting the url ")
        }
    }


    main ()
    

    return (<>
        <div className="px-6 py-4 mx-3 my-2"> 
                    <h1 className="  font-serif text-4xl font-semibold flex justify-center ">
                        Contract Signing
                    </h1>

            <div className="flex justify-center  gap-12 px-9 py-8">   
                {/* showing PDF */}
                <Pdfview URL= {URL}/>
                

                {/* Signning pdf */}
                    <div>
                         <SignPreview/>
                    </div>

            </div>
        </div>
    </>)

    
}

export default Contract