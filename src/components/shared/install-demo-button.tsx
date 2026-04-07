"use client"
import { Copy } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { copyToClipboard } from "@/lib/utils";
import Heading from "./heading";

export default function InstallDemoButton() {
  
  function handleClick() {
    copyToClipboard('npx sanity dataset import demo-content.tar.gz production')
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Heading tag="h2" size="xxl" className='max-w-[420px] relative pr-2.5 py-3 text-balance leading-normal text-white'>
        <span className='relative z-20'>
          Paradox-BD
        </span>
      </Heading>
      <button 
        onClick={() => handleClick()} 
        className="flex flex-col items-center gap-6 text-base text-white/60 cursor-pointer hover:opacity-80 transition-opacity"
      >
        Run the command to install demo content <span className="flex items-center gap-2 text-lg bg-white text-dark-bg px-3 py-1 rounded-lg">npx sanity dataset import demo-content.tar.gz production <Copy size={16} /></span>
      </button>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: 'text-sm font-semibold antialiased',
          style: {
            borderRadius: '300px',
            padding: '4px 8px',
            color: '#0c0c12',
            fontWeight: '500',
            backgroundColor: '#ededf0'
          }
        }}
      />
    </div>
  )
}
