import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Send } from "lucide-react";
import type { InsertPost } from "@shared/schema";

interface WritePostProps {
  categoryId: number;
  categoryName: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function WritePost({ categoryId, categoryName, onCancel, onSuccess }: WritePostProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNotice, setIsNotice] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertPost) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error('글 작성에 실패했습니다.');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "성공",
        description: "글이 성공적으로 작성되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "오류",
        description: "제목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "오류",
        description: "내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      categoryId,
      isNotice,
      authorId: (user as any)?.id || null,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>글쓰기 - {categoryName}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            목록으로
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="min-h-[300px] resize-none"
            />
          </div>
          
          {user && (user as any).role === 'admin' ? (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isNotice"
                checked={isNotice}
                onCheckedChange={(checked) => setIsNotice(checked === true)}
              />
              <Label htmlFor="isNotice" className="text-sm">
                공지사항으로 설정
              </Label>
            </div>
          ) : null}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={createPostMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending}
              className="flex items-center"
            >
              <Send size={16} className="mr-2" />
              {createPostMutation.isPending ? '작성 중...' : '작성하기'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 