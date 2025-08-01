import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/app/ConvexClientProvider";
import { ThemeProvider } from "../components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worksuit - ",
  description: "Everything for Freelancer",
  icons: {
    icon: "/worksuit.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider> 
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        > 
       
      
           
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <header>
          <ModeToggle/>
        </header>
             {children} 
             </ThemeProvider>
          
         
        </body>
      </html>
       </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
