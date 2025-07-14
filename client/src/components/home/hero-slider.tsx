import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SliderImage } from "@shared/schema";

const slides = [
  {
    title: "아이들의 희망찬 미래를 위해",
    subtitle: "따뜻한 보금자리, 안전한 성장환경을 제공합니다",
    buttons: [
      { text: "협의회 소개", variant: "default" as const, href: "/about" },
      { text: "후원하기", variant: "outline" as const, href: "/donation" }
    ]
  },
  {
    title: "전문적인 아동보호 서비스",
    subtitle: "체계적인 교육과 지원으로 건강한 성장을 돕습니다",
    buttons: [
      { text: "사업소개", variant: "default" as const, href: "/business" },
      { text: "회원가입", variant: "outline" as const, href: "/" }
    ]
  },
  {
    title: "함께 만드는 따뜻한 세상",
    subtitle: "지역사회와 협력하여 아동복지 향상에 기여합니다",
    buttons: [
      { text: "공지사항", variant: "default" as const, href: "/announcements" },
      { text: "문의하기", variant: "outline" as const, href: "/donation" }
    ]
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이더 이미지를 서버에서 가져오기
  const { data: sliderImages = [] } = useQuery<SliderImage[]>({
    queryKey: ["/api/slider-images"],
    queryFn: async () => {
      const response = await fetch('/api/slider-images');
      if (!response.ok) {
        throw new Error('Failed to fetch slider images');
      }
      return response.json();
    },
  });

  // 활성화된 이미지만 필터링하고 순서대로 정렬
  const activeImages = sliderImages
    .filter(img => img.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // 이미지가 있으면 이미지를 사용하고, 없으면 기본 슬라이드 사용
  const slidesToShow = activeImages.length > 0 ? activeImages : slides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToShow.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slidesToShow.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToShow.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToShow.length) % slidesToShow.length);
  };

  const handleButtonClick = (href: string) => {
    if (href.startsWith('/api/')) {
      window.location.href = href;
    } else {
      // For client-side routing, we'll use location.href for simplicity
      window.location.href = href;
    }
  };

  const currentSlideData = slidesToShow[currentSlide];
  const isSliderImage = 'imageUrl' in currentSlideData;

  return (
    <div className="hero-slider rounded-2xl overflow-hidden relative shadow-soft h-80">
      {/* 배경 이미지 또는 그라데이션 */}
      {isSliderImage ? (
        <img 
          src={currentSlideData.imageUrl}
          alt={currentSlideData.altText || currentSlideData.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-info"></div>
      )}
      
      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
      >
        <ChevronLeft className="text-white" size={20} />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
      >
        <ChevronRight className="text-white" size={20} />
      </button>
      
      {/* Content - 기본 슬라이드인 경우만 텍스트 표시 */}
      {!isSliderImage && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8 z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 transition-all duration-500">
              {currentSlideData.title}
            </h2>
            <p className="text-xl mb-6 transition-all duration-500">
              {currentSlideData.subtitle}
            </p>
            <div className="space-x-4">
              {currentSlideData.buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={() => handleButtonClick(button.href)}
                  variant={button.variant}
                  className={
                    button.variant === "default" 
                      ? "bg-white text-primary hover:bg-gray-100" 
                      : "border-2 border-white text-white hover:bg-white hover:text-primary"
                  }
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Slider Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slidesToShow.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
