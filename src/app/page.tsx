import Image from "next/image";

export default function Home() {
  return (
//    <div className="m-50 ">
   
//     <main>


      
 
// <div className="flex justify-center">

// <div class="grid grid-cols-10 gap-4">
//   {/* Worksuit */}
//   <div class="col-span-4 col-start-4">
//     <h1 className="text-9xl font-serif font-extrabold">Worksuit</h1>
//   </div>


// {/* tagline */}
//   <div class="col-start-1 col-end-3 ...">
// <h1 className="text-3xl">Your all-in-one workspace to share deliverables, sign contracts, and collect payments — PROFESSIONALLY </h1>
//   </div>


//   {/* image */}
//   <div class="col-span-2 col-start-8">
    
//       <Image  className=""
//           src="/Waiting.svg"
//           alt="Waiting for Worksuit "
//           width={190}
//           height={50}
//           priority />
//   </div>
//   <div class="col-start-1 col-end-7 ...">04</div>
// </div>

// </div>

//     </main>


//       </div>



<body className="flex items-center justify-center min-h-screen p-4 ">

    <div className="p-6 md:p-10 max-w-4xl w-full flex flex-col space-y-6 ring-2 ring-gray rounded-xl  ">

        <div className="__className_ca0933  text-black text-5xl md:text-6xl lg:text-7xlf text-center   pb-4  " >
            Worksuit
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            {/* <div className=" __className_faf8d7 p-6 flex items-center justify-center text-black text-4xl   flex-1 min-h-[150px]">
              The modern way to run your freelance workflow
            </div> */}

            <p className=" __className_faf8d7 p-6 flex items-center justify-center text-black text-3xl   flex-1 min-h-[150px]">
 The modern way to run your freelance workflow
            </p>

            <div className=" p-6 flex items-center justify-center text-black text-2xl font-semibold flex-1 min-h-[150px]">
                 <Image  className=""
          src="/Waiting.svg"
          alt="Waiting for Worksuit "
          width={190}
          height={50}
          priority />
                </div>
        </div>


{/* Button components */}

{/* after words gonna make the ux changes  */}
       <div className="flex flex-col  gap-5  sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
    <a href="https://www.youtube.com/" target="_blank" className="w-full sm:w-auto">
        <button className=" __className_faf8d7 w-full shadow-lg    text-black  py-3 px-6 rounded-lg text-lg hover:scale-105 transition duration-300 ease-in-out
        ">
            Watch Demo
        </button>
    </a>
    <a href="https://www.google.com/" target="_blank" className="w-full sm:w-auto">
        <button className=" __className_faf8d7 w-full shadow-lg text-white bg-gray-800  py-3 px-6 rounded-lg text-lg hover:border-gray-600 transition  duration-300 ease-in-out hover:bg-gray-800 hover:scale-105
        ">
            Get Started
        </button>
    </a>
</div>

    </div>

</body>

  );
}
