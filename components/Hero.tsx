import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { GoogleGenAI } from '@google/genai';

const Hero: React.FC = () => {
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/1920/1080?grayscale&blur=2");
  const [isLoading, setIsLoading] = useState(true);
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: 'A lavish, opulent background evoking a mix of Moulin Rouge and Great Gatsby vibes. Picture a grand ballroom with soaring Art Deco architecture, draped in rich red velvet curtains. Theatrical, warm lighting casts a golden glow on geometric patterns and polished surfaces. The atmosphere is mysterious, glamorous, and exclusive, hinting at an extravagant party just out of frame. The color palette should be dominated by deep reds, blacks, and shimmering gold. Photorealistic, cinematic, 8k resolution.',
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
          const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
          const fullImageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
          
          const img = new Image();
          img.src = fullImageUrl;
          img.onload = () => {
            setImageUrl(fullImageUrl);
            setIsLoading(false);
          };
        }
      } catch (error) {
        console.error("Failed to generate hero image:", error);
        setIsLoading(false);
      }
    };

    generateImage();
  }, []);

  const handleJoinWaitlistClick = () => {
    document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Opacity for the background image. Fades out over 600px of scroll.
  // Combines loading state with scroll effect.
  const bgOpacity = isLoading ? 0.5 : Math.max(0, 1 - offsetY / 600);

  // Opacity for the hero content. Fades out a bit faster, over 500px.
  const contentOpacity = Math.max(0, 1 - offsetY / 500);


  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden palm-overlay">
       <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url('${imageUrl}')`,
          opacity: bgOpacity,
          transform: `translateY(${offsetY * 0.5}px)`,
          willChange: 'transform, opacity',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent"></div>
      </div>
      
      <div 
        className="relative z-10 text-center px-4"
        style={{
          opacity: contentOpacity,
          willChange: 'opacity',
        }}
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase holographic-text">
          Cabana
        </h1>
        <p className="mt-4 text-lg md:text-xl text-neutral-300 tracking-wide font-light">
          Luxury. Exclusivity. Connection.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={handleJoinWaitlistClick} className="w-full sm:w-64">
            Join Waitlist
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-64">
            Early Access Login
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
