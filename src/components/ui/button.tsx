import Link from "next/link";
import * as React from "react";
import { ButtonType } from "@/types";
import { ArrowRight } from "lucide-react";
import { cn, getAnchorHref, resolveHref } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "px-5 md:px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "text-dark-bg bg-white hover:bg-white/90",
        secondary: "text-white bg-white/10 hover:bg-white/[0.15] border border-white/10",
        tertiary: "text-white/70 hover:text-white border border-white/10 hover:border-white/20",
        outline: "text-white border border-white/20 hover:border-white/40 hover:bg-white/5",
        underline: "xl:px-0 mb-2 underline underline-offset-[10px] decoration-[1.5px] decoration-white/40 text-white/70 hover:text-white",
      },
      size: {
        default: "h-10 md:h-11",
        sm: "h-9 px-4 text-xs",
      },
      width: {
        auto: "w-auto",
        fullWidth: "w-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      width: "auto"
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
      disableIcon?: boolean;
      pageReference?: ButtonType['buttonPageReference'];
      externalUrl?: ButtonType['buttonExternalUrl'];
      fileUrl?: ButtonType['buttonExternalUrl']
      buttonType?: ButtonType['buttonType'];
      emailAddress?: ButtonType['buttonEmailAddress'];
      anchorLocation?: ButtonType['buttonAnchorLocation'];
      anchorId?: ButtonType['buttonAnchorId'];
    }

const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(({ 
  children, 
  className, 
  variant, 
  size, 
  width,
  disableIcon, 
  pageReference, 
  externalUrl, 
  emailAddress,
  fileUrl,
  buttonType, 
  anchorLocation,
  anchorId,
  ...props 
}, ref) => {

  switch (buttonType) {
    case 'internal':
      if (!pageReference) return null;
      return (
        <Link
          href={resolveHref(pageReference._type, pageReference.slug ?? '') ?? '/'}
          ref={ref}
          className={cn('group', buttonVariants({ variant, size, width, className }))}
          {...props}
        >
          {children} {!disableIcon && (<ButtonIcon />)}
        </Link>
      );
    case 'anchor':
      return (
        <Link
          href={getAnchorHref({ 
            anchorLocation: anchorLocation ?? 'currentPage', 
            anchorId: anchorId ?? '', 
            pageReference: pageReference ?? null
          })}
          ref={ref}
          className={cn('group', buttonVariants({ variant, size, width, className }))}
          {...props}
        >
          {children} {!disableIcon && (<ButtonIcon />)}
        </Link>
      );
    case 'external':
      return (
        <a 
          href={`${externalUrl}`}
          rel="noopener noreferrer" target="_blank"
          className={cn('group', buttonVariants({ variant, size, width, className }))}
        >
          {children} {!disableIcon && (<ButtonIcon />)}
        </a>
      );
    case 'fileDownload':
      return (
        <a 
          href={fileUrl ?? ''}
          download rel="noopener noreferrer" target="_blank"
          className={cn('group', buttonVariants({ variant, size, width, className }))}
        >
          {children} {!disableIcon && (<ButtonIcon />)}
        </a>
      );
    case 'emailAddress':
      return (
        <a 
          href={`mailto:${emailAddress}`}
          rel="noopener noreferrer" target="_blank"
          className={cn('group', buttonVariants({ variant, size, width, className }))}
        >
          {children} {!disableIcon && (<ButtonIcon />)}
        </a>
      );
  }
});

Button.displayName = "Button";

export { Button, buttonVariants };

function ButtonIcon() {
  return <ArrowRight size={16} className="transition duration-300 group-hover:translate-x-0.5" />
}
