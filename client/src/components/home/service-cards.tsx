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
          className="shadow-soft card-hover transition-all cursor-pointer border border-gray-100 h-20"
          onClick={() => handleCardClick(service.href)}
        >
          <CardContent className="p-3 h-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 text-primary">
                  {service.icon}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-dark-gray mb-0.5">{service.title}</h3>
                <p className="text-medium-gray text-xs leading-tight">
                  {service.description}
                </p>
              </div>
            </div>
            <button className="text-primary font-medium text-xs px-2 py-1 border border-primary rounded hover:bg-primary hover:text-white transition-colors flex-shrink-0">
              보기
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
