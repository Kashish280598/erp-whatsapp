import './InfiniteAutoSwiper.css';

interface Image {
  id: string;
  image: string;
}

interface InfiniteAutoSwiperProps {
  images: Image[];
}

export const InfiniteAutoSwiper = ({ images }: InfiniteAutoSwiperProps) => {
  // Create duplicate array for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="scroller">
      <div className="scroller__inner">
        {/* First set of images */}
        <div className="flex items-center">
          {duplicatedImages.map((img, index) => (
            <div 
              key={`${img.id}-${index}`} 
              className="flex items-center justify-center px-4.5"
              style={{ height: '17px' }} // Ensure consistent height
            >
              <img 
                src={img.image} 
                alt={img.id} 
                className="w-auto h-[100%] object-contain" 
                style={{ 
                  display: 'block',
                  maxWidth: '100%',
                  verticalAlign: 'middle'
                }}
              />
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div className="flex items-center" aria-hidden="true">
          {duplicatedImages.map((img, index) => (
            <div 
              key={`${img.id}-duplicate-${index}`} 
              className="flex items-center justify-center px-4 w-[120px]"
              style={{ minHeight: '32px' }} // Ensure consistent height
            >
              <img 
                src={img.image} 
                alt={img.id}
                className="w-auto h-[20px] sm:h-[24px] lg:h-[28px] object-contain"
                style={{ 
                  display: 'block',
                  maxWidth: '100%',
                  verticalAlign: 'middle'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  