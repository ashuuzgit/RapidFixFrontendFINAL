"use client"

import React from 'react';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

// Props interface for type safety and clarity
interface LinkCardProps extends HTMLMotionProps<"a"> {
  title: string;
  description: string;
  imageUrl?: string;
  emoji?: string;
  icon?: React.ReactNode;
  centeredImage?: boolean;
  href: string;
}

const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ className, title, description, imageUrl, emoji, icon, centeredImage, href, ...props }, ref) => {
    // Animation variants for framer-motion
    const cardVariants: Variants = {
      initial: { scale: 1, y: 0 },
      hover: {
        scale: 1.03,
        y: -5,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
        },
      },
    };

    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group relative flex h-80 w-full max-w-sm flex-col justify-between overflow-hidden',
          'rounded-2xl border bg-card p-6 text-card-foreground shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={`Link to ${title}`}
        {...props}
      >
        {/* Text content */}
        <div className="z-10">
          <h3 className="mb-2 text-3xl font-black uppercase tracking-tight text-card-foreground">
            {title}
          </h3>
          <p className="max-w-[80%] font-medium text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Image/Emoji container with a subtle scale effect on hover */}
        {(imageUrl || emoji || icon) && (
          <div className={cn(
            "absolute",
            centeredImage 
              ? "bottom-6 right-6 h-28 w-28 flex items-center justify-center" 
              : "bottom-0 right-0 h-48 w-48 translate-x-1/4 translate-y-1/4 transform"
          )}>
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={`${title} illustration`}
                className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
              />
            ) : icon ? (
              <motion.div 
                className="flex items-center justify-center h-full w-full p-6 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12"
              >
                {icon}
              </motion.div>
            ) : (
              <motion.span 
                className="flex items-center justify-center h-full w-full text-8xl transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12"
              >
                {emoji}
              </motion.span>
            )}
          </div>
        )}
      </motion.a>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };
