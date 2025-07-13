import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Briefcase, TrendingUp, Calendar } from "lucide-react";
import BoardList from "@/components/boards/board-list";

export default function Announcements() {
  const [activeTab, setActiveTab] = useState("general");

  // Query for post counts
  const { data: generalData } = useQuery({
    queryKey: ["/api/categories", "general-notices"],
  });

  const { data: jobsData } = useQuery({
    queryKey: ["/api/categories", "job-postings"],
  });

  const { data: generalPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (generalData as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((generalData as any)?.id) {
        url.searchParams.set('categoryId', (generalData as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(generalData as any)?.id,
  });

  const { data: jobsPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (jobsData as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((jobsData as any)?.id) {
        url.searchParams.set('categoryId', (jobsData as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(jobsData as any)?.id,
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

  const generalStats = getPostStats(generalPosts);
  const jobsStats = getPostStats(jobsPosts);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">공지사항</h1>
          <p className="text-lg text-medium-gray">
            일반인도 열람 가능한 공개 공지사항입니다
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="general" className="flex items-center">
              <Megaphone size={16} className="mr-2" />
              열린공지
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase size={16} className="mr-2" />
              채용공고
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            {/* Banner Header */}
            <div style={{ 
              background: 'linear-gradient(to right, #f97316, #ea580c)', 
              color: 'white', 
              padding: '1rem', 
              marginBottom: '1.5rem', 
              borderRadius: '0.5rem',
              minHeight: '70px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    padding: '0.5rem', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>열린공지</h2>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      일반인도 열람 가능한 공개 공지사항입니다. 관리자만 작성 가능하며, 누구나 댓글을 달 수 있습니다.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <TrendingUp size={16} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{generalStats.total}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>전체 게시글</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <Calendar size={16} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{generalStats.today}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>오늘 작성</p>
                  </div>
                </div>
              </div>
            </div>

            <BoardList categorySlug="general-notices" />
          </TabsContent>

          <TabsContent value="jobs">
            {/* Banner Header */}
            <div style={{ 
              background: 'linear-gradient(to right, #6366f1, #4f46e5)', 
              color: 'white', 
              padding: '1rem', 
              marginBottom: '1.5rem', 
              borderRadius: '0.5rem',
              minHeight: '70px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    padding: '0.5rem', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>채용공고</h2>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      그룹홈 및 관련 기관의 채용정보입니다. 관리자만 작성 가능하며, 누구나 열람할 수 있습니다.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <TrendingUp size={16} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{jobsStats.total}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>전체 게시글</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <Calendar size={16} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{jobsStats.today}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>오늘 작성</p>
                  </div>
                </div>
              </div>
            </div>

            <BoardList categorySlug="job-postings" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
