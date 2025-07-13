import { useQuery } from "@tanstack/react-query";
import { FileText, TrendingUp, Calendar } from "lucide-react";
import BoardList from "@/components/boards/board-list";
import ProtectedRoute from "@/components/auth/protected-route";

export default function MemberNotices() {
  // Query for post counts
  const { data: categoryData } = useQuery({
    queryKey: ["/api/categories", "member-notices"],
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (categoryData as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((categoryData as any)?.id) {
        url.searchParams.set('categoryId', (categoryData as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(categoryData as any)?.id,
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

  const stats = getPostStats(posts);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Banner Header */}
            <div style={{ 
              background: 'linear-gradient(to right, #3b82f6, #2563eb)', 
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
                    <FileText size={24} />
                  </div>
                  <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>회원공지</h1>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      회원기관을 위한 중요 공지사항입니다. 관리자가 작성하며 모든 회원이 열람 가능합니다.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <TrendingUp size={16} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.total}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>전체 게시글</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <Calendar size={16} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.today}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>오늘 작성</p>
                  </div>
                </div>
              </div>
            </div>

            <BoardList categorySlug="member-notices" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}