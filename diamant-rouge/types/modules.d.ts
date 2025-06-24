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
  export const Linkedin: React.FC<LucideIconProps>;
  export const ArrowRight: React.FC<LucideIconProps>;
  export const MapPin: React.FC<LucideIconProps>;
  export const Mail: React.FC<LucideIconProps>;
  export const CheckCircle: React.FC<LucideIconProps>;
  export const Package: React.FC<LucideIconProps>;
  export const CreditCard: React.FC<LucideIconProps>;
  export const Shield: React.FC<LucideIconProps>;
  export const Edit: React.FC<LucideIconProps>;
  export const ShoppingCart: React.FC<LucideIconProps>;
  export const Check: React.FC<LucideIconProps>;
  export const Eye: React.FC<LucideIconProps>;
  export const HeartOff: React.FC<LucideIconProps>;
  export const LogIn: React.FC<LucideIconProps>;
  export const Lock: React.FC<LucideIconProps>;
  export const Calendar: React.FC<LucideIconProps>;
  export const Video: React.FC<LucideIconProps>;
  export const Users: React.FC<LucideIconProps>;
  export const Coffee: React.FC<LucideIconProps>;
  export const UserPlus: React.FC<LucideIconProps>;
  export const GlassWater: React.FC<LucideIconProps>;
  export const Utensils: React.FC<LucideIconProps>;
  export const EyeOff: React.FC<LucideIconProps>;
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

declare module 'bcryptjs' {
  interface BcryptJSInterface {
    hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
    hashSync(data: string | Buffer, saltOrRounds: string | number): string;
    compare(data: string | Buffer, encrypted: string): Promise<boolean>;
    compareSync(data: string | Buffer, encrypted: string): boolean;
    genSalt(rounds?: number): Promise<string>;
    genSaltSync(rounds?: number): string;
    getRounds(encrypted: string): number;
  }

  // Named exports
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  export function hashSync(data: string | Buffer, saltOrRounds: string | number): string;
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
  export function compareSync(data: string | Buffer, encrypted: string): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
  export function getRounds(encrypted: string): number;

  // Default export (for import bcrypt from 'bcryptjs')
  const bcrypt: BcryptJSInterface;
  export default bcrypt;
} 