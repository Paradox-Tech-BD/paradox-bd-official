import React from 'react';
import Link from 'next/link';
import Container from './container';
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
      className={cn('z-40 fixed top-0 left-0 w-full py-5 border-b border-lab-border bg-lab-bg/85 backdrop-blur-xl transition-all duration-300 ease-in-out', {
        'py-3 border-b border-lab-cyan/15 bg-lab-bg/95': hasScrolled
      })}
    >
      <Container className='flex items-center justify-between'>
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
                          <NavigationMenuTrigger className='text-slate-300 hover:text-lab-cyan bg-transparent group-hover/nav:opacity-40 hover:!opacity-100 data-[state=open]:text-lab-cyan'>
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className='min-w-[180px] text-nowrap py-3 px-3 flex flex-col gap-2 bg-lab-card border border-lab-border'>
                            {item.pageReferences?.map((page) => (
                              <Link 
                                key={page.slug} 
                                href={resolveHref(page._type, page.slug ?? '') ?? '/'}
                                className='group py-1.5 pl-3 pr-2 flex items-center justify-between gap-6 rounded-lg border border-lab-border hover:border-lab-cyan/30 hover:bg-lab-surface text-slate-300 hover:text-lab-cyan transition-all duration-200'
                              >
                                {page.title}
                                <ChevronRight 
                                  size={14} 
                                  className='text-slate-600 group-hover:text-lab-cyan group-hover:-translate-x-0.5 transition-all duration-300' 
                                />
                              </Link>
                            ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ): (
                        <NavigationMenuItem>
                          <Link 
                            href={resolveHref(item?.pageReference?._type ?? '', item?.pageReference?.slug ?? '') ?? '/'}
                            className={cn('relative overflow-hidden inline-flex text-sm transition-all duration-200 group-hover/nav:opacity-40 hover:!opacity-100 text-slate-300 hover:text-lab-cyan', {
                              'text-lab-cyan': pathname.includes(`/${item.pageReference?.slug ?? ''}`)
                            })}
                          >
                            <AnimatedText>
                              {item.title}
                            </AnimatedText>
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
              <button aria-label='Open menu' className='p-2.5 border border-lab-border rounded-full cursor-pointer hover:border-lab-cyan/40 hover:bg-lab-surface transition-all duration-200'>
                <Menu size={18} className='text-slate-300' />
              </button>
            </SlideOutMenu>
          )}
        </div>
      </Container>
    </header>
  )
}
