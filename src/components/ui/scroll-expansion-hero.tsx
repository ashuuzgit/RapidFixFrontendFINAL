'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image' | 'sequence';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [targetProgress, setTargetProgress] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameImages, setFrameImages] = useState<HTMLImageElement[]>([]);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setTargetProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0004;
        setTargetProgress((prev) => {
          const newProgress = Math.min(Math.max(prev + scrollDelta, 0), 1);
          if (newProgress >= 1) {
            setMediaFullyExpanded(true);
            setShowContent(true);
          } else if (newProgress < 0.75) {
            setShowContent(false);
          }
          return newProgress;
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Slower and smoother touch scrolling to prevent bouncy layout shifts
        const scrollFactor = 0.002;
        const scrollDelta = deltaY * scrollFactor;
        
        setTargetProgress((prev) => {
          const newProgress = Math.min(Math.max(prev + scrollDelta, 0), 1);
          if (newProgress >= 1) {
            setMediaFullyExpanded(true);
            setShowContent(true);
          } else if (newProgress < 0.75) {
            setShowContent(false);
          }
          return newProgress;
        });

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const [targetDimensions, setTargetDimensions] = useState({ width: 1550, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileState(isMobile);
      setTargetDimensions({
        width: isMobile ? window.innerWidth * 0.95 : Math.min(1550, window.innerWidth * 0.95),
        height: isMobile ? window.innerHeight * 0.85 : 800
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const springProgress = useSpring(0, { damping: 40, stiffness: 80, mass: 1 });

  useEffect(() => {
    springProgress.set(targetProgress);
  }, [targetProgress, springProgress]);

  useEffect(() => {
    if (mediaType === 'sequence') {
      const loaded: HTMLImageElement[] = [];
      for (let i = 1; i <= 240; i++) {
        const img = new window.Image();
        img.src = `/carFrames/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
        loaded[i] = img;
      }
      setFrameImages(loaded);
    }
  }, [mediaType]);

  // Track the current frame using a ref so we don't need state updates
  const currentFrameIndexRef = useRef(240);

  // Directly draw to canvas when springProgress changes (bypasses React render)
  useMotionValueEvent(springProgress, "change", (latest) => {
    setScrollProgress(latest); // Update state for other components that might need it (like opacity)
    if (mediaType === 'sequence') {
      const frame = Math.max(1, Math.min(240, Math.floor(240 - latest * 239)));
      if (frame !== currentFrameIndexRef.current) {
        currentFrameIndexRef.current = frame;
        if (frameImages[frame] && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          const img = frameImages[frame];
          if (img.complete && img.naturalHeight !== 0) {
            ctx?.clearRect(0, 0, 1280, 720);
            ctx?.drawImage(img, 0, 0, 1280, 720);
          } else {
            img.onload = () => {
              ctx?.clearRect(0, 0, 1280, 720);
              ctx?.drawImage(img, 0, 0, 1280, 720);
            };
          }
        }
      }
    }
  });

  const mediaWidth = useTransform(springProgress, [0, 1], [300, targetDimensions.width]);
  const mediaHeight = useTransform(springProgress, [0, 1], [400, targetDimensions.height]);

  const textTranslateXLeft = useTransform(springProgress, [0, 1], ["0vw", isMobileState ? "-160vw" : "-60vw"]);
  const textTranslateXRight = useTransform(springProgress, [0, 1], ["0vw", isMobileState ? "160vw" : "60vw"]);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden bg-black'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              width={1920}
              height={1080}
              className='w-screen h-screen'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
            />
            <div className='absolute inset-0 bg-black/60' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              <motion.div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl'
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 60px rgba(255, 255, 255, 0.4)',
                  willChange: 'width, height'
                }}
                animate={{ filter: `blur(${Math.max(0, (scrollProgress - 0.8) * 20)}px)` }}
              >
                {mediaType === 'sequence' ? (
                  <div className='relative w-full h-full pointer-events-none'>
                    <canvas
                      ref={canvasRef}
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover rounded-xl'
                    />
                    <motion.div
                      className='absolute inset-0 bg-black/40 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/40 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className='w-full h-full object-cover rounded-xl'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/40 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover rounded-xl'
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-10 mt-6 transition-none'>
                  {date && (
                    <motion.p
                      className='text-2xl font-bold tracking-widest text-[var(--color-primary)]'
                      style={{ x: textTranslateXLeft }}
                    >
                      {date}
                    </motion.p>
                  )}
                  {scrollToExpand && (
                    <motion.p
                      className='text-[var(--color-primary)] font-bold text-center mt-2 tracking-widest uppercase text-sm'
                      style={{ x: textTranslateXRight }}
                    >
                      {scrollToExpand}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-5xl md:text-7xl lg:text-8xl font-black text-white transition-none uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] whitespace-nowrap'
                  style={{ x: textTranslateXLeft }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-5xl md:text-7xl lg:text-8xl font-black text-center text-[var(--color-primary)] transition-none uppercase tracking-tight drop-shadow-[0_0_20px_var(--color-primary)] whitespace-nowrap'
                  style={{ x: textTranslateXRight }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>

              {/* Post-Expansion Scroll Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: scrollProgress > 0.8 ? (scrollProgress - 0.8) * 5 : 0 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce text-white pointer-events-none z-50"
              >
                <span className="font-black text-white uppercase tracking-tight text-4xl mb-2 drop-shadow-[15px_15px_15px_rgba(255,255,255,0.7)]">SCROLL DOWN</span>
                <ChevronDown className="w-10 h-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" strokeWidth={3} />
              </motion.div>
            </div>

            <motion.section
              className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
