
import React from 'react'

import animationData from "@/utils/animation/Animation - 1736859700036.json"
import Lottie from 'react-lottie'
function EmptyChatContainer() {
  return (
    <div className="flex flex-col items-center justify-center w-[100vw] h-screen bg-zinc-900 text-center">
      {/* Animation */}
      <div className="w-1/3 md:w-1/3 mb-6">
        <Lottie options={{animationData}}  />
      </div>

      {/* Welcome Text */}
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500">
          Hi there!
        </h1>
        <p className="text-lg text-gray-400 mt-4">
          Start chatting by adding contacts.
        </p>
      </div>
    </div>
  )
}

export default EmptyChatContainer