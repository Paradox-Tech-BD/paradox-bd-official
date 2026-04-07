export default function AnimatedText({ children }: { 
  children: React.ReactNode 
}) {
  return (
    <span className="pointer-events-none relative block h-5 overflow-hidden leading-5">
      <span className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/menu-item:-translate-y-5">
        <span className="flex h-5 items-center">
          {children}
        </span>
        <span className="flex h-5 items-center">
          {children}
        </span>
      </span>
    </span>
  )
}