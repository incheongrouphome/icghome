import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Send, Upload, Image as ImageIcon, Paperclip } from "lucide-react";
import type { InsertPost, PostWithAuthor } from "@shared/schema";
import AttachmentList from "./attachment-list";
import "react-quill/dist/quill.snow.css";

// React Quill을 동적으로 import
const ReactQuill = lazy(() => import("react-quill"));

interface WritePostProps {
  categoryId: number;
  categoryName: string;
  editPost?: PostWithAuthor;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function WritePost({ categoryId, categoryName, editPost, onCancel, onSuccess }: WritePostProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNotice, setIsNotice] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editPost;

  // 편집 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || "");
      setContent(editPost.content || "");
      setIsNotice(editPost.isNotice || false);
    }
  }, [editPost]);

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    const result = await response.json();
    return result.url;
  };

  // 이미지 붙여넣기 업로드 함수
  const uploadImageFromClipboard = async (imageData: string): Promise<string> => {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    const result = await response.json();
    return result.url;
  };

  // Quill 에디터 설정
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'color': [
        '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
        '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
        '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
        '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
        '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466',
        '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'
      ] }, { 'background': [
        '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
        '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
        '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
        '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
        '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
      ] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
    clipboard: {
      // 이미지 복사 붙여넣기 처리
      matchVisual: false,
    },
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'align', 'color', 'background'
  ];

  // 파일 선택 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  // 첨부파일 삭제
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const savePostMutation = useMutation({
    mutationFn: async (postData: InsertPost) => {
      const url = isEditing ? `/api/posts/${editPost.id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error(isEditing ? '글 수정에 실패했습니다.' : '글 작성에 실패했습니다.');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "성공",
        description: isEditing ? "글이 성공적으로 수정되었습니다." : "글이 성공적으로 작성되었습니다.",
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      // 첨부파일 업로드 처리 (필요시 추가)
      
      savePostMutation.mutate({
        title: title.trim(),
        content: content.trim(),
        categoryId,
        isNotice,
        authorId: (user as any)?.id || null,
      });
    } catch (error) {
      console.error('Save post error:', error);
      toast({
        title: "오류",
        description: "글 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isEditing ? '글수정' : '글쓰기'} - {categoryName}</span>
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div className="bg-white border rounded-md overflow-hidden">
                    <div style={{ height: '600px' }} className="relative">
                      <Suspense fallback={<div className="h-full flex items-center justify-center">에디터를 로딩 중...</div>}>
                        <ReactQuill
                          value={content}
                          onChange={setContent}
                          modules={modules}
                          formats={formats}
                          style={{ height: '100%' }}
                          placeholder="내용을 입력하세요. 이미지를 복사하여 붙여넣을 수 있습니다."
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>

                {/* 첨부파일 섹션을 완전히 분리 */}
                <div className="space-y-2">
                  <div className="bg-gray-50 border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="flex items-center text-sm font-medium">
                        <Paperclip size={16} className="mr-2" />
                        첨부파일
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center"
                      >
                        <Upload size={16} className="mr-2" />
                        파일 선택
                      </Button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    />
                    
                    <AttachmentList 
                      attachments={attachments} 
                      onRemove={removeAttachment}
                      className="mt-0"
                    />
                  </div>
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
                    disabled={savePostMutation.isPending}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={savePostMutation.isPending}
                    className="flex items-center"
                  >
                    <Send size={16} className="mr-2" />
                    {savePostMutation.isPending ? 
                      (isEditing ? '수정 중...' : '작성 중...') : 
                      (isEditing ? '수정하기' : '작성하기')
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
  );
} 