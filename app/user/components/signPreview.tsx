'use client'

import Image from "next/image";
import { useState } from "react";
import SignatureCanvas from "../components/react-Signatue-canvas-file/index";

export default function SignPreview() {
const [Sign, setSign] = useState()
const [URL, setURL] = useState("")


function handleClear (){
  Sign.clear();
}

function handleSave (){
 setURL( Sign.getTrimmedCanvas().toDataURL ('image/png') )
}

console.log("sign :", Sign)
console.log("URL : "  , URL)

 return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center   gap-16 sm:p-20">
     <h1 className="  font-serif text-4xl font-semibold ">
      Decode this Captcha if not ROBOT!  
     </h1>
     <div className="border-2 ring-2 ring-emerald-500   ">
      <SignatureCanvas penColor="white" backgroundColor="black" canvasProps={{width: 500, height: 200, className: 'sigCanvas'}}  ref={data => setSign(data)}  />
     </div>
     <div>
      <div className="px-2 py-4 gap-6 flex ">

      
      <button className="shadow-md ring-2  rounded-lg px-3 " onClick={handleClear}>Clear </button>
      <button className="shadow-md ring-2  rounded-lg px-3 " onClick={handleSave}>Save </button>
      </div>

      
     </div>

  <div className="my-4 py-5">
     {URL
        ? <img className="ring-2 rounded-xl px-2 py-2 ring-emerald-900" alt='signature' src={URL} />
        : null}
  </div>

    </div>
  );
}
