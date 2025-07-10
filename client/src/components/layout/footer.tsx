import { Youtube, MessageSquare, Phone, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          {/* Left side - Organization details */}
          <div className="flex-1 space-y-1 text-sm">
            <div className="mb-3">
              <span className="text-gray-600">단체:</span> <span className="font-medium">사단법인 한국아동청소년그룹홈협의회</span> | 
              <span className="text-gray-600"> 대표자:</span> <span className="font-medium">방영탁</span> | 
              <span className="text-gray-600"> 고유번호:</span> <span className="font-medium">110-82-12605</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-600">주소:</span> <span>서울특별시 영등포구 문래로20길 60 메가벤처타워 507호</span> | 
              <span className="text-gray-600"> Tel:</span> <span>02-364-1617</span> | 
              <span className="text-gray-600"> Email:</span> <span>grouphome2008@daum.net</span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Korea Council of Grouphome for Children and Youth(KGCY)</span> All rights reserved.
            </div>
            <div className="text-gray-600">
              본 사이트는 <span className="text-primary font-medium">포스코이앤씨</span>의 나눔으로 만들어졌습니다.
            </div>
          </div>

          {/* Right side - Logo and social icons */}
          <div className="flex flex-col items-center space-y-4">
            {/* Grouphome logo placeholder */}
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold">
                Grouphome
              </div>
              <div className="w-8 h-8">
                <svg viewBox="0 0 24 24" className="w-full h-full text-green-500 fill-current">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                </svg>
              </div>
            </div>
            
            {/* Social media icons */}
            <div className="flex space-x-2">
              <a href="#" className="w-8 h-8 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                <Youtube className="text-white" size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors">
                <MessageSquare className="text-white" size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-green-600 rounded flex items-center justify-center hover:bg-green-700 transition-colors">
                <Phone className="text-white" size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="text-white" size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="text-white" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
