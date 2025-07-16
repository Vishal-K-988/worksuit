import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const allenoire = localFont({
  src: [
  
    {
      path: '../app/../../public/fonts/Allenoire-regular.woff2', // Path relative to this file
      weight: '400',
      style: 'normal',
    },
     ],
  variable: '--font-allenoire', 
  display: 'swap', 
});

const britiSans = localFont({
  src : [
    {
      path : '../app/../../public/fonts/BritiSans.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable : '--font-britiSans',
  display: 'swap'
})


const britiSans_clients  = localFont({
  src : [
    {
      path : '../app/../../public/fonts/BritiSans.woff2',
      weight: '300',
      style: 'normal',
    }
  ],
  
  variable : '--font-britiSans',
  display: 'swap'
})
 

export const metadata: Metadata = {
  title: "workSuit — Professional Client Portals for Freelancers",
  description: "workSuit helps freelancers and consultants share deliverables, sign contracts, and get paid — all from one clean, branded link.",
  keywords: [
    "freelancer client portal",
    "freelance platform",
    "e-signature for freelancers",
    "stripe payment link",
    "project handoff tool",
    "client workspace",
    "contract signing",
    "freelancer tool",
    "freelance deliverables portal"
  ],
  authors: [{ name: "Vishal", url: "https://x.com/vishaal26x" }],
  creator: "Vishal",
  openGraph: {
    title: "workSuit — Professional Client Portals for Freelancers",
    description: "Everything a freelancer needs: contracts, payments, and project delivery in one link.",
    url: "https://worksuit.in", 
    siteName: "workSuit",
    images: [
      {
        url: "https://pbs.twimg.com/profile_banners/1937127930158530560/1750688913/1080x360", 
        width: 1200,
        height: 630,
        alt: "workSuit client portal preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "workSuit — One Link for All Your Freelance Work",
    description: "Look professional. Work efficiently. Get paid faster.",
    creator: "@vishaal26x",
    images: ["https://pbs.twimg.com/profile_banners/1937127930158530560/1750688913/1080x360"]
  },
  themeColor: "#ffffff",
  metadataBase: new URL("https://worksuit.in")
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="{allenoire.variable} {britiSans.variable}">
      <head>
    
        <link rel="icon" className="dark:invert" href="/Logo.svg" sizes="any" />
    
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
