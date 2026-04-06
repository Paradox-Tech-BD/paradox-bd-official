import Link from "next/link";
import * as React from "react";
import { ButtonType } from "@/types";
import { ArrowRight } from "lucide-react";
import { cn, getAnchorHref, resolveHref } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "px-4 md:px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "text-lab-bg bg-lab-cyan hover:bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.3)] hover:shadow-[0_0_24px_rgba(34,211,238,0.5)]",
        secondary: "text-lab-text bg-lab-card border border-lab-border hover:border-lab-cyan/40 hover:bg-lab-surface",
        tertiary: "text-lab-cyan border border-lab-cyan/30 hover:border-lab-cyan/70 bg-transparent hover:bg-lab-cyan/10",
        outline: "text-slate-300 border border-slate-700 hover:border-lab-cyan/50 hover:text-lab-cyan bg-transparent backdrop-blur",
        underline: "xl:px-0 mb-2 underline underline-offset-[10px] decoration-[1.5px] decoration-lab-cyan text-lab-cyan",
      },
      size: {
        default: "h-9 md:h-10",
        sm: "h-9 px-4",
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
