import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2, Eye, Download, FileText, Image as ImageIcon } from "lucide-react";
import type { PostWithAuthor } from "@shared/schema";
import DOMPurify from 'dompurify';
import Comments from "./comments";
import WritePost from "./write-post";

import "react-quill/dist/quill.snow.css";

interface PostDetailProps {
  categorySlug: string;
}

export default function PostDetail({ categorySlug }: PostDetailProps) {
  const [, params] = useRoute("/:section/:category/:id");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const postId = params?.id;

  const { data: post, isLoading } = useQuery({
    queryKey: ["/api/posts", postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error("게시글을 불러올 수 없습니다");
      return response.json();
    },
    enabled: !!postId,
  });

  const { data: category } = useQuery({
    queryKey: ["/api/categories", categorySlug],
  });

  // 조회수 증가
  const incrementViewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${postId}/view`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("조회수 증가에 실패했습니다");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId] });
    },
  });

  // 게시글 삭제
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("게시글 삭제에 실패했습니다");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "게시글이 삭제되었습니다",
        description: "성공적으로 게시글이 삭제되었습니다.",
      });
      window.location.href = getBackUrl();
    },
    onError: (error) => {
      toast({
        title: "삭제 실패",
        description: "게시글 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const getBackUrl = () => {
    switch (categorySlug) {
      case 'member-notices':
        return '/members/notices';
      case 'communication':
        return '/members/communication';
      case 'business-application':
        return '/members/application';
      case 'general-notices':
        return '/announcements/general';
      case 'job-postings':
        return '/announcements/jobs';
      default:
        return '/';
    }
  };

  const handleBack = () => {
    // URL에서 ID 부분을 제거하여 목록으로 돌아가기
    const backUrl = getBackUrl();
    window.location.href = backUrl;
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      deletePostMutation.mutate();
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: ["/api/posts", postId] });
  };

  // 처음 게시글 로드 시 조회수 증가
  useEffect(() => {
    if (post && postId) {
      incrementViewMutation.mutate();
    }
  }, [post, postId]);

  const canEdit = user && (
    (user as any).role === 'admin' || 
    (post && post.authorId === (user as any).id)
  );

  // HTML 콘텐츠를 안전하게 렌더링
  const sanitizedContent = post ? DOMPurify.sanitize(post.content || '') : '';

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 다운로드 (Supabase Storage URL 사용)
  const handleDownload = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url || attachment.filePath; // Supabase Storage URL 우선 사용
    link.download = attachment.originalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg animate-pulse mt-8"></div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">게시글을 찾을 수 없습니다</h1>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  if (isEditing && category) {
    return (
      <WritePost
        categoryId={(category as any).id}
        categoryName={(category as any).name}
        editPost={post}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </div>
            
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    {post.isNotice && (
                      <Badge variant="destructive">공지</Badge>
                    )}
                  </div>
                  
                  {canEdit && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center"
                      >
                        <Edit size={16} className="mr-2" />
                        수정
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deletePostMutation.isPending}
                        className="flex items-center"
                      >
                        <Trash2 size={16} className="mr-2" />
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>작성자: {post.author?.organization || '미등록'}</span>
                    <span>등록일: {format(new Date(post.createdAt!), 'yyyy-MM-dd HH:mm')}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    <span>{post.viewCount || 0}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* 본문 내용 */}
                  <div 
                    className="prose max-w-none ql-editor"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  />
                  
                  {/* 첨부파일 */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3">첨부파일</h3>
                      <div className="space-y-2">
                        {post.attachments.map((attachment: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-3">
                              {attachment.isImage ? (
                                <ImageIcon size={20} className="text-blue-500" />
                              ) : (
                                <FileText size={20} className="text-gray-500" />
                              )}
                              <div>
                                <span className="font-medium">{attachment.originalFilename}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({formatFileSize(attachment.size)})
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(attachment)}
                              className="flex items-center"
                            >
                              <Download size={16} className="mr-2" />
                              다운로드
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* 댓글 섹션 */}
                  <Comments postId={post.id} />
                </div>
              </CardContent>
            </Card>
    </div>
  );
} 