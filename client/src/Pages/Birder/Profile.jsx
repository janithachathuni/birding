import React from 'react'

const ProfileHeader = () => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-4">
      {/* Banner image */}
      <div className="h-48 bg-blue-400 overflow-hidden">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Dendrocygna_javanica_-_Chiang_Mai.jpg/500px-Dendrocygna_javanica_-_Chiang_Mai.jpg" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Profile content */}
      <div className="relative px-4 pb-4">
        {/* Profile image */}
        <div className="absolute left-4 -top-20">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Dendrocygna_javanica_-_Chiang_Mai.jpg/500px-Dendrocygna_javanica_-_Chiang_Mai.jpg" 
            alt="Profile" 
            className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
          />
        </div>
        
        {/* User info */}
        <div className="mt-20">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">John Doe</h2>
              <p className="text-gray-600">@johndoe</p>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors">
              Edit profile
            </button>
          </div>
          
          <p className="my-3 text-gray-900">
            Digital creator | Photography enthusiast | Coffee lover | Exploring the world one pixel at a time
          </p>
          
          {/* Additional details */}
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
              </svg>
              New York, NY
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11.96 14.946c-.033 0-.062-.01-.093-.01-1.28 0-2.44-.78-2.93-1.97-.19-.51-.29-1.06-.29-1.63 0-2.52 2.06-4.56 4.58-4.56s4.58 2.06 4.58 4.56v.04c0 .55-.1 1.08-.29 1.58-.49 1.19-1.65 1.98-2.93 1.98-.03 0-.07 0-.1-.01zm3.41-2.35c.16-.41.25-.85.25-1.3v-.04c0-1.68-1.38-3.06-3.08-3.06s-3.08 1.38-3.08 3.06c0 .45.09.89.25 1.3.31.76 1.03 1.26 1.83 1.26.71 0 1.36-.38 1.72-1l.28.17c.25.15.57.15.82 0l.28-.17c.36.62 1.01 1 1.72 1 .8 0 1.52-.5 1.83-1.26z" />
                <path d="M18.99 6.59c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1s1-.45 1-1v-12c0-.55-.45-1-1-1zm-14.98 0c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1s1-.45 1-1v-12c0-.55-.45-1-1-1z" />
              </svg>
              johndoe.com
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              Joined September 2018
            </span>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 text-gray-600 text-sm">
            <span className="hover:underline cursor-pointer">
              <strong className="text-gray-900 font-bold">356</strong> Following
            </span>
            <span className="hover:underline cursor-pointer">
              <strong className="text-gray-900 font-bold">4.2K</strong> Followers
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader