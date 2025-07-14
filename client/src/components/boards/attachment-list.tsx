import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, File, FileText, FileImage, FileVideo, FileMusic, FileArchive } from "lucide-react";

interface AttachmentListProps {
  attachments: File[];
  onRemove: (index: number) => void;
  className?: string;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <FileImage className="h-4 w-4 text-blue-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return <FileVideo className="h-4 w-4 text-purple-500" />;
    case 'mp3':
    case 'wav':
    case 'flac':
      return <FileMusic className="h-4 w-4 text-green-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FileArchive className="h-4 w-4 text-orange-500" />;
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-4 w-4 text-blue-600" />;
    case 'xls':
    case 'xlsx':
      return <FileText className="h-4 w-4 text-green-600" />;
    case 'ppt':
    case 'pptx':
      return <FileText className="h-4 w-4 text-orange-600" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function AttachmentList({ attachments, onRemove, className = "" }: AttachmentListProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {attachments.map((file, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getFileIcon(file.name)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {file.type || 'unknown'}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 