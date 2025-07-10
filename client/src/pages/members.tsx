import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Users, MessageSquare, FileText } from "lucide-react";
import BoardList from "@/components/boards/board-list";

export default function Members() {
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
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const hasAccess = user?.isApproved || user?.role === 'admin';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">회원기관</h1>
          <p className="text-lg text-medium-gray">
            회원기관 전용 공간입니다
          </p>
        </div>

        <Tabs defaultValue="notices" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="notices" className="flex items-center">
              <FileText size={16} className="mr-2" />
              주요공지
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center">
              <MessageSquare size={16} className="mr-2" />
              소통공간
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center">
              <Users size={16} className="mr-2" />
              사업신청
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notices">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="text-primary mr-3" size={24} />
                  주요공지
                </CardTitle>
                <p className="text-sm text-medium-gray">
                  관리자가 작성한 중요 공지사항입니다. 모든 회원이 열람 가능하며 댓글을 달 수 있습니다.
                </p>
              </CardHeader>
              <CardContent>
                <BoardList categorySlug="member-notices" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="text-accent mr-3" size={24} />
                  소통공간
                </CardTitle>
                <p className="text-sm text-medium-gray">
                  회원 간 자유로운 소통과 정보 공유를 위한 공간입니다. 인가회원만 작성 가능합니다.
                </p>
              </CardHeader>
              <CardContent>
                <BoardList categorySlug="member-communication" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="text-info mr-3" size={24} />
                  사업신청
                </CardTitle>
                <p className="text-sm text-medium-gray">
                  각종 사업 참가 신청 및 관련 공지사항입니다. 인가회원만 작성 및 열람 가능합니다.
                </p>
              </CardHeader>
              <CardContent>
                <BoardList categorySlug="business-applications" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
