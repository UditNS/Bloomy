import React from 'react'
import Sign1 from "../../assets/sign1.png";
import Sign2 from "../../assets/sign2.png";
import Sign4 from "../../assets/sign4.png";

const Image = ({Avatar, showImg}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10"></div>
      
      {showImg && (
        <img
          className="absolute bottom-1/4 left-32 w-20 h-20 transition-transform duration-300 hover:scale-110"
          src={Sign1}
          alt="Decoration"
        />
      )}
      
      <img
        className="absolute top-12 left-12 w-20 h-20 transition-all duration-300 hover:rotate-12 hover:scale-110"
        src={Sign2}
        alt="Decoration"
      />
      
      <img
        className="absolute bottom-1 -right-1.5 w-20 h-20 transition-all duration-300 hover:rotate-3 hover:scale-110"
        src={Sign4}
        alt="Decoration"
      />
      
      <img
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] transition-transform duration-500 hover:scale-105"
        src={Avatar}
        alt="Avatar"
      />
      
      {/* Gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
    </div>
  )
}

export default Image