import { SignOut } from "../components/Signout";
import Image from "next/image";
import {auth } from '@/../../auth'
import { redirect, RedirectType } from "next/navigation";

export default async function Dashboard() {
     const session = await auth()
    if(!session ) {
        redirect("/")
        return
    }


  return (
<>

    {/* navbar */}
    <div className="flex justify-between px-7 m-4 shadow-xl rounded-3xl">

{/* Worksuit Logo */}
    <div className="">
          <div >
             <Image  className="rounded-md"
                      src="/Logo.svg"
                      alt="Waiting for Worksuit "
                      width={40}
                      height={10}
                      priority />
         </div>
    </div>

{/* Signout Button */}
    <div>
         <div  className="w-full sm:w-auto  __className_faf8d7  shadow-lg text-white bg-gray-800  py-3 mb-2 px-6 rounded-lg  hover:border-gray-600 transition  duration-300 ease-in-out hover:bg-gray-800 hover:scale-105">
               <SignOut/>
               </div>
    </div>

 </div>

<div className="flex items-center justify-center min-h-screen p-4 ">

{/* main component  */}
<div className=" __className_ca0933 p-6 md:p-10 max-w-4xl w-full flex flex-col space-y-6 ring-2 ring-gray rounded-xl  text-center ">
<main>
  <h1 className="text-6xl ">{session?.user?.name} </h1>

</main>

</div>


</div>
</>

  );
}
