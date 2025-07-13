import { useAuth } from "@/hooks/useAuth";
import HeroSlider from "@/components/home/hero-slider";
import ServiceCards from "@/components/home/service-cards";
import ContentSections from "@/components/home/content-sections";
import LoginForm from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, LogOut, Settings } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (sidebarRef.current) {
        const height = sidebarRef.current.offsetHeight;
        setSidebarHeight(height);
      }
    };

    // 초기 높이 설정
    updateHeight();
    
    // 윈도우 리사이즈 시 높이 재계산
    window.addEventListener('resize', updateHeight);
    
    // 컴포넌트 마운트 후 약간의 지연을 두고 한 번 더 계산
    const timer = setTimeout(updateHeight, 100);
    const timer2 = setTimeout(updateHeight, 500); // 더 긴 지연도 추가

    // MutationObserver로 사이드바 내용 변경 감지
    let observer: MutationObserver | null = null;
    if (sidebarRef.current) {
      observer = new MutationObserver(updateHeight);
      observer.observe(sidebarRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
      clearTimeout(timer2);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [user]); // user 상태 변경 시에도 높이 재계산

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = "/";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left section - Hero Slider */}
        <div className="lg:col-span-2 flex flex-col">
          <div 
            ref={sliderRef}
            style={{ height: sidebarHeight > 0 ? `${sidebarHeight}px` : 'auto' }}
            className="w-full"
          >
            <HeroSlider />
          </div>
        </div>

        {/* Right Sidebar - Two separate cards */}
        <div ref={sidebarRef} className="lg:col-span-1 space-y-6 flex flex-col">
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
                  
                  {/* 관리자 페이지 버튼 */}
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" className="w-full mb-2">
                        <Settings className="mr-2 h-4 w-4" />
                        관리자 페이지
                      </Button>
                    </Link>
                  )}
                  
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

          {/* Login Form - Only show when not logged in */}
          {!user && (
            <LoginForm />
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
