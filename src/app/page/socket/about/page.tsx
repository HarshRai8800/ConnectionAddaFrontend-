"use client"

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";

function AboutPage() {
  return (
    <div className="min-h-screen w-[95vw] bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-6 text-white">About the Developer</h1>

      {/* Avatar Section */}
      <Avatar className="w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-gray-700 shadow-md hover:scale-105 transition-all duration-300">
        <AvatarImage
          src="https://github.com/shadcn.png" // Replace with your avatar URL
          alt="Developer Avatar"
          className="w-full h-full object-cover"
        />
        <AvatarFallback className="bg-red-500 text-white flex items-center justify-center text-2xl font-bold">
          HR
        </AvatarFallback>
      </Avatar>

      {/* Developer Info */}
      <div className="text-center">
        <p className="text-lg font-medium mb-2">Harsh Rai</p>
        <p className="text-sm text-gray-400 mb-6">
          Full Stack Developer | MERN | Next.js | Prisma | PostgreSQL | Serverless
        </p>

        {/* Info Bar */}
        <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-purple-800 to-blue-900 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
          <p className="text-white text-center text-md md:text-lg font-semibold">
          &quot;I specialize in building scalable and modern web applications using technologies like Next.js, MERN stack, Prisma, PostgreSQL, and Serverless. Always excited to contribute to open-source and innovate in full-stack development!&quot;

          </p>
        </div>
      </div>
<div>
        {/* Contact Details */}
        <div className="flex flex-col items-center mt-4 gap-4">
          {/* GitHub */}
          <a
            href="https://github.com/HarshRai8800"
            target="_github"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all"
          >
            <AiFillGithub className="text-2xl" />
            GitHub: <span className="underline">HarshRai8800</span>
          </a>

          {/* Google ID */}
          <a
            href="mailto:harshrai8800@gmail.com"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all"
          >
            <AiOutlineMail className="text-2xl" />
            Google ID: <span className="underline">harshrai8800@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} Harsh Rai. All rights reserved.
      </footer>
    </div>
  );
}

export default AboutPage;
