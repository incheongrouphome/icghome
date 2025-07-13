import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogIn, User, Settings, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organization?: string;
}

export default function LoginForm() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organization: ''
  });

  // 로그인 뮤테이션
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
      // 즉시 사용자 정보를 다시 가져오기
      queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      setLoginData({ email: '', password: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "로그인 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 회원가입 뮤테이션
  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "회원가입 성공",
        description: data.message,
      });
      setIsSignupOpen(false);
      setSignupData({ email: '', password: '', firstName: '', lastName: '', organization: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "회원가입 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 로그아웃 뮤테이션
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('로그아웃 실패');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "로그아웃",
        description: "안전하게 로그아웃되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "로그아웃 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName) {
      toast({
        title: "입력 오류",
        description: "필수 정보를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    signupMutation.mutate(signupData);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (authLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // 로그인된 사용자 정보 표시
  if (isAuthenticated && user) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
          <User className="text-primary mr-2" size={20} />
          사용자 정보
        </h3>
        <Card className="border-0 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary text-white">
                  {user.firstName?.[0] || user.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-dark-gray">
                    {user.firstName} {user.lastName}
                  </p>
                  <Badge 
                    variant={user.role === 'admin' ? 'default' : user.role === 'member' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {user.role === 'admin' ? '관리자' : user.role === 'member' ? '회원' : '방문자'}
                  </Badge>
                </div>
                <p className="text-sm text-medium-gray">{user.email}</p>
                {user.organization && (
                  <p className="text-sm text-medium-gray">{user.organization}</p>
                )}
                {!user.isApproved && user.role === 'visitor' && (
                  <p className="text-sm text-orange-600">승인 대기 중</p>
                )}
              </div>
            </div>
            
            {/* 관리자 페이지 링크 */}
            {user.role === 'admin' && (
              <div className="mb-4">
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    관리자 페이지
                  </Button>
                </Link>
              </div>
            )}
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 로그인 폼
  return (
    <Card className="shadow-soft border border-gray-100">
      <CardContent className="p-4 space-y-4">
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="flex items-center space-x-3">
            <Label className="text-sm font-medium text-dark-gray w-8">ID</Label>
            <Input 
              type="email" 
              placeholder="이메일 주소"
              className="flex-1"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              disabled={loginMutation.isPending}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Label className="text-sm font-medium text-dark-gray w-8">PW</Label>
            <Input 
              type="password" 
              placeholder="비밀번호"
              className="flex-1"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              disabled={loginMutation.isPending}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        
        {/* 하단 버튼들 */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => {
              toast({
                title: "준비중",
                description: "ID/PW 찾기 기능은 준비중입니다.",
              });
            }}
          >
            ID/PW 찾기
          </Button>
          <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                회원가입
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>회원가입</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email">이메일</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-firstName">이름</Label>
                    <Input
                      id="signup-firstName"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-lastName">성</Label>
                    <Input
                      id="signup-lastName"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-organization">소속 기관 (선택)</Label>
                  <Input
                    id="signup-organization"
                    value={signupData.organization}
                    onChange={(e) => setSignupData({ ...signupData, organization: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSignupOpen(false)}
                    disabled={signupMutation.isPending}
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? '가입 중...' : '회원가입'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* 테스트 계정 안내 */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            테스트: admin@example.com / password123
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
