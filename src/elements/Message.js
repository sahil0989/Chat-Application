import React from 'react';

export default function Message({ own, text, scrollRef }) {
  return (
    <div ref={scrollRef} className={`max-w-[300px] md:max-w-[600px] w-fit px-4 py-2 my-2 rounded-t-lg ${own ? "bg-[#16a34a] rounded-l-lg text-right self-end" : "bg-[#353535] rounded-r-lg text-left self-start"} text-white`}>
      {text}
    </div>
  );
}
