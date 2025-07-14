import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { FileText } from "lucide-react";
import BoardList from "@/components/boards/board-list";
import BoardHeader from "@/components/boards/board-header";
import PostDetail from "@/components/boards/post-detail";
import ProtectedRoute from "@/components/auth/protected-route";

export default function MemberNotices() {
  const [, params] = useRoute("/members/notices/:id?");
  const postId = params?.id;

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
            <BoardHeader
              icon={FileText}
              title="회원공지"
              description="회원기관을 위한 중요 공지사항입니다. 관리자가 작성하며 모든 회원이 열람 가능합니다."
              stats={stats}
              colorScheme="blue"
            />

            {postId ? (
              <div className="space-y-6">
                <PostDetail categorySlug="member-notices" />
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">목록</h3>
                  <BoardList categorySlug="member-notices" isCompact={true} hideWriteButton={true} currentPostId={parseInt(postId)} />
                </div>
              </div>
            ) : (
              <BoardList categorySlug="member-notices" />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}