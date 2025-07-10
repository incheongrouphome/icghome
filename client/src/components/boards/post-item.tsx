import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Pin } from "lucide-react";
import type { PostWithAuthor } from "@shared/schema";

interface PostItemProps {
  post: PostWithAuthor;
}

export default function PostItem({ post }: PostItemProps) {
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getAuthorName = () => {
    if (!post.author) return "익명";
    if (post.author.firstName && post.author.lastName) {
      return `${post.author.firstName} ${post.author.lastName}`;
    }
    return post.author.email?.split('@')[0] || "작성자";
  };

  return (
    <Card className="shadow-soft hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {post.isNotice && (
                <Pin className="text-red-500" size={16} />
              )}
              <h3 className="font-medium text-dark-gray hover:text-primary transition-colors">
                {post.title}
              </h3>
              {post.isNotice && (
                <Badge variant="destructive" className="text-xs">공지</Badge>
              )}
            </div>
            
            <p className="text-sm text-medium-gray line-clamp-2 mb-3">
              {post.content.substring(0, 100)}...
            </p>
            
            <div className="flex items-center justify-between text-xs text-medium-gray">
              <div className="flex items-center gap-4">
                <span>{getAuthorName()}</span>
                <span>{formatDate(post.createdAt || '')}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{post.viewCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
