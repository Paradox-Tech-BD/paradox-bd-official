import { formatDate } from "@/lib/utils";

export default function Date({ date }: { date: string; }) {
  return(
    <span className='text-sm font-medium text-white/40'>
      {`${formatDate(date)}`}
    </span>
  )
}