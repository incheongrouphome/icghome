import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { PostWithAuthor } from "@shared/schema";

export default function ContentSections() {
  // 각 카테고리별 데이터 가져오기
  const { data: memberNoticesCategory } = useQuery({
    queryKey: ["/api/categories", "member-notices"],
  });

  const { data: communicationCategory } = useQuery({
    queryKey: ["/api/categories", "communication"],
  });

  const { data: businessApplicationCategory } = useQuery({
    queryKey: ["/api/categories", "business-application"],
  });

  const { data: generalNoticesCategory } = useQuery({
    queryKey: ["/api/categories", "general-notices"],
  });

  const { data: jobPostingsCategory } = useQuery({
    queryKey: ["/api/categories", "job-postings"],
  });

  // 각 카테고리별 게시글 가져오기
  const { data: memberNoticesPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (memberNoticesCategory as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((memberNoticesCategory as any)?.id) {
        url.searchParams.set('categoryId', (memberNoticesCategory as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(memberNoticesCategory as any)?.id,
  });

  const { data: communicationPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (communicationCategory as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((communicationCategory as any)?.id) {
        url.searchParams.set('categoryId', (communicationCategory as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(communicationCategory as any)?.id,
  });

  const { data: businessApplicationPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (businessApplicationCategory as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((businessApplicationCategory as any)?.id) {
        url.searchParams.set('categoryId', (businessApplicationCategory as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(businessApplicationCategory as any)?.id,
  });

  const { data: generalNoticesPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (generalNoticesCategory as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((generalNoticesCategory as any)?.id) {
        url.searchParams.set('categoryId', (generalNoticesCategory as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(generalNoticesCategory as any)?.id,
  });

  const { data: jobPostingsPosts = [] } = useQuery({
    queryKey: ["/api/posts", { categoryId: (jobPostingsCategory as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((jobPostingsCategory as any)?.id) {
        url.searchParams.set('categoryId', (jobPostingsCategory as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(jobPostingsCategory as any)?.id,
  });

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '');
  };

  const getPostLink = (post: PostWithAuthor, categorySlug: string) => {
    switch (categorySlug) {
      case 'member-notices':
        return `/members/notices/${post.id}`;
      case 'communication':
        return `/members/communication/${post.id}`;
      case 'business-application':
        return `/members/application/${post.id}`;
      case 'general-notices':
        return `/announcements/general/${post.id}`;
      case 'job-postings':
        return `/announcements/jobs/${post.id}`;
      default:
        return '#';
    }
  };

  const renderPostList = (posts: PostWithAuthor[], categorySlug: string, badgeText: string, badgeColor: string) => {
    const postsArray = Array.isArray(posts) ? posts : [];
    
    return (
      <div className="space-y-1">
        {postsArray.slice(0, 4).map((post, index) => (
          <div 
            key={post.id || index}
            className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1">
              {post.isNotice ? (
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full border text-red-700 bg-red-50 border-red-100">
                  공지
                </span>
              ) : (
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full border opacity-0 pointer-events-none">
                  공지
                </span>
              )}
              <a
                href={getPostLink(post, categorySlug)}
                className="text-xs text-dark-gray hover:text-primary transition-colors truncate"
              >
                {post.title}
              </a>
            </div>
            <span className="text-xs text-medium-gray ml-2">
              {formatDate(post.createdAt)}
            </span>
          </div>
        ))}
        {postsArray.length === 0 && (
          <div className="text-center py-4 text-xs text-gray-500">
            등록된 게시글이 없습니다.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 회원기관 */}
      <Card className="shadow-soft border border-gray-100 h-64">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-dark-gray">회원기관</h3>
            <a 
              href="/members" 
              className="text-xs text-medium-gray hover:text-primary transition-colors"
            >
              더보기 →
            </a>
          </div>
          <Tabs defaultValue="notices" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="notices" className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500 hover:bg-blue-25 transition-all duration-200">회원공지</TabsTrigger>
              <TabsTrigger value="communication" className="text-xs data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-b-green-500 hover:bg-green-25 transition-all duration-200">소통공간</TabsTrigger>
              <TabsTrigger value="applications" className="text-xs data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-b-purple-500 hover:bg-purple-25 transition-all duration-200">사업신청</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notices" className="mt-2">
              {renderPostList(
                memberNoticesPosts,
                'member-notices',
                '회원공지',
                'text-purple-700 bg-purple-50 border-purple-100'
              )}
            </TabsContent>
            
            <TabsContent value="communication" className="mt-2">
              {renderPostList(
                communicationPosts,
                'communication',
                '소통',
                'text-orange-700 bg-orange-50 border-orange-100'
              )}
            </TabsContent>
            
            <TabsContent value="applications" className="mt-2">
              {renderPostList(
                businessApplicationPosts,
                'business-application',
                '사업신청',
                'text-indigo-700 bg-indigo-50 border-indigo-100'
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 열린공지 */}
      <Card className="shadow-soft border border-gray-100 h-64">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-dark-gray">열린공지</h3>
            <a 
              href="/announcements" 
              className="text-xs text-medium-gray hover:text-primary transition-colors"
            >
              더보기 →
            </a>
          </div>
          <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="public" className="text-xs data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 hover:bg-orange-25 transition-all duration-200">열린공지</TabsTrigger>
              <TabsTrigger value="jobs" className="text-xs data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-b-teal-500 hover:bg-teal-25 transition-all duration-200">채용공고</TabsTrigger>
            </TabsList>
            
            <TabsContent value="public" className="mt-2">
              {renderPostList(
                generalNoticesPosts,
                'general-notices',
                '공지',
                'text-blue-700 bg-blue-50 border-blue-100'
              )}
            </TabsContent>
            
            <TabsContent value="jobs" className="mt-2">
              {renderPostList(
                jobPostingsPosts,
                'job-postings',
                '채용',
                'text-green-700 bg-green-50 border-green-100'
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}