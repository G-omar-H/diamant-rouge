// Type declarations for modules that might be missing during build
declare module 'framer-motion' {
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler;
    children?: React.ReactNode;
    layout?: boolean;
    onKeyDown?: React.KeyboardEventHandler;
    whileHover?: any;
    whileTap?: any;
  }

  export const motion: {
    div: React.ForwardRefExoticComponent<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    button: React.ForwardRefExoticComponent<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>;
  };

  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    mode?: string;
  }>;
}

declare module 'lucide-react' {
  interface LucideIconProps {
    size?: number | string;
    className?: string;
    color?: string;
  }

  export const X: React.FC<LucideIconProps>;
  export const Diamond: React.FC<LucideIconProps>;
  export const Send: React.FC<LucideIconProps>;
  export const Clock: React.FC<LucideIconProps>;
  export const ChevronRight: React.FC<LucideIconProps>;
  export const ShoppingBag: React.FC<LucideIconProps>;
  export const Heart: React.FC<LucideIconProps>;
  export const User: React.FC<LucideIconProps>;
  export const LogOut: React.FC<LucideIconProps>;
  export const MessageSquare: React.FC<LucideIconProps>;
  export const ShieldCheck: React.FC<LucideIconProps>;
  export const Menu: React.FC<LucideIconProps>;
  export const Search: React.FC<LucideIconProps>;
  export const PhoneCall: React.FC<LucideIconProps>;
  export const ChevronDown: React.FC<LucideIconProps>;
  export const Instagram: React.FC<LucideIconProps>;
  export const Facebook: React.FC<LucideIconProps>;
  export const Twitter: React.FC<LucideIconProps>;
  export const Phone: React.FC<LucideIconProps>;
  export const ChevronLeft: React.FC<LucideIconProps>;
}

declare module 'next/image' {
  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    priority?: boolean;
    placeholder?: string;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    sizes?: string;
    quality?: number;
    fill?: boolean;
  }

  const Image: React.FC<ImageProps>;
  export default Image;
} 