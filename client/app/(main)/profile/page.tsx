"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Home } from "lucide-react";

// User data
const user = {
  id: "536bc8fc-8d4c-4690-aac5-d36a5224cf8e",
  fullName: "Mak Kaw",
  email: "makkaw@gmail.com",
};

// Profile cover with avatar
function ProfileCover() {
  return (
    <div className="relative">
      {/* Cover banner */}
      <div className="h-40 bg-[#9B8B7A]" />

      {/* Avatar overlapping cover */}
      <div className="absolute -bottom-12 left-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#A8E6CF] via-[#88D8B0] to-[#6BC5A0] border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-white text-3xl font-semibold">
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
      </div>
    </div>
  );
}

// Profile info section
function ProfileInfo() {
  // Truncate ID for display
  const truncatedId = `${user.id.slice(0, 8)}...${user.id.slice(-4)}`;

  return (
    <div className="pt-16 px-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.fullName}
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 rounded-full border-gray-300 text-gray-700 font-normal text-sm"
                >
                  {truncatedId}
                  <ChevronDown className="size-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.id)}
                >
                  Copy ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="h-9 px-4 rounded-full border-gray-300 text-gray-900 font-medium text-sm"
            >
              Edit profile
            </Button>
          </div>
          <p className="mt-4 text-gray-600 text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

// Tab navigation
function ProfileTabs() {
  return (
    <div className="border-b border-gray-200 mt-8">
      <div className="px-6 flex items-center gap-1">
        {/* Home icon tab */}
        <button className="h-12 px-4 flex items-center text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
          <Home className="size-5" />
        </button>

        {/* Created tab */}
        <button className="h-12 px-4 flex items-center gap-2 text-gray-900 font-medium border-b-2 border-gray-900">
          Created
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            1
          </span>
        </button>

        {/* Collections tab */}
        <button className="h-12 px-4 flex items-center gap-2 text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
          Collections
          <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
            1
          </span>
        </button>
      </div>
    </div>
  );
}

// NFT Grid
function NFTGrid() {
  return (
    <div className="px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* NFT Card - Mint/Teal gradient artwork */}
        <div className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-full h-full bg-gradient-to-br from-[#88D8B0] via-[#6BC5A0] to-[#4AA88A]" />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex-1 bg-white overflow-auto">
      <ProfileCover />
      <ProfileInfo />
      <ProfileTabs />
      <NFTGrid />
    </div>
  );
}
