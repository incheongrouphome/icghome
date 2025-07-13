import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  ImageIcon
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
      const response = await fetch('/api/admin/slider-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
      if (!response.ok) throw new Error('Failed to create image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider-images"] });
      setIsImageDialogOpen(false);
      setImageForm({ title: '', imageUrl: '', altText: '', order: 0, isActive: true });
      setImageErrors(new Set()); // 이미지 에러 상태 초기화
      toast({
        title: "성공",
        description: "이미지가 추가되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: "이미지 추가에 실패했습니다.",
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

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImage) {
      updateImageMutation.mutate({ id: editingImage.id, updates: imageForm });
    } else {
      createImageMutation.mutate(imageForm);
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
    // 이미지 편집 시 해당 이미지 에러 상태 초기화
    setImageErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(image.id);
      return newErrors;
    });
    setIsImageDialogOpen(true);
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">회원 관리</TabsTrigger>
          <TabsTrigger value="images">이미지 관리</TabsTrigger>
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
                            {user.firstName?.[0] || user.email?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
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
                    <Button
                      onClick={() => {
                        setEditingImage(null);
                        setImageForm({ title: '', imageUrl: '', altText: '', order: 0, isActive: true });
                        setImageErrors(new Set()); // 새 이미지 추가 시 에러 상태 초기화
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      이미지 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingImage ? '이미지 수정' : '이미지 추가'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleImageSubmit} className="space-y-4">
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
                        <Label htmlFor="imageUrl">이미지 URL</Label>
                        <Input
                          id="imageUrl"
                          value={imageForm.imageUrl}
                          onChange={(e) => setImageForm({ ...imageForm, imageUrl: e.target.value })}
                          placeholder="/img/example.jpg"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="altText">Alt 텍스트</Label>
                        <Input
                          id="altText"
                          value={imageForm.altText}
                          onChange={(e) => setImageForm({ ...imageForm, altText: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="order">순서</Label>
                        <Input
                          id="order"
                          type="number"
                          value={imageForm.order}
                          onChange={(e) => setImageForm({ ...imageForm, order: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                          취소
                        </Button>
                        <Button type="submit" disabled={createImageMutation.isPending || updateImageMutation.isPending}>
                          {editingImage ? '수정' : '추가'}
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
      </Tabs>
    </div>
  );
} 