import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, Users, TrendingUp, Calendar } from "lucide-react";
import BoardList from "@/components/boards/board-list";
import ProtectedRoute from "@/components/auth/protected-route";

export default function Members() {
  const [activeTab, setActiveTab] = useState("notices");

  // Query for post counts
  const { data: noticesData } = useQuery({
    queryKey: ["/api/categories", "member-notices"],
  });

  const { data: communicationData } = useQuery({
    queryKey: ["/api/categories", "communication"],
  });

  const { data: applicationsData } = useQuery({
    queryKey: ["/api/categories", "business-application"],
  });

  const { data: noticesPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (noticesData as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((noticesData as any)?.id) {
        url.searchParams.set('categoryId', (noticesData as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(noticesData as any)?.id,
  });

  const { data: communicationPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (communicationData as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((communicationData as any)?.id) {
        url.searchParams.set('categoryId', (communicationData as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(communicationData as any)?.id,
  });

  const { data: applicationsPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (applicationsData as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((applicationsData as any)?.id) {
        url.searchParams.set('categoryId', (applicationsData as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(applicationsData as any)?.id,
  });

  const getPostStats = (posts: any[]) => {
    const postsArray = Array.isArray(posts) ? posts : [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPosts = postsArray.filter(post => {
      const postDate = new Date(post.createdAt);
      postDate.setHours(0, 0, 0, 0);
      return postDate.getTime() === today.getTime();
    });

    return {
      total: postsArray.length,
      today: todayPosts.length
    };
  };

  const noticesStats = getPostStats(noticesPosts);
  const communicationStats = getPostStats(communicationPosts);
  const applicationsStats = getPostStats(applicationsPosts);

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {/* Banner Header */}
            <div style={{ 
              background: 'linear-gradient(to right, #3b82f6, #2563eb)', 
              color: 'white', 
              padding: '2rem', 
              marginBottom: '1.5rem', 
              borderRadius: '0.5rem',
              minHeight: '150px',
              display: 'block',
              width: '100%'
            }}>
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">주요공지</h2>
                      <p className="text-blue-100">
                        관리자가 작성한 중요 공지사항입니다. 모든 회원이 열람 가능하며 댓글을 달 수 있습니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <TrendingUp size={16} />
                        <span className="text-2xl font-bold">{noticesStats.total}</span>
                      </div>
                      <p className="text-sm text-blue-100">전체 게시글</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar size={16} />
                        <span className="text-2xl font-bold">{noticesStats.today}</span>
                      </div>
                      <p className="text-sm text-blue-100">오늘 작성</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <BoardList categorySlug="member-notices" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            {/* Banner Header */}
            <div className="relative bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 mb-6 text-white overflow-hidden" style={{ background: 'linear-gradient(to right, #10b981, #059669)', color: 'white', padding: '2rem', marginBottom: '1.5rem', borderRadius: '0.5rem' }}>
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <MessageSquare size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">소통공간</h2>
                      <p className="text-green-100">
                        회원 간 자유로운 소통과 정보 공유를 위한 공간입니다. 인가회원만 작성 가능합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <TrendingUp size={16} />
                        <span className="text-2xl font-bold">{communicationStats.total}</span>
                      </div>
                      <p className="text-sm text-green-100">전체 게시글</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar size={16} />
                        <span className="text-2xl font-bold">{communicationStats.today}</span>
                      </div>
                      <p className="text-sm text-green-100">오늘 작성</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <BoardList categorySlug="communication" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            {/* Banner Header */}
            <div className="relative bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 mb-6 text-white overflow-hidden" style={{ background: 'linear-gradient(to right, #8b5cf6, #7c3aed)', color: 'white', padding: '2rem', marginBottom: '1.5rem', borderRadius: '0.5rem' }}>
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <Users size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">사업신청</h2>
                      <p className="text-purple-100">
                        각종 사업 참가 신청 및 관련 공지사항입니다. 인가회원만 작성 및 열람 가능합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <TrendingUp size={16} />
                        <span className="text-2xl font-bold">{applicationsStats.total}</span>
                      </div>
                      <p className="text-sm text-purple-100">전체 게시글</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar size={16} />
                        <span className="text-2xl font-bold">{applicationsStats.today}</span>
                      </div>
                      <p className="text-sm text-purple-100">오늘 작성</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <BoardList categorySlug="business-application" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
