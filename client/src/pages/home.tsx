import { useAuth } from "@/hooks/useAuth";
import HeroSlider from "@/components/home/hero-slider";
import ServiceCards from "@/components/home/service-cards";
import ContentSections from "@/components/home/content-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, LogOut } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <HeroSlider />
          <ServiceCards />
          <ContentSections />
        </div>

        {/* Right Sidebar - User Info */}
        <div className="lg:col-span-1">
          <Card className="shadow-soft border border-gray-100 sticky top-24">
            <CardContent className="p-6">
              {/* User Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
                  <User className="text-primary mr-2" size={20} />
                  사용자 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="프로필" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                        <User className="text-primary" size={24} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-dark-gray">
                        {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user?.email?.split('@')[0] || '사용자'}
                      </p>
                      <p className="text-sm text-medium-gray">
                        {user?.role === 'admin' ? '관리자' : 
                         user?.role === 'member' ? '회원' : '방문자'}
                        {user?.isApproved ? ' (승인됨)' : user?.role === 'member' ? ' (승인대기)' : ''}
                      </p>
                    </div>
                  </div>
                  {user?.organization && (
                    <p className="text-sm text-medium-gray">
                      소속: {user.organization}
                    </p>
                  )}
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full mt-4"
                  >
                    <LogOut size={16} className="mr-2" />
                    로그아웃
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
                  <i className="fas fa-address-card text-accent mr-2"></i>
                  연락처 정보
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                      <i className="fas fa-phone text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-gray">대표전화</p>
                      <p className="text-sm text-medium-gray">032-364-1617</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                      <i className="fas fa-fax text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-gray">팩스</p>
                      <p className="text-sm text-medium-gray">032-364-1611</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-gray">이메일</p>
                      <p className="text-sm text-medium-gray">grouphome@daum.net</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                      <i className="fas fa-clock text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-gray">운영시간</p>
                      <p className="text-sm text-medium-gray">평일 09:00 ~ 18:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
