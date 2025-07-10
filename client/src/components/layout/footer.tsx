import { Home, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-gray text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Organization Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold">사단법인 한국아동청소년그룹홈협의회</h3>
                <p className="text-sm text-gray-300">인천지부</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              아동청소년의 건강한 성장과 발달을 위한 안전한 보금자리를 제공합니다.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Facebook className="text-white" size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-info rounded-full flex items-center justify-center hover:bg-info/80 transition-colors"
              >
                <Twitter className="text-white" size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition-colors"
              >
                <Instagram className="text-white" size={16} />
              </a>
            </div>
          </div>

          {/* Contact & Organization Details */}
          <div>
            <h4 className="font-bold mb-4">단체정보</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="text-white font-medium">단체명:</span> 사단법인 한국아동청소년그룹홈협의회</p>
              <p><span className="text-white font-medium">대표자:</span> 방영탁</p>
              <p><span className="text-white font-medium">고유번호:</span> 110-82-12605</p>
              <p className="flex items-start mt-3">
                <Home size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>서울특별시 영등포구 문래로20길 60 메가벤처타워 507호</span>
              </p>
              <p className="flex items-center">
                <Phone size={16} className="mr-2" />
                02-364-1617
              </p>
              <p className="flex items-center">
                <Mail size={16} className="mr-2" />
                grouphome2008@daum.net
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-400">
          <p className="mb-2">Korea Council of Grouphome for Children and Youth(KGCY) All rights reserved.</p>
          <p>본 사이트는 포스코이앤씨의 나눔으로 만들어졌습니다.</p>
        </div>
      </div>
    </footer>
  );
}
