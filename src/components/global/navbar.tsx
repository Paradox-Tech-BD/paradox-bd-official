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
      className={cn('z-40 fixed transition-all duration-500', {
        'top-0 left-0 right-0': !hasScrolled,
        'top-4 left-4 right-4': hasScrolled,
      })}
    >
      <nav 
        className={cn(
          'mx-auto border rounded-2xl transition-[max-width,background-color,box-shadow,backdrop-filter] duration-500',
          hasScrolled
            ? 'bg-dark-bg/70 backdrop-blur-2xl border-white/10 shadow-lg max-w-[1200px]'
            : 'bg-transparent border-transparent shadow-none max-w-[1400px]'
        )}
      >
        <div 
          className={cn(
            'flex items-center justify-between transition-all duration-500 px-6 lg:px-8',
            hasScrolled ? 'h-14' : 'h-20'
          )}
        >
          <SiteLogo settings={settings} theme="light" />
          <div className='flex items-center gap-3'>
            <NavigationMenu className='hidden md:block'>
              <NavigationMenuList className='space-x-8 group/nav'>
                {navbarMenuItems?.map((item) => (
                  <React.Fragment key={item._key}>
                    {!item.isButton ? (
                      <>
                        {item.menuItemType === 'group' ? (
                          <NavigationMenuItem>
                            <NavigationMenuTrigger className='font-mono uppercase tracking-[0.18em] text-[0.72rem] text-white/60 hover:text-white bg-transparent group-hover/nav:opacity-40 hover:!opacity-100 data-[state=open]:text-white'>
                              {item.title}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className='min-w-[180px] text-nowrap py-3 px-3 flex flex-col gap-1 bg-dark-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl'>
                              {item.pageReferences?.map((page) => (
                                <Link 
                                  key={page.slug} 
                                  href={resolveHref(page._type, page.slug ?? '') ?? '/'}
                                  className='group py-2 pl-3 pr-2 flex items-center justify-between gap-6 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all duration-200'
                                >
                                  {page.title}
                                  <ChevronRight 
                                    size={14} 
                                    className='text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all duration-300' 
                                  />
                                </Link>
                              ))}
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        ): (
                          <NavigationMenuItem>
                            <Link 
                              href={resolveHref(item?.pageReference?._type ?? '', item?.pageReference?.slug ?? '') ?? '/'}
                              className={cn('relative inline-flex font-mono uppercase tracking-[0.18em] text-[0.72rem] transition-all duration-300 group-hover/nav:opacity-40 hover:!opacity-100 group/menu-item', {
                                'text-white': pathname.includes(`/${item.pageReference?.slug ?? ''}`),
                                'text-white/60 hover:text-white': !pathname.includes(`/${item.pageReference?.slug ?? ''}`)
                              })}
                            >
                              <AnimatedText>
                                {item.title}
                              </AnimatedText>
                              <span className={cn(
                                'absolute -bottom-1 left-0 h-px bg-white transition-all duration-300',
                                pathname.includes(`/${item.pageReference?.slug ?? ''}`) ? 'w-full' : 'w-0 group-hover/menu-item:w-full'
                              )} />
                            </Link>
                          </NavigationMenuItem>
                        )}
                      </>
                    ): (
                      <NavigationMenuItem>
                        <Button 
                          variant="primary" 
                          size="sm"
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
              <div className="md:hidden">
                <SlideOutMenu 
                  settings={settings} 
                  navigationSettings={navigationSettings}
                >
                  <button aria-label='Open menu' className='p-2.5 border border-white/10 rounded-full cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all duration-200'>
                    <Menu size={18} className='text-white/60' />
                  </button>
                </SlideOutMenu>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
