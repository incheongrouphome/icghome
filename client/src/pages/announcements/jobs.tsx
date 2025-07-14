import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Briefcase } from "lucide-react";
import BoardList from "@/components/boards/board-list";
import BoardHeader from "@/components/boards/board-header";
import PostDetail from "@/components/boards/post-detail";

export default function JobPostings() {
  const [, params] = useRoute("/announcements/jobs/:id?");
  const postId = params?.id;

  // Query for post counts
  const { data: categoryData } = useQuery({
    queryKey: ["/api/categories", "job-postings"],
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <BoardHeader
            icon={Briefcase}
            title="채용공고"
            description="그룹홈 및 관련 기관의 채용정보입니다. 관리자만 작성 가능하며, 누구나 열람할 수 있습니다."
            stats={stats}
            colorScheme="teal"
          />

          {postId ? (
            <div className="space-y-6">
              <PostDetail categorySlug="job-postings" />
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">목록</h3>
                <BoardList categorySlug="job-postings" isCompact={true} hideWriteButton={true} currentPostId={parseInt(postId)} />
              </div>
            </div>
          ) : (
            <BoardList categorySlug="job-postings" />
          )}
        </div>
      </div>
    </div>
  );
}