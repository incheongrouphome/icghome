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
        {/* Left section - Hero Slider */}
        <div className="lg:col-span-2">
          <HeroSlider />
        </div>

        {/* Right Sidebar - Two separate cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Info Card - Only show when logged in */}
          {user && (
            <Card className="shadow-soft border border-gray-100">
              <CardContent className="p-4">
                <h3 className="text-base font-bold text-dark-gray mb-4 flex items-center">
                  <User className="text-primary mr-2" size={18} />
                  사용자 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="프로필" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                        <User className="text-primary" size={20} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-gray truncate">
                        {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user?.email?.split('@')[0] || '사용자'}
                      </p>
                      <p className="text-xs text-medium-gray">
                        {user?.role === 'admin' ? '관리자' : 
                         user?.role === 'member' ? '회원' : '방문자'}
                        {user?.isApproved ? ' (승인됨)' : user?.role === 'member' ? ' (승인대기)' : ''}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full"
                  >
                    <LogOut size={16} className="mr-2" />
                    로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information Card - Always visible */}
          <Card className="shadow-soft border border-gray-100">
            <CardContent className="p-4">
              <h3 className="text-base font-bold text-dark-gray mb-4">연락처 정보</h3>
              <div className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-dark-gray">전화</span>
                    <span className="text-medium-gray">032-364-1617</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-dark-gray">팩스</span>
                    <span className="text-medium-gray">032-364-1611</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-dark-gray">이메일</span>
                    <span className="text-medium-gray text-xs">grouphome@daum.net</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-dark-gray">운영시간</span>
                    <span className="text-medium-gray text-xs">평일 09:00-18:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Card - Only show when not logged in */}
          {!user && (
            <Card className="shadow-soft border border-gray-100">
              <CardContent className="p-4">
                <h3 className="text-base font-bold text-dark-gray mb-4 flex items-center">
                  <User className="text-primary mr-2" size={18} />
                  로그인
                </h3>
                <p className="text-sm text-medium-gray mb-4">
                  회원 전용 서비스를 이용하려면 로그인해주세요.
                </p>
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="w-full"
                >
                  로그인하기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Content Area - Full Width */}
      <div className="mt-6 space-y-6">
        <ServiceCards />
        <ContentSections />
      </div>
    </div>
  );
}
