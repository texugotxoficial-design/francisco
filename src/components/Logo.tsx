import React from 'react';
import { Cake } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  iconSize = 40, 
  textSize = "text-xl", 
  showText = true 
}) => {
  return (
    <div className={cn("flex items-center gap-3 group/logo", className)}>
      <div 
        style={{ width: iconSize + 16, height: iconSize + 16 }}
        className="bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] p-2.5 rounded-[1.25rem] shadow-lg shadow-purple-500/20 flex items-center justify-center border border-white/30 transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-6 group-hover/logo:shadow-purple-500/40"
      >
        <Cake style={{ width: iconSize, height: iconSize }} className="text-white transition-transform duration-500 group-hover/logo:scale-110" strokeWidth={2.5} />
      </div>
      {showText && (
        <div className={cn("font-black tracking-tighter flex items-center leading-none transition-colors duration-300", textSize)}>
          <span className="text-slate-900 dark:text-white uppercase">LS Doce</span>
          <span className="text-primary italic ml-2.5 transition-all duration-300 group-hover/logo:ml-3">Amor</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
