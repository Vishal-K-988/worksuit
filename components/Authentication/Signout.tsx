
'use client'; 

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation"; 
export function SignOut() {
  const { signOut } = useAuthActions();
  const router = useRouter(); 

  const handleSignOut = async () => {
    try {
      await signOut(); // Wait for the signOut operation to complete
      router.push("/"); // Redirect to the home page using Next.js router
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };

  return (
    <button className="" onClick={handleSignOut}>Sign out</button>
  );
}