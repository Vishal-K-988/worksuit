import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { redirect } from "next/navigation"
import { useState } from "react"




export const Forms = () => {



      const [Title , setTitle] = useState("")
      const [Description , setDescription ] = useState("")
      const [ClientEmail , setClientEmail ] = useState("")
      const [Slug , setSlug ] = useState("")



      const createPortal = useMutation(api.portals.createPortal)



      const submitClientCreationForm = async (e: React.FormEvent) => {

        e.preventDefault();
        console.log("title : " , Title)
        console.log("Description : " , Description)
        console.log("ClientEmail : " , ClientEmail)



        const PortalSlug =  await  createPortal({
          title: Title,
          description: Description,
          clientEmail: ClientEmail
        });

        setSlug(PortalSlug ?? "");

        console.log (Slug)
        
   
      }
    

      return(<>
      <div>
 
          <form   onSubmit={submitClientCreationForm}>
            
            {/* title  */}
            <div className=" flex justify-around ">
                 <label htmlFor="title" > Title </label>
            <input type="text" placeholder="WebDesign"   className="px-2 m-1 py-1 rounded " onChange={(e) => {
              setTitle(e.target.value)
            }}/>

            </div>

            {/* description  */}
              <div className=" flex justify-around ">
                 <label htmlFor="title" > Description  </label>
            <input type="text" placeholder="Changin the Landing page"   className="px-2 m-1 py-1 rounded " onChange={(e) => {
              setDescription(e.target.value)
            }}/>

            </div>


            {/* Client Email  */}
              <div className=" flex justify-around ">
                 <label htmlFor="title" > Client Email  </label>
            <input type="text" placeholder="client@gmail.com"   className="px-2 m-1 py-1 rounded " onChange={(e) => {
              setClientEmail(e.target.value)
            }}/>

            </div>

          

                <div className="flex justify-center p-4 m-4">
                    <button className=" rounded-xl shadow p-4 m-4 shadow-blue-700" type="submit" > Submit </button>
                </div>
            

           
          </form>

          <div className="flex justify-center font-sans text-xl  my-3 py-4 ">
            <h1>Slug is : {Slug}</h1>
          </div>


          {/* redirect it to : "/components/porta/[slug]/page.tsx"  */}
          <div className="flex justify-center ">
            <button className="ring-2 ring-blue-900 px-2 my-1 mx-2  rounded-xl p-3 " onClick={() => {
              redirect(`/user/portals/${Slug}`)
            }}> Navigate to {Title} Portal  </button>
          </div>
      </div>
    </>)
}