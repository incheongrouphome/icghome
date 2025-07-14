import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [, navigate] = useLocation();
  const [match] = useRoute('/verify-email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!match) return;

    const verifyEmail = async () => {
      try {
        // URL 해시에서 토큰 추출 (Supabase Auth 형식)
        const hash = window.location.hash.substring(1);
        const urlParams = new URLSearchParams(hash);
        const accessToken = urlParams.get('access_token');
        const tokenType = urlParams.get('token_type');
        const type = urlParams.get('type');

        if (!accessToken || tokenType !== 'bearer' || type !== 'email') {
          setStatus('error');
          setMessage('유효하지 않은 확인 링크입니다.');
          return;
        }

        // 서버에 이메일 확인 요청
        const response = await fetch('/api/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: accessToken }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('이메일 확인이 완료되었습니다! 이제 회원가입을 완료할 수 있습니다.');
        } else {
          setStatus('error');
          setMessage(data.message || '이메일 확인에 실패했습니다.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('이메일 확인 중 오류가 발생했습니다.');
      }
    };

    verifyEmail();
  }, [match]);

  const handleGoToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">이메일 확인</CardTitle>
          <CardDescription>
            {status === 'loading' && '이메일 확인 중입니다...'}
            {status === 'success' && '이메일 확인 완료'}
            {status === 'error' && '이메일 확인 실패'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 상태 아이콘 */}
          <div className="flex justify-center">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>

          {/* 메시지 */}
          <div className="text-center">
            <p className={`text-sm ${
              status === 'success' ? 'text-green-600' : 
              status === 'error' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {message}
            </p>
          </div>

          {/* 버튼 */}
          {status !== 'loading' && (
            <div className="flex justify-center">
              <Button onClick={handleGoToLogin} className="w-full">
                {status === 'success' ? '로그인 페이지로 이동' : '다시 시도하기'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 