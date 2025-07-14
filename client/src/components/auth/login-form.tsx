import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogIn, User, Settings, LogOut, UserPlus, Mail, CheckCircle, Check, X } from "lucide-react";
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
  passwordConfirm: string;
  name: string;
  organization?: string;
}

type EmailVerificationStep = 'input' | 'pending' | 'verified';

type ForgotPasswordStep = 'choose' | 'find-id' | 'reset-password';

export default function LoginForm() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>('choose');
  const [emailVerificationStep, setEmailVerificationStep] = useState<EmailVerificationStep>('input');
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    organization: ''
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    name: '',
    organization: '',
    foundId: '',
    isLoading: false
  });

  // 비밀번호 일치 여부 계산
  const passwordsMatch = signupData.password && signupData.passwordConfirm && signupData.password === signupData.passwordConfirm;
  const passwordsNotMatch = signupData.password && signupData.passwordConfirm && signupData.password !== signupData.passwordConfirm;

  // 이메일 확인 발송 뮤테이션
  const emailVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    },
    onSuccess: () => {
      setEmailVerificationStep('pending');
      toast({
        title: "이메일 발송 완료",
        description: "이메일을 확인하여 인증을 완료해주세요.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "이메일 발송 실패",
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
        description: data.message || "회원가입이 완료되었습니다.",
      });
      setIsSignupOpen(false);
      setEmailVerificationStep('input');
      setSignupData({ email: '', password: '', passwordConfirm: '', name: '', organization: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "회원가입 실패",
        description: error.message,
        variant: "destructive",
      });
    },
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

  // ID 찾기 뮤테이션
  const findIdMutation = useMutation({
    mutationFn: async (data: { name: string; organization?: string }) => {
      const response = await fetch('/api/auth/find-id', {
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
      setForgotPasswordData(prev => ({ ...prev, foundId: data.id }));
      toast({
        title: "ID 찾기 완료",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ID 찾기 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 비밀번호 재설정 요청 뮤테이션
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "비밀번호 재설정 요청 완료",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "비밀번호 재설정 요청 실패",
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

  const handleEmailVerification = () => {
    if (!signupData.email) {
      toast({
        title: "입력 오류",
        description: "이메일을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    emailVerificationMutation.mutate(signupData.email);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailVerificationStep !== 'verified') {
      toast({
        title: "이메일 확인 필요",
        description: "이메일 확인을 먼저 완료해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!signupData.email || !signupData.password || !signupData.name) {
      toast({
        title: "입력 오류",
        description: "필수 정보를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.passwordConfirm) {
      toast({
        title: "입력 오류",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate(signupData);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleFindId = () => {
    if (!forgotPasswordData.name) {
      toast({
        title: "입력 오류",
        description: "이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    findIdMutation.mutate({ 
      name: forgotPasswordData.name, 
      organization: forgotPasswordData.organization || undefined 
    });
  };

  const handleResetPassword = () => {
    if (!forgotPasswordData.email) {
      toast({
        title: "입력 오류",
        description: "이메일을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    resetPasswordMutation.mutate(forgotPasswordData.email);
  };

  // 이메일 확인 상태 자동 체크
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (emailVerificationStep === 'pending' && signupData.email) {
      // 5초마다 확인 상태 체크
      interval = setInterval(() => {
        checkEmailVerification();
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [emailVerificationStep, signupData.email]);

  // 이메일 확인 상태 체크 (실제로는 서버에서 확인 상태를 체크해야 함)
  const checkEmailVerification = async () => {
    try {
      const response = await fetch('/api/auth/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupData.email }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.verified) {
          setEmailVerificationStep('verified');
          toast({
            title: "이메일 확인 완료",
            description: "이제 회원가입을 완료할 수 있습니다.",
          });
        }
      }
    } catch (error) {
      console.error('Email verification check failed:', error);
    }
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
                  {user.name?.[0] || user.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-dark-gray">
                    {user.name}
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
                    <Settings className="mr-2" size={16} />
                    관리자 페이지
                  </Button>
                </Link>
              </div>
            )}
            
            {/* 로그아웃 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full"
            >
              <LogOut className="mr-2" size={16} />
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
          {/* ID/PW 찾기 다이얼로그 */}
          <Dialog open={isForgotPasswordOpen} onOpenChange={(open) => {
            setIsForgotPasswordOpen(open);
            if (!open) {
              setForgotPasswordStep('choose');
              setForgotPasswordData({ email: '', name: '', organization: '', foundId: '', isLoading: false });
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                ID/PW 찾기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>ID/PW 찾기</DialogTitle>
                <DialogDescription>
                  아이디나 비밀번호를 잊으셨나요? 이름과 조직명으로 아이디를 찾거나, 이메일로 비밀번호를 재설정할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              
              {forgotPasswordStep === 'choose' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    ID 찾기 또는 비밀번호 재설정을 선택해주세요.
                  </p>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setForgotPasswordStep('find-id')}
                      className="w-full"
                      variant="outline"
                    >
                      ID 찾기
                    </Button>
                    <Button 
                      onClick={() => setForgotPasswordStep('reset-password')}
                      className="w-full"
                      variant="outline"
                    >
                      비밀번호 재설정
                    </Button>
                  </div>
                </div>
              )}
              
              {forgotPasswordStep === 'find-id' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    가입 시 사용한 이름과 조직명을 입력해주세요.
                  </p>
                  
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="이름"
                      value={forgotPasswordData.name}
                      onChange={(e) => setForgotPasswordData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={findIdMutation.isPending}
                    />
                    
                    <Input
                      type="text"
                      placeholder="조직명 (선택사항)"
                      value={forgotPasswordData.organization}
                      onChange={(e) => setForgotPasswordData(prev => ({ ...prev, organization: e.target.value }))}
                      disabled={findIdMutation.isPending}
                    />
                    
                    {forgotPasswordData.foundId && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                          <strong>찾은 ID:</strong> {forgotPasswordData.foundId}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setForgotPasswordStep('choose')}
                      variant="outline"
                      className="flex-1"
                    >
                      뒤로
                    </Button>
                    <Button 
                      onClick={handleFindId}
                      disabled={findIdMutation.isPending}
                      className="flex-1"
                    >
                      {findIdMutation.isPending ? 'ID 찾는 중...' : 'ID 찾기'}
                    </Button>
                  </div>
                </div>
              )}
              
              {forgotPasswordStep === 'reset-password' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    가입 시 사용한 이메일 주소를 입력해주세요. 비밀번호 재설정 링크를 이메일로 보내드립니다.
                  </p>
                  
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="이메일 주소"
                      value={forgotPasswordData.email}
                      onChange={(e) => setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={resetPasswordMutation.isPending}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setForgotPasswordStep('choose')}
                      variant="outline"
                      className="flex-1"
                    >
                      뒤로
                    </Button>
                    <Button 
                      onClick={handleResetPassword}
                      disabled={resetPasswordMutation.isPending}
                      className="flex-1"
                    >
                      {resetPasswordMutation.isPending ? '요청 중...' : '재설정 요청'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          {/* 회원가입 다이얼로그 */}
          <Dialog open={isSignupOpen} onOpenChange={(open) => {
            setIsSignupOpen(open);
            if (!open) {
              setEmailVerificationStep('input');
              setSignupData({ email: '', password: '', passwordConfirm: '', name: '', organization: '' });
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                회원가입
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>회원가입</DialogTitle>
                <DialogDescription>
                  한국아동청소년그룹홈협의회 인천지부 회원으로 가입하여 다양한 서비스를 이용해보세요.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSignup} className="space-y-6">
                {/* 이메일 확인 섹션 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">이메일</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        disabled={emailVerificationStep !== 'input'}
                        className="flex-1"
                        required
                      />
                      {emailVerificationStep === 'input' && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleEmailVerification}
                          disabled={emailVerificationMutation.isPending || !signupData.email}
                          className="whitespace-nowrap"
                        >
                          <Mail className="mr-2" size={16} />
                          {emailVerificationMutation.isPending ? '발송 중...' : '이메일 확인'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 이메일 확인 상태 표시 */}
                  {emailVerificationStep === 'pending' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Mail className="text-yellow-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">이메일 확인 대기 중</p>
                          <p className="text-xs text-yellow-600 mt-1">
                            {signupData.email}로 확인 이메일을 발송했습니다. 이메일을 확인하고 링크를 클릭해주세요.
                          </p>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={checkEmailVerification}
                            className="p-0 h-auto text-xs text-yellow-700"
                          >
                            확인 상태 새로고침
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {emailVerificationStep === 'verified' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="text-green-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-green-800">이메일 확인 완료</p>
                          <p className="text-xs text-green-600 mt-1">
                            이메일 인증이 완료되었습니다. 회원가입을 계속 진행하세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 나머지 입력 필드들 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signup-password">비밀번호</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="6자 이상 입력해주세요"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password-confirm">비밀번호 확인</Label>
                    <div className="relative">
                      <Input
                        id="signup-password-confirm"
                        type="password"
                        value={signupData.passwordConfirm}
                        onChange={(e) => setSignupData({ ...signupData, passwordConfirm: e.target.value })}
                        placeholder="비밀번호를 다시 입력해주세요"
                        className={`pr-10 ${
                          passwordsMatch 
                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500' 
                            : passwordsNotMatch 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        required
                      />
                      {/* 비밀번호 일치 여부 아이콘 */}
                      {signupData.passwordConfirm && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {passwordsMatch ? (
                            <Check className="text-green-500" size={16} />
                          ) : (
                            <X className="text-red-500" size={16} />
                          )}
                        </div>
                      )}
                    </div>
                    {/* 비밀번호 일치 여부 메시지 */}
                    {signupData.passwordConfirm && (
                      <p className={`text-xs mt-1 ${
                        passwordsMatch ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {passwordsMatch ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signup-name">이름</Label>
                    <Input
                      id="signup-name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="실명을 입력해주세요"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-organization">소속 기관 (선택)</Label>
                    <Input
                      id="signup-organization"
                      value={signupData.organization}
                      onChange={(e) => setSignupData({ ...signupData, organization: e.target.value })}
                      placeholder="소속 기관명을 입력해주세요"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
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
                    disabled={signupMutation.isPending || emailVerificationStep !== 'verified' || !passwordsMatch}
                    className={passwordsMatch ? '' : 'opacity-50'}
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
