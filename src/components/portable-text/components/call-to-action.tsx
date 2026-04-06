import { ButtonType } from "@/types";
import ButtonRenderer from "@/components/shared/button-renderer";

export default function CallToAction({ data }: {
  data: {
    callToActionTitle: string;
    callToActionParagraph: string;
    buttons: ButtonType[];
  }
}) {

  const { 
    callToActionTitle: title,
    callToActionParagraph: paragrapgh,
    buttons
  } = data

  return (
    <div className='mt-16 w-full p-8 flex flex-col md:flex-row items-start md:items-center gap-8 border border-white/[0.08] rounded-2xl bg-dark-card'>
      <div className="space-y-3">
        <div className="font-medium text-xl text-balance text-white">
          {title}
        </div>
        <p className="text-pretty text-white/40">
          {paragrapgh}
        </p>
      </div>
      {buttons && buttons.length > 0 && (
        <ButtonRenderer buttons={buttons} />  
      )}
    </div>
  )
}