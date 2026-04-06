"use client"
import ReactPlayer from "react-player";

export default function Video({ data }: {
  data: { videoUrl: string; };
}) {
  return (
    <div className='mt-12 overflow-hidden border border-white/[0.08] rounded-xl aspect-video'>
      <div className="h-full w-full overflow-hidden">
        <ReactPlayer 
          url={data.videoUrl} 
          width="100%"
          height="100%"
          playing={false}
          controls={true}
        />
      </div>
    </div>
  )
}
