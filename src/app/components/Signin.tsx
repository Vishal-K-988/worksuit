
import { signIn } from '@/../../auth'
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", {
            redirectTo : '/user/dashboard'
        })
      }}
    >
      <button type="submit" >Get Started</button>
    </form>
  )
} 