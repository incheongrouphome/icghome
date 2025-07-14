import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Edit, Trash2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { CommentWithAuthor } from "@shared/schema";

interface CommentsProps {
  postId: number;
}

interface CommentItemProps {
  comment: CommentWithAuthor;
  onEdit: (comment: CommentWithAuthor) => void;
  onDelete: (commentId: number) => void;
}

function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const canEdit = user && (
    (user as any).role === 'admin' || 
    comment.authorId === (user as any).id
  );

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('댓글 수정에 실패했습니다');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "댓글이 수정되었습니다" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/comments', comment.postId] });
    },
    onError: () => {
      toast({ 
        title: "댓글 수정 실패", 
        description: "댓글 수정 중 오류가 발생했습니다",
        variant: "destructive"
      });
    }
  });

  const handleEdit = () => {
    if (editContent.trim()) {
      updateMutation.mutate({ id: comment.id, content: editContent });
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      onDelete(comment.id);
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            {comment.author?.name?.charAt(0) || '익'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-gray-900">
                {comment.author?.organization || '미등록'}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            
            {canEdit && (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(!isEditing)}
                  className="h-6 px-2"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-6 px-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] text-sm"
                placeholder="댓글을 입력하세요..."
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={updateMutation.isPending || !editContent.trim()}
                  className="h-7"
                >
                  {updateMutation.isPending ? '수정 중...' : '수정'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="h-7"
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Comments({ postId }: CommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['/api/comments', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error('댓글을 불러올 수 없습니다');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('댓글 작성에 실패했습니다');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "댓글이 작성되었습니다" });
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['/api/comments', postId] });
    },
    onError: () => {
      toast({ 
        title: "댓글 작성 실패", 
        description: "댓글 작성 중 오류가 발생했습니다",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('댓글 삭제에 실패했습니다');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "댓글이 삭제되었습니다" });
      queryClient.invalidateQueries({ queryKey: ['/api/comments', postId] });
    },
    onError: () => {
      toast({ 
        title: "댓글 삭제 실패", 
        description: "댓글 삭제 중 오류가 발생했습니다",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      createMutation.mutate(newComment);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>댓글 ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 댓글 목록 */}
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">댓글을 불러오는 중...</p>
          </div>
        ) : comments.length > 0 && (
          <div className="space-y-4">
            {comments.map((comment: CommentWithAuthor) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onEdit={() => {}}
                onDelete={(commentId) => deleteMutation.mutate(commentId)}
              />
            ))}
          </div>
        )}

        {/* 댓글 작성 폼 */}
        {isAuthenticated ? (
          <div className={`${comments.length > 0 ? 'mt-6 pt-6 border-t border-gray-200' : 'mt-4'}`}>
            <form onSubmit={handleSubmit}>
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback>
                    {(user as any)?.name?.charAt(0) || '나'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="min-h-[60px] resize-none flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || !newComment.trim()}
                    className="h-[60px] px-4 self-start"
                  >
                    {createMutation.isPending ? '작성 중...' : '댓글 작성'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className={`${comments.length > 0 ? 'mt-6 pt-6 border-t border-gray-200' : 'mt-4'} text-center`}>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
              <Button
                size="sm"
                onClick={() => window.location.href = '/'}
                className="h-7"
              >
                로그인하기
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 