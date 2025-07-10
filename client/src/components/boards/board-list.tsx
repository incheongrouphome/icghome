import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import PostItem from "./post-item";
import { useAuth } from "@/hooks/useAuth";
import type { PostWithAuthor } from "@shared/schema";

interface BoardListProps {
  categorySlug: string;
}

export default function BoardList({ categorySlug }: BoardListProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: category } = useQuery({
    queryKey: ["/api/categories", categorySlug],
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/posts", category?.id],
    enabled: !!category?.id,
  });

  const filteredPosts = posts.filter((post: PostWithAuthor) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canWrite = user && (
    user.role === 'admin' || 
    (category?.allowedRoles?.includes(user.role) && 
     (!category.requiresApproval || user.isApproved))
  );

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
    <div className="space-y-6">
      {/* Header with Search and Write Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray" size={16} />
            <Input
              placeholder="게시글 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {canWrite && (
          <Button className="flex items-center">
            <Plus size={16} className="mr-2" />
            글쓰기
          </Button>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <p className="text-medium-gray">
                {searchTerm ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post: PostWithAuthor) => (
            <PostItem key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Category Info */}
      {category && (
        <Card className="shadow-soft bg-warm-gray">
          <CardHeader>
            <CardTitle className="text-sm">게시판 안내</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-medium-gray mb-3">
              {category.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.requiresAuth && (
                <Badge variant="secondary" className="text-xs">로그인 필요</Badge>
              )}
              {category.requiresApproval && (
                <Badge variant="secondary" className="text-xs">승인 필요</Badge>
              )}
              {category.allowedRoles && category.allowedRoles.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {category.allowedRoles.includes('admin') ? '관리자' : '회원'} 작성 가능
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
