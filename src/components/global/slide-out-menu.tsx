import Image from "next/image";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import SiteLogo from "../shared/site-logo";
import { useRouter } from "next/navigation";
import { cn, resolveHref } from "@/lib/utils";
import ButtonRenderer from "../shared/button-renderer";
import AnimatedUnderline from "../shared/animated-underline";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { GeneralSettingsQueryResult, NavigationSettingsQueryResult } from "../../../sanity.types";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

export default function SlideOutMenu({ children, settings, navigationSettings }: {
  children: React.ReactNode;
  settings: GeneralSettingsQueryResult;
  navigationSettings: NavigationSettingsQueryResult;
}) {

  const router = useRouter();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const { 
    slideOutMenuItems: menuItems,
    slideOutMenuButtons,
    slideOutMenuSettings,
    showCompanyDetailsSlideOutMenu
  } = navigationSettings?.slideOutMenu ?? {};

  return(
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className='overflow-y-scroll pb-44 bg-white border-l border-gray-200/60'>
        <SheetHeader className='z-20 fixed top-0 pt-[26px] right-7 w-[338px] md:w-[330px] h-20 border-b border-gray-200/60 bg-white/95 backdrop-blur-xl'>
          <SiteLogo settings={settings} theme='dark' />
        </SheetHeader>
        <SheetTitle className='mt-16 px-0 py-6 antialiased font-normal text-gray-400 mono-label'>
          Navigate
        </SheetTitle>
        <ul className='px-0 flex flex-col gap-4 text-gray-900'>
          {menuItems?.map((item) => {
            return (
              <React.Fragment key={item?._key}>
                {item.menuItemType === 'group' ? (
                  <Collapsible 
                    open={openItems[item._key]}
                    onOpenChange={(open) => (
                      setOpenItems(prev => ({ ...prev, [item._key]: open }))
                    )}
                    className="space-y-3.5"
                  >
                    <CollapsibleTrigger className="relative flex items-center gap-2 text-3xl tracking-tight group text-gray-900">
                      <span className="relative">
                        {item.title} 
                        <AnimatedUnderline className='h-[2px] bg-blue-600' />
                      </span>
                      <ChevronDown 
                        size={23} 
                        className={cn('translate-y-0.5 rotate-0 transition-transform duration-200 text-blue-600', {
                          'rotate-180': openItems[item._key]
                        })}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-200">
                      {item?.pageReferences?.map((item) => (
                        <SheetClose key={item.title}>
                          <button 
                            onClick={() => {
                              router.push(resolveHref(item._type ?? '', item.slug ?? '') ?? '/');
                              setOpenItems(prev => ({ ...prev, [item.title ?? '']: false }));
                            }}
                            className='relative block text-xl tracking-tight text-gray-500 hover:text-blue-600 group transition-colors duration-200'
                          >
                            {item.title}
                            <AnimatedUnderline className='h-[1.5px] bg-blue-600' />
                          </button>
                        </SheetClose>
                      ))}                        
                    </CollapsibleContent>
                  </Collapsible>
                ): (
                  <SheetClose>
                    <button 
                      onClick={() => (
                        router.push(resolveHref(item.pageReference?._type ?? '', item.pageReference?.slug ?? '') ?? '/')
                      )}
                      className='relative block text-3xl tracking-tight group text-gray-900 hover:text-blue-600 transition-colors duration-200'
                    >
                      {item.title}
                      <AnimatedUnderline className='h-[2px] bg-blue-600' />
                    </button>
                  </SheetClose>
                )}
              </React.Fragment>
            )
          })}
        </ul>
        {showCompanyDetailsSlideOutMenu && (
          <>
            <SheetTitle className='border-t border-gray-200/60 mt-8 px-0 pt-8 antialiased font-normal text-gray-400 mono-label'>
              Contact
            </SheetTitle>
            <div className="mt-2 space-y-4">
              <a 
                href={`mailto:${slideOutMenuSettings?.companyEmailAddress ?? ''}`} 
                className="relative w-fit block text-2xl tracking-tight group text-gray-800 hover:text-blue-600 transition-colors duration-200"
              >
                {slideOutMenuSettings?.companyEmailAddress ?? ''}
                <AnimatedUnderline className='h-[2px] bg-blue-600' />
              </a>
            </div>
            <div className="mt-8 py-4 flex items-center gap-3 border-y border-gray-200/60">
              {slideOutMenuSettings?.companySocialMediaLinks?.map((item) => (
                <a 
                  key={item._key} 
                  href={item.profileUrl ?? ''} 
                  target="_blank" rel="noopener noreferrer"
                  className="p-3 border border-gray-200 rounded-full hover:border-blue-200 hover:bg-blue-50 group transition-all duration-300"
                >
                  <Image
                    src={item.icon?.asset?.url ?? ''}
                    width={16}
                    height={16}
                    alt={`Follow us on ${item.title ?? ''}`}
                    className="opacity-60 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </>
        )}
        {slideOutMenuButtons && slideOutMenuButtons.length > 0 && (
          <div className='pt-10 fixed bottom-1 right-0 w-full md:w-[380px] px-4 pb-4 bg-gradient-to-t from-white via-white/90 to-transparent'>
            <ButtonRenderer buttons={slideOutMenuButtons} classNames="flex-col md:flex-row" />  
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
