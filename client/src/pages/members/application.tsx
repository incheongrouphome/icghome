import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import BoardList from "@/components/boards/board-list";
import BoardHeader from "@/components/boards/board-header";
import ProtectedRoute from "@/components/auth/protected-route";

export default function Application() {
  // Query for post counts
  const { data: categoryData } = useQuery({
    queryKey: ["/api/categories", "business-application"],
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
            <BoardHeader
              icon={Users}
              title="사업신청"
              description="각종 사업 참가 신청 및 관련 공지사항입니다. 인가회원만 작성 및 열람 가능합니다."
              stats={stats}
              colorScheme="purple"
            />

            <BoardList categorySlug="business-application" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}