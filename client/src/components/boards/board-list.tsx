import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import WritePost from "./write-post";
import type { PostWithAuthor } from "@shared/schema";

interface BoardListProps {
  categorySlug: string;
}

export default function BoardList({ categorySlug }: BoardListProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState("제목");
  const [isWriting, setIsWriting] = useState(false);
  const postsPerPage = 10;

  const { data: category } = useQuery({
    queryKey: ["/api/categories", categorySlug],
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/posts", { categoryId: (category as any)?.id }],
    queryFn: () => {
      const url = new URL('/api/posts', window.location.origin);
      if ((category as any)?.id) {
        url.searchParams.set('categoryId', (category as any).id.toString());
      }
      return fetch(url.toString()).then(res => res.json());
    },
    enabled: !!(category as any)?.id,
  });

  const postsArray = Array.isArray(posts) ? posts : [];
  const filteredPosts = postsArray.filter((post: PostWithAuthor) => {
    if (!searchTerm) return true;
    
    switch (searchCategory) {
      case "제목":
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      case "내용":
        return post.content.toLowerCase().includes(searchTerm.toLowerCase());
      case "소속":
        return (post.author?.organization || '').toLowerCase().includes(searchTerm.toLowerCase());
      default:
        return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               post.content.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const canWrite = user && (
    (user as any).role === 'admin' || 
    ((category as any)?.allowedRoles?.includes((user as any).role) && 
     (!(category as any)?.requiresApproval || (user as any).isApproved))
  );

  const getPostDetailUrl = (postId: number) => {
    switch (categorySlug) {
      case 'member-notices':
        return `/members/notices/${postId}`;
      case 'communication':
        return `/members/communication/${postId}`;
      case 'business-application':
        return `/members/application/${postId}`;
      case 'general-notices':
        return `/announcements/general/${postId}`;
      case 'job-postings':
        return `/announcements/jobs/${postId}`;
      default:
        return '#';
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '-').replace(/\s/g, '').replace(/-$/, '');
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 10;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (isWriting && category) {
    return (
      <WritePost
        categoryId={(category as any).id}
        categoryName={(category as any).name}
        onCancel={() => setIsWriting(false)}
        onSuccess={() => setIsWriting(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Board Table */}
      <div className="bg-white border border-gray-300">
        {/* Table Header */}
        <div className="grid grid-cols-18 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
          <div className="col-span-2 p-3 text-center border-r border-gray-300">번호</div>
          <div className="col-span-9 p-3 border-r border-gray-300">제목</div>
          <div className="col-span-4 p-3 text-center border-r border-gray-300">소속</div>
          <div className="col-span-2 p-3 text-center border-r border-gray-300">등록일</div>
          <div className="col-span-1 p-3 text-center">조회</div>
        </div>

        {/* Table Content */}
        {currentPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}
          </div>
        ) : (
          currentPosts.map((post: PostWithAuthor, index) => {
            const postNumber = filteredPosts.length - (startIndex + index);
            return (
              <div key={post.id} className="grid grid-cols-18 border-b border-gray-200 hover:bg-gray-50 transition-colors text-sm">
                <div className="col-span-2 p-3 text-center border-r border-gray-200 text-gray-600">
                  {post.isNotice ? (
                    <span className="text-red-600 font-medium">공지</span>
                  ) : (
                    postNumber
                  )}
                </div>
                <div className="col-span-9 p-3 border-r border-gray-200">
                  <div className="flex items-center space-x-2">
                    <a 
                      href={getPostDetailUrl(post.id)} 
                      className="text-gray-800 hover:text-blue-600 hover:underline font-medium truncate"
                    >
                      {post.title}
                    </a>
                    {post.content && post.content.length > 100 && (
                      <span className="text-xs text-gray-500">[{Math.ceil(post.content.length / 100)}]</span>
                    )}
                  </div>
                </div>
                <div className="col-span-4 p-3 text-center border-r border-gray-200 text-gray-600">
                  {post.author?.organization || '미등록'}
                </div>
                <div className="col-span-2 p-3 text-center border-r border-gray-200 text-gray-600">
                  {formatDate(post.createdAt)}
                </div>
                <div className="col-span-1 p-3 text-center text-gray-600">
                  {post.viewCount || 0}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-1 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            &lt;&lt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            &lt;
          </Button>
          
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className="h-8 w-8 p-0"
            >
              {pageNum}
            </Button>
          ))}
          
          {totalPages > 10 && currentPage < totalPages - 5 && (
            <>
              <span className="text-gray-500">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="h-8 w-8 p-0"
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            &gt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            &gt;&gt;
          </Button>
        </div>
      )}

      {/* Search Section and Write Button */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2">
          <Select value={searchCategory} onValueChange={setSearchCategory}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="제목">제목</SelectItem>
              <SelectItem value="내용">내용</SelectItem>
              <SelectItem value="소속">소속</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="검색어 입력"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 h-8 text-sm"
          />
          <Button 
            size="sm" 
            onClick={() => setCurrentPage(1)}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-white"
          >
            검색
          </Button>
        </div>
        <div className="flex-1 flex justify-end">
          {canWrite && (
            <Button 
              size="sm"
              className="h-8 bg-green-500 hover:bg-green-600 text-white flex items-center"
              onClick={() => setIsWriting(true)}
            >
              <Plus size={14} className="mr-1" />
              글쓰기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
