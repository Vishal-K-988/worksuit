'use client'



import Contract from "@/components/contract/contract"





export default  function PDF(){


    
    return (<>
   

        {URL ?  
        <div>
        <Contract/>
        </div>

         
         : <div className="flex justify-center h-screen items-center"> <h1>
                    Loading Contract 
                 </h1> 
                 
            </div> }


    </>)
}