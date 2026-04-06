import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import useScroll from '@/hooks/use-scroll';
import SiteLogo from '../shared/site-logo';
import SlideOutMenu from './slide-out-menu';
import { usePathname } from 'next/navigation';
import { cn, resolveHref } from '@/lib/utils';
import { ChevronRight, Menu } from 'lucide-react';
import AnimatedText from '../shared/animated-text';
import { GeneralSettingsQueryResult, NavigationSettingsQueryResult } from '../../../sanity.types';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

interface NavbarProps {
  settings: GeneralSettingsQueryResult;
  navigationSettings: NavigationSettingsQueryResult;
}

export default function Navbar({ settings, navigationSettings }: NavbarProps) {

  const pathname = usePathname();
  const hasScrolled = useScroll();

  const { navbarMenuItems } = navigationSettings?.navbar ?? {};
  const { showSlideOutMenu } = navigationSettings?.slideOutMenu ?? {};
  
  return (
    <header 
      className={cn('z-40 fixed transition-all duration-500 ease-in-out', {
        'top-0 left-0 w-full': !hasScrolled,
        'top-3 left-3 right-3': hasScrolled,
      })}
    >
      <div 
        className={cn(
          'mx-auto flex items-center justify-between transition-all duration-500',
          hasScrolled
            ? 'bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm max-w-5xl px-4 py-3'
            : 'max-w-8xl px-4 md:px-8 py-5 md:py-6 bg-transparent'
        )}
      >
        <SiteLogo settings={settings} theme="dark" />
        <div className='flex items-center gap-3'>
          <NavigationMenu className='hidden md:block'>
            <NavigationMenuList className='space-x-8 group/nav'>
              {navbarMenuItems?.map((item) => (
                <React.Fragment key={item._key}>
                  {!item.isButton ? (
                    <>
                      {item.menuItemType === 'group' ? (
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className='text-gray-600 hover:text-gray-900 bg-transparent group-hover/nav:opacity-40 hover:!opacity-100 data-[state=open]:text-blue-600 text-sm font-medium'>
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className='min-w-[180px] text-nowrap py-3 px-3 flex flex-col gap-2 bg-white border border-gray-200 shadow-lg rounded-xl'>
                            {item.pageReferences?.map((page) => (
                              <Link 
                                key={page.slug} 
                                href={resolveHref(page._type, page.slug ?? '') ?? '/'}
                                className='group py-1.5 pl-3 pr-2 flex items-center justify-between gap-6 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 text-gray-600 hover:text-blue-600 transition-all duration-200'
                              >
                                {page.title}
                                <ChevronRight 
                                  size={14} 
                                  className='text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300' 
                                />
                              </Link>
                            ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ): (
                        <NavigationMenuItem>
                          <Link 
                            href={resolveHref(item?.pageReference?._type ?? '', item?.pageReference?.slug ?? '') ?? '/'}
                            className={cn('relative inline-flex text-sm font-medium transition-all duration-200 group-hover/nav:opacity-40 hover:!opacity-100 text-gray-600 hover:text-gray-900 group', {
                              'text-gray-900': pathname.includes(`/${item.pageReference?.slug ?? ''}`)
                            })}
                          >
                            <AnimatedText>
                              {item.title}
                            </AnimatedText>
                            <span className={cn(
                              'absolute -bottom-0.5 left-0 h-px bg-gray-900 transition-all duration-300',
                              pathname.includes(`/${item.pageReference?.slug ?? ''}`) ? 'w-full' : 'w-0 group-hover:w-full'
                            )} />
                          </Link>
                        </NavigationMenuItem>
                      )}
                    </>
                  ): (
                    <NavigationMenuItem>
                      <Button 
                        variant="primary" 
                        disableIcon={true}
                        buttonType="internal"
                        pageReference={item.pageReference}
                      >
                        {item.title}
                      </Button>
                    </NavigationMenuItem>
                  )}
                </React.Fragment>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {showSlideOutMenu && (
            <SlideOutMenu 
              settings={settings} 
              navigationSettings={navigationSettings}
            >
              <button aria-label='Open menu' className='p-2.5 border border-gray-200 rounded-full cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all duration-200'>
                <Menu size={18} className='text-gray-700' />
              </button>
            </SlideOutMenu>
          )}
        </div>
      </div>
    </header>
  )
}
