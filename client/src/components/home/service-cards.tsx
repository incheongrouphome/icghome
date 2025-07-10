import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Heart, Home } from "lucide-react";

const services = [
  {
    icon: <ClipboardList className="text-primary" size={32} />,
    title: "주요사업",
    description: "인천지부에서 진행하는 다양한 사업들을 소개합니다",
    href: "/business"
  },
  {
    icon: <Heart className="text-red-500" size={32} />,
    title: "정기후원",
    description: "아이들의 밝은 미래를 위한 정기후원에 참여해주세요",
    href: "/donation"
  },
  {
    icon: <Home className="text-accent" size={32} />,
    title: "그룹홈 시작하기",
    description: "그룹홈 설립 및 운영에 대한 상세한 안내를 제공합니다",
    href: "/about"
  }
];

export default function ServiceCards() {
  const handleCardClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <Card 
          key={index} 
          className="shadow-soft card-hover transition-all cursor-pointer border border-gray-100"
          onClick={() => handleCardClick(service.href)}
        >
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-4">
              {service.icon}
            </div>
            <h3 className="text-lg font-bold text-dark-gray mb-2">{service.title}</h3>
            <p className="text-medium-gray text-sm mb-4 leading-relaxed">
              {service.description}
            </p>
            <button className="text-primary font-medium text-sm hover:underline">
              자세히 알아보기 →
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
