import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  words: string[];
  loop?: boolean;
  speed?: number;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ words, loop = true, speed = 70, className }) => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentWord = words[wordIdx];

    if (!deleting && charIdx < currentWord.length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), speed);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), speed / 2);
    } else {
      if (!deleting && loop) {
        timeout = setTimeout(() => setDeleting(true), 1200);
      } else if (deleting) {
        timeout = setTimeout(() => {
          setDeleting(false);
          setWordIdx((wordIdx + 1) % words.length);
        }, 400);
      }
    }
    setDisplayed(currentWord.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, loop]);

  return <span className={className}>{displayed}<span className="animate-pulse">|</span></span>;
};
