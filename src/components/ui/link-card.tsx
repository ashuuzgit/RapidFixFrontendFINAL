import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LinkCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title' | 'href'> {
  title: string;
  description: string;
  imageUrl?: string;
  emoji?: string;
  href: string;
}

const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ className, title, description, imageUrl, emoji, href, ...props }, ref) => {
    const cardVariants = {
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
      <Link href={href} passHref legacyBehavior>
        <motion.a
          ref={ref}
          className={cn(
            'group relative flex h-72 md:h-80 w-full min-w-[280px] flex-col justify-between overflow-hidden',
            'border-2 border-[var(--color-black)] bg-white p-6 md:p-8 text-[var(--color-black)] cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
            className
          )}
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          aria-label={`Link to ${title}`}
          {...props}
        >
          {/* Text content */}
          <div className="z-10 relative">
            <h3 className="mb-2 text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--color-black)] group-hover:text-[var(--color-primary)] transition-colors">
              {title}
            </h3>
            <p className="max-w-[80%] text-sm md:text-base font-medium text-black/70">
              {description}
            </p>
          </div>

          {/* Emoji/Image container with a subtle scale effect on hover */}
          <div className="absolute bottom-0 right-0 h-40 w-40 md:h-48 md:w-48 translate-x-1/4 translate-y-1/4 transform">
            {emoji ? (
              <motion.div
                className="flex h-full w-full items-center justify-center text-[100px] md:text-[140px] opacity-20 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12"
              >
                {emoji}
              </motion.div>
            ) : imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={`${title} illustration`}
                className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
              />
            ) : null}
          </div>
        </motion.a>
      </Link>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };
