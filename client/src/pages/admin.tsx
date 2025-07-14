import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Shield,
  Images,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ImageIcon,
  Upload,
  Database,
  Server,
  Link as LinkIcon
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicUser, SliderImage } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [imageForm, setImageForm] = useState({
    title: '',
    imageUrl: '',
    altText: '',
    order: 0,
    isActive: true,
  });

  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // 시스템 상태 조회
  const { data: systemStatus } = useQuery({
    queryKey: ["/api/admin/system-status"],
    enabled: isAuthenticated && user?.role === 'admin',
  });
  
  // 승인 대기 중인 사용자 목록 가져오기
  const { data: pendingUsers = [], isLoading: isPendingLoading } = useQuery<PublicUser[]>({
    queryKey: ["/api/admin/pending-users"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // 슬라이더 이미지 목록 가져오기
  const { data: sliderImages = [], isLoading: isImagesLoading } = useQuery<SliderImage[]>({
    queryKey: ["/api/slider-images"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // 사용자 승인 뮤테이션
  const approveUserMutation = useMutation({
    mutationFn: async ({ userId, role, isApproved }: { userId: string; role: string; isApproved: boolean }) => {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, isApproved }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      toast({
        title: "성공",
        description: "사용자 권한이 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: "사용자 권한 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // 이미지 생성 뮤테이션
  const createImageMutation = useMutation({
    mutationFn: async (imageData: typeof imageForm) => {
      console.log('🖼️ 이미지 생성 요청:', imageData);
      
      const response = await fetch('/api/admin/slider-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
      
      console.log('📡 이미지 생성 응답:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 이미지 생성 실패:', errorText);
        throw new Error(`이미지 생성 실패 (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ 이미지 생성 성공:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider-images"] });
      setIsImageDialogOpen(false);
      resetImageForm();
      toast({
        title: "성공",
        description: "이미지가 추가되었습니다.",
      });
    },
    onError: (error: Error) => {
      console.error('🚨 이미지 생성 에러:', error);
      toast({
        title: "이미지 추가 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // 이미지 업데이트 뮤테이션
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<typeof imageForm> }) => {
      const response = await fetch(`/api/admin/slider-images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider-images"] });
      setEditingImage(null);
      setImageForm({ title: '', imageUrl: '', altText: '', order: 0, isActive: true });
      setImageErrors(new Set()); // 이미지 에러 상태 초기화
      toast({
        title: "성공",
        description: "이미지가 수정되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: "이미지 수정에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // 이미지 삭제 뮤테이션
  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/slider-images/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider-images"] });
      setImageErrors(new Set()); // 이미지 에러 상태 초기화
      toast({
        title: "성공",
        description: "이미지가 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: "이미지 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // 이미지 파일 업로드 뮤테이션
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('📤 이미지 업로드 시작:', file.name, file.size);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/slider-images/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('📡 업로드 응답 상태:', response.status, response.statusText);
      console.log('📡 응답 헤더:', Object.fromEntries(response.headers.entries()));
      
      // 응답 텍스트 먼저 확인
      const responseText = await response.text();
      console.log('📄 응답 내용 (처음 500자):', responseText.substring(0, 500));
      
      if (!response.ok) {
        console.error('❌ 업로드 실패:', responseText);
        throw new Error(`업로드 실패 (${response.status}): ${responseText.substring(0, 200)}`);
      }
      
      // JSON 파싱 시도
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('✅ 업로드 성공:', result);
        return result;
      } catch (parseError) {
        console.error('🚨 JSON 파싱 실패:', parseError);
        console.error('📄 파싱 실패한 응답 내용:', responseText);
        throw new Error(`JSON 파싱 실패: 서버가 HTML을 반환했습니다. 응답: ${responseText.substring(0, 200)}`);
      }
    },
    onSuccess: (data) => {
      setImageForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
      setSelectedFile(null);
      setUploadProgress(false);
      toast({
        title: "성공",
        description: `이미지가 업로드되었습니다: ${data.filename}`,
      });
    },
    onError: (error: Error) => {
      console.error('🚨 업로드 에러:', error);
      setUploadProgress(false);
      toast({
        title: "이미지 업로드 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // 관리자 권한이 없는 경우
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">접근 권한 없음</h2>
            <p className="text-gray-600">관리자만 접근할 수 있습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApproveUser = (userId: string, role: string) => {
    approveUserMutation.mutate({ userId, role, isApproved: true });
  };

  const handleRejectUser = (userId: string) => {
    approveUserMutation.mutate({ userId, role: 'visitor', isApproved: false });
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 파일 업로드 방식이고 새 이미지인 경우
    if (uploadMethod === 'file' && selectedFile && !editingImage) {
      setUploadProgress(true);
      try {
        const uploadResult = await uploadImageMutation.mutateAsync(selectedFile);
        // 업로드 완료 후 슬라이더 이미지 생성
        const imageData = {
          ...imageForm,
          imageUrl: uploadResult.imageUrl
        };
        createImageMutation.mutate(imageData);
      } catch (error) {
        setUploadProgress(false);
      }
      return;
    }
    
    // 기존 방식 (URL 입력 또는 수정)
    if (editingImage) {
      updateImageMutation.mutate({ id: editingImage.id, updates: imageForm });
    } else {
      createImageMutation.mutate(imageForm);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast({
          title: "오류",
          description: "파일 크기는 5MB 이하여야 합니다.",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      
      // 파일명을 기본 제목으로 설정
      if (!imageForm.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // 확장자 제거
        setImageForm(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleEditImage = (image: SliderImage) => {
    setEditingImage(image);
    setImageForm({
      title: image.title,
      imageUrl: image.imageUrl,
      altText: image.altText || '',
      order: image.order || 0,
      isActive: image.isActive ?? true,
    });
    setUploadMethod('url'); // 편집 시에는 URL 방식으로 고정
    setSelectedFile(null);
    // 이미지 편집 시 해당 이미지 에러 상태 초기화
    setImageErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(image.id);
      return newErrors;
    });
    setIsImageDialogOpen(true);
  };

  const resetImageForm = () => {
    setEditingImage(null);
    setImageForm({ title: '', imageUrl: '', altText: '', order: 0, isActive: true });
    setUploadMethod('file');
    setSelectedFile(null);
    setUploadProgress(false);
    setImageErrors(new Set());
  };

  const handleDeleteImage = (id: number) => {
    if (confirm('이 이미지를 삭제하시겠습니까?')) {
      deleteImageMutation.mutate(id);
    }
  };

  const toggleImageActive = (image: SliderImage) => {
    updateImageMutation.mutate({ 
      id: image.id, 
      updates: { isActive: !image.isActive } 
    });
    // 이미지 상태 변경 시 해당 이미지 에러 상태 초기화
    setImageErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(image.id);
      return newErrors;
    });
  };

  const handleImageError = (imageId: number) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 페이지</h1>
        <p className="text-gray-600">회원 관리 및 시스템 설정</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">회원 관리</TabsTrigger>
          <TabsTrigger value="images">이미지 관리</TabsTrigger>
          <TabsTrigger value="system">시스템 상태</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>회원 승인 대기</span>
                {pendingUsers.length > 0 && (
                  <Badge variant="destructive">{pendingUsers.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPendingLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                  <p>승인 대기 중인 회원이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {user.name?.[0] || user.email?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.organization && (
                            <div className="text-sm text-gray-500">{user.organization}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id, 'member')}
                          disabled={approveUserMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectUser(user.id)}
                          disabled={approveUserMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          거부
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Images className="h-5 w-5" />
                  <span>메인 이미지 슬라이더</span>
                </div>
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetImageForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      이미지 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingImage ? '이미지 수정' : '이미지 추가'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingImage 
                          ? '슬라이더 이미지 정보를 수정합니다.'
                          : '홈페이지 메인 슬라이더에 새로운 이미지를 추가합니다.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleImageSubmit} className="space-y-4">
                      {/* 이미지 업로드 방식 선택 (새 이미지만) */}
                      {!editingImage && (
                        <div className="space-y-3">
                          <Label>이미지 업로드 방식</Label>
                          <div className="flex space-x-4">
                            <Button
                              type="button"
                              variant={uploadMethod === 'file' ? 'default' : 'outline'}
                              onClick={() => setUploadMethod('file')}
                              className="flex-1"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              파일 업로드
                            </Button>
                            <Button
                              type="button"
                              variant={uploadMethod === 'url' ? 'default' : 'outline'}
                              onClick={() => setUploadMethod('url')}
                              className="flex-1"
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              URL 입력
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* 파일 업로드 */}
                      {uploadMethod === 'file' && !editingImage && (
                        <div className="space-y-3">
                          <Label htmlFor="imageFile">이미지 파일</Label>
                          <Input
                            id="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={uploadProgress}
                          />
                          {selectedFile && (
                            <div className="text-sm text-gray-600">
                              선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                            </div>
                          )}
                        </div>
                      )}

                      {/* URL 입력 */}
                      {(uploadMethod === 'url' || editingImage) && (
                        <div>
                          <Label htmlFor="imageUrl">이미지 URL</Label>
                          <Input
                            id="imageUrl"
                            value={imageForm.imageUrl}
                            onChange={(e) => setImageForm({ ...imageForm, imageUrl: e.target.value })}
                            placeholder="/img/example.jpg"
                            required={uploadMethod === 'url'}
                          />
                        </div>
                      )}

                      {/* 이미지 미리보기 */}
                      {imageForm.imageUrl && (
                        <div className="space-y-2">
                          <Label>미리보기</Label>
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden max-w-xs">
                            <img
                              src={imageForm.imageUrl}
                              alt="미리보기"
                              className="w-full h-full object-cover"
                              onError={() => {
                                // 미리보기 에러 처리
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="title">제목</Label>
                        <Input
                          id="title"
                          value={imageForm.title}
                          onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="altText">Alt 텍스트</Label>
                        <Input
                          id="altText"
                          value={imageForm.altText}
                          onChange={(e) => setImageForm({ ...imageForm, altText: e.target.value })}
                          placeholder="이미지 설명 (접근성)"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="order">순서</Label>
                        <Input
                          id="order"
                          type="number"
                          value={imageForm.order}
                          onChange={(e) => setImageForm({ ...imageForm, order: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsImageDialogOpen(false);
                            resetImageForm();
                          }}
                        >
                          취소
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={
                            uploadProgress || 
                            createImageMutation.isPending || 
                            updateImageMutation.isPending || 
                            (uploadMethod === 'file' && !selectedFile && !editingImage)
                          }
                        >
                          {uploadProgress 
                            ? '업로드 중...' 
                            : editingImage 
                            ? '수정' 
                            : '추가'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isImagesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : sliderImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Images className="mx-auto h-12 w-12 mb-4" />
                  <p>등록된 이미지가 없습니다.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sliderImages.map((image) => (
                    <Card key={image.id} className="relative">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          {imageErrors.has(image.id) ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <div className="text-center text-gray-500">
                                <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                                <p className="text-sm">이미지 로딩 실패</p>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={image.imageUrl}
                              alt={image.altText || image.title}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(image.id)}
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{image.title}</h3>
                            <Badge variant={image.isActive ? "default" : "secondary"}>
                              {image.isActive ? '활성' : '비활성'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            순서: {image.order}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleImageActive(image)}
                              disabled={updateImageMutation.isPending}
                            >
                              {image.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditImage(image)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteImage(image.id)}
                              disabled={deleteImageMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>시스템 상태</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {systemStatus && typeof systemStatus === 'object' && systemStatus !== null ? (
                <div className="space-y-6">
                  {/* 데이터베이스 상태 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">데이터베이스</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                            (systemStatus as any).database?.connected ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <p className="text-sm font-medium">연결 상태</p>
                          <p className="text-xs text-gray-500">
                            {(systemStatus as any).database?.connected ? '연결됨' : '연결 안됨'}
                          </p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 mb-1">
                            {(systemStatus as any).database?.type || 'Unknown'}
                          </div>
                          <p className="text-sm font-medium">데이터베이스 타입</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 mb-1">
                            {(systemStatus as any).database?.url || 'Unknown'}
                          </div>
                          <p className="text-sm font-medium">연결 정보</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* 스토리지 상태 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Images className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold">파일 스토리지</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">업로드 디렉토리</p>
                            <p className="text-sm text-gray-500">{(systemStatus as any).storage?.uploadsDir}</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">이미지 디렉토리</p>
                            <p className="text-sm text-gray-500">{(systemStatus as any).storage?.imagesDir}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* 인증 상태 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">인증 상태</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                            isAuthenticated ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <p className="text-sm font-medium">로그인 상태</p>
                          <p className="text-xs text-gray-500">
                            {isAuthenticated ? '로그인됨' : '로그인 안됨'}
                          </p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 mb-1">
                            {user?.role || 'N/A'}
                          </div>
                          <p className="text-sm font-medium">사용자 권한</p>
                          <p className="text-xs text-gray-500">
                            {user?.name || user?.email || 'Unknown'}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* 환경 정보 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold">환경 정보</h3>
                    </div>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          (systemStatus as any).environment === 'production' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {((systemStatus as any).environment || 'development').toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">실행 환경</p>
                      </div>
                    </Card>
                  </div>

                  {/* 권장사항 */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700">권장사항</h3>
                    <div className="space-y-2">
                      {!isAuthenticated && (
                        <div className="flex items-start space-x-2 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">인증 필요</p>
                            <p className="text-sm text-red-600">
                              관리자 기능을 사용하려면 로그인이 필요합니다.
                            </p>
                          </div>
                        </div>
                      )}
                      {!(systemStatus as any).database?.connected && (
                        <div className="flex items-start space-x-2 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">데이터베이스 미연결</p>
                            <p className="text-sm text-red-600">
                              실제 데이터베이스 연결을 권장합니다. 현재는 임시 데이터를 사용 중입니다.
                            </p>
                          </div>
                        </div>
                      )}
                      {(systemStatus as any).environment === 'development' && (
                        <div className="flex items-start space-x-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800">개발 모드</p>
                            <p className="text-sm text-yellow-600">
                              프로덕션 배포 시 환경 변수와 보안 설정을 확인해주세요.
                            </p>
                          </div>
                        </div>
                      )}
                      {isAuthenticated && (systemStatus as any).database?.connected && (systemStatus as any).environment === 'production' && (
                        <div className="flex items-start space-x-2 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">시스템 정상</p>
                            <p className="text-sm text-green-600">
                              모든 시스템이 정상적으로 작동하고 있습니다.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 