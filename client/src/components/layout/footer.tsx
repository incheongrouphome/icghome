import { Home, Phone, Mail, Clock, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-gray text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold">한국아동청소년그룹홈협의회</h3>
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

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">협의회 소개</a></li>
              <li><a href="/business" className="text-gray-300 hover:text-white transition-colors">사업소개</a></li>
              <li><a href="/members" className="text-gray-300 hover:text-white transition-colors">회원기관</a></li>
              <li><a href="/announcements" className="text-gray-300 hover:text-white transition-colors">공지사항</a></li>
              <li><a href="/donation" className="text-gray-300 hover:text-white transition-colors">후원안내</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">연락처</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center">
                <Phone size={16} className="mr-2" />
                032-364-1617
              </p>
              <p className="flex items-center">
                <i className="fas fa-fax w-4 mr-2"></i>
                032-364-1611
              </p>
              <p className="flex items-center">
                <Mail size={16} className="mr-2" />
                grouphome@daum.net
              </p>
              <p className="flex items-center">
                <Clock size={16} className="mr-2" />
                평일 09:00 ~ 18:00
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 사단법인 한국아동청소년그룹홈협의회 인천지부. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
