import { SignOut } from "../../components/Signout";
import Image from "next/image";
import {auth } from '@/../../auth'
import { redirect, RedirectType } from "next/navigation";
import { ChartPie } from 'lucide-react';

export default async function Dashboard() {
     const session = await auth()
    if(!session ) {
        redirect("/")
        return
    }


  return (
<>
<div className="">

  {/* sidebar */}
  <div
    id="sidebar"
    className="flex-col p-2 m-2 sm:m-3 bg-black/100 shadow-sm shadow-gray-400/50 rounded-xl fixed will-change-transform z-50 
    max-h-[calc(88vh-24px)] overflow-y-auto hide-scrollbar 
    transform -translate-x-full transition-transform duration-300 ease-in-out 
    top-1/2 -translate-y-1/2 left-1 sm:left-3 hover:translate-x-0"
  >

    {/* first section */}
    <div className="flex flex-col items-center px-1 py-2">
      {/* profile */}
      <div>
        <a href="/dashboard">
          <Image
            className="rounded-full w-12 sm:w-16"
            src={session?.user?.image ?? "/default_user.png"}
            alt="Waiting for Worksuit"
            width={40}
            height={10}
            priority
          />
        </a>
      </div>

      {/* username */}
      <div className="__className_faf8d7 sm:w-auto pt-3 px-4 text-center text-xl sm:text-2xl">
        <p>{session?.user?.name}</p>
      </div>
    </div>

    {/* menu section */}
    <div className="mt-1  px-4">
     <p className="border-t-3 border-gray-700/50 mt-1  py-2">

    </p>

      {[
        { name: "Dashboard", href: "/dashboard", icon: "chart-pie" },
        { name: "Notifications", href: "/user/project", icon: "megaphone" },
        { name: "Projects", href: "/user/project", icon: "file-text" },
        { name: "Schedules", href: "/user/project", icon: "calendar-days" },
        { name: "Clients", href: "/user/project", icon: "users-round" },
      ].map((item) => (
        <div
          key={item.name}
          className="my-1 sm:my-2 p-1 mask-b-from-neutral-50/90 hover:mask-none"
        >
          <a href={item.href} className="flex items-center gap-2">
            <Image
              src={`../../../${item.icon}.svg`}
              alt={item.icon}
              className="dark:invert"
              width={20}
              height={20}
            />
            <p className="__className_faf8d7 text-sm sm:text-md">
              {item.name}
            </p>
          </a>
        </div>
      ))}
    </div>

    {/* portal header */}
    <div className=" px-4">
    <p className="border-t-3 border-gray-700/50 mt-1  py-2">

    </p>
      <div className="flex justify-between items-center">
        <div className="__className_faf8d7 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl">Portal</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* search */}
          <a href="/project" className="p-1">
            <Image
              src="../../../search.svg"
              alt="search"
              className="dark:invert"
              width={20}
              height={20}
            />
          </a>
          {/* add */}
          <div>
            <Image
              src="../../../plus.svg"
              alt="plus"
              className="dark:invert"
              width={23}
              height={20}
            />
          </div>
        </div>
      </div>
    </div>

    {/* portal projects list */}
    <div>
      {[
        "Landing Page and Design ",
        "Inventory Management & Order Fulfillment System",
        "Employee Performance & Task Management Dashboard",
        "Subscription Box Management Application",
        "client5",
        "Project Alpha",
        "Design Sprint",
        "Client A",
        "Service Beta",
        "Product Gamma",
        "Task Board",
        "User Flow",
        "Client B",
        "Phase One",
        "Dev Build",
      ].map((client) => (
        <h1
          key={client}
          className="pb-3 my-1 px-4 text-sm sm:text-md __className_faf8d7 mask-b-from-neutral-200/60 hover:mask-none flex items-center gap-4 truncate-25ch"
        >
          <Image
            src="../../../Logo.svg"
            alt="Client"
            className="dark:invert rounded-2xl"
            width={20}
            height={20}
          />
          {client}
        </h1>
      ))}
    </div>
  </div>

  {/* main content */}
  <div className="flex items-center justify-center min-h-screen p-3 sm:p-4 md:p-5">
    <div className="__className_ca0933 p-4 sm:p-6 md:p-10 max-w-4xl w-full flex flex-col space-y-6 ring-2 ring-gray rounded-xl text-center">
      <main>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl">
          Welcome! <br /> {session?.user?.name}
        </h1>

        <div className="w-full sm:w-auto __className_faf8d7 shadow-lg text-white bg-gray-800 py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:border-gray-600 transition duration-300 ease-in-out hover:bg-gray-800 hover:scale-105">
          <SignOut />
        </div>
      </main>
    </div>
  </div>
</div>

</>

  );
}
