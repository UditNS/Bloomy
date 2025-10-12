import React from 'react'

function UserCard({ user }) {
  return (
    // Full screen component
    <div className="flex items-center justify-center w-full min-h-screen pt-20 scroll-smooth">
    {/* Image card component  */}
        <div className="w-full max-w-[500px] aspect-[5/6] rounded-xl overflow-hidden mx-4 relative m-2 border-2">
            <img 
                className=" w-full h-full object-cover" 
                src={user.photo}
                alt={user.firstName + "'s Display Picture"} 
            />
            <div className='absolute bottom-5 left-5 mr-2 flex items-end text-white'>
                <h2 className='text-4xl font-semibold text-shadow-sm text-shadow-black'>{user.firstName}<span>&nbsp;</span></h2>
                <p className='text-3xl font-medium text-shadow-sm text-shadow-black'>{user.age}</p>
            </div>
            
        </div>
        
    </div>
)
}

export default UserCard