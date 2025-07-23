import { useAuthActions } from "@convex-dev/auth/react";
import { GoogleLogo } from "@/components/Authentication/GoogleLogo";



export function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  return (
   
      <>
  
          <div className=" rounded-2xl  shadow-amber-200 shadow-sm font-extralight text-xl p-9 ">
            <button className=" " onClick={() => void signIn("google", {
              redirectTo: "/user/dashboard"
            })} >
          <GoogleLogo className=" w-20 h-10 py-1 my-2 mx-2" /> 
          
          Get Started 
        </button>
            
          </div>
           

     
 </>
     
  );
}