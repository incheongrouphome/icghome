import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { MessageSquare } from "lucide-react";
import BoardList from "@/components/boards/board-list";
import BoardHeader from "@/components/boards/board-header";
import PostDetail from "@/components/boards/post-detail";
import ProtectedRoute from "@/components/auth/protected-route";

export default function Communication() {
  const [, params] = useRoute("/members/communication/:id?");
  const postId = params?.id;

  // Query for post counts
  const { data: categoryData } = useQuery({
    queryKey: ["/api/categories", "communication"],
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
              icon={MessageSquare}
              title="소통공간"
              description="회원기관 간의 소통과 정보 공유를 위한 공간입니다. 승인된 회원만 작성할 수 있습니다."
              stats={stats}
              colorScheme="green"
            />

            {postId ? (
              <div className="space-y-6">
                <PostDetail categorySlug="communication" />
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">목록</h3>
                  <BoardList categorySlug="communication" isCompact={true} hideWriteButton={true} currentPostId={parseInt(postId)} />
                </div>
              </div>
            ) : (
              <BoardList categorySlug="communication" />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}