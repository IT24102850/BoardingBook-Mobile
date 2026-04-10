import React, { useEffect, useState } from 'react';

// Use images from public folder for production
const getImagePaths = () => [


 
  '/images/boardingpics/philip-kuo-tuM6OqyhTm0-unsplash.jpg',
  '/images/boardingpics/marcus-loke-WQJvWU_HZFo-unsplash.jpg',
  '/images/boardingpics/lotus-design-n-print-WDUtNbot6Qw-unsplash.jpg',
  '/images/boardingpics/lisa-anna-l3gjB0DnZOY-unsplash.jpg',
  '/images/boardingpics/lisa-anna-HvVvt4PfINM-unsplash.jpg',
  '/images/boardingpics/lisa-anna-H2QZH7K6uAw-unsplash.jpg',
  '/images/boardingpics/lisa-anna-DR2ZXxZpU1o-unsplash.jpg',
  '/images/boardingpics/julia-K-ndOjMfxKs-unsplash.jpg',
  '/images/boardingpics/fredrik-ohlander-pfXBfFG30TA-unsplash.jpg',
  '/images/boardingpics/dad-hotel-P6B7y6Gnyzw-unsplash.jpg',
  '/images/boardingpics/cat-han-VgyN_CWXQVM-unsplash.jpg',
  '/images/boardingpics/brad-chapman-nc12fovsZsE-unsplash.jpg',
  '/images/boardingpics/andrea-davis-yi8JorcxASc-unsplash.jpg',
  '/images/boardingpics/alex-tyson-6cMRL_hVMHU-unsplash.jpg',
  '/images/boardingpics/alen-rojnic-T1Yvmf4oleQ-unsplash.jpg',
];

const images = getImagePaths();

export const BoardingSlideshow: React.FC<{ className?: string }> = ({ className }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={className || "rounded-3xl w-[420px] h-[540px] shadow-lift transition-all duration-700 bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] flex items-center justify-center overflow-hidden"}>
      <img
        src={images[idx]}
        alt="Boarding House"
        className="w-full h-full object-cover"
        style={{ transition: 'all 0.7s' }}
      />
    </div>
  );
};

