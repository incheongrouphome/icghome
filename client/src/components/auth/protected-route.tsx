import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMembership?: boolean;
}

export default function ProtectedRoute({ children, requireMembership = true }: ProtectedRouteProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "회원기관 페이지는 로그인이 필요합니다. 로그인 페이지로 이동합니다...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Check membership requirements
  if (requireMembership) {
    const hasAccess = (user as any)?.isApproved || (user as any)?.role === 'admin';
    
    if (!hasAccess) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-soft border-yellow-200 bg-yellow-50">
              <CardContent className="p-8 text-center">
                <Lock className="mx-auto text-yellow-600 mb-4" size={48} />
                <h2 className="text-xl font-bold text-dark-gray mb-4">승인 대기 중</h2>
                <p className="text-medium-gray mb-4">
                  회원기관 페이지는 관리자 승인 후 이용 가능합니다.
                </p>
                <p className="text-sm text-medium-gray">
                  승인 관련 문의: 032-364-1617
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
} 