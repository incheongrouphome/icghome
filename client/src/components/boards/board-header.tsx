import { LucideIcon } from "lucide-react";

interface BoardHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats: {
    total: number;
    today: number;
  };
  colorScheme: 'blue' | 'orange' | 'green' | 'purple' | 'teal';
}

const colorSchemes = {
  blue: 'linear-gradient(to right, #3b82f6, #2563eb)',
  orange: 'linear-gradient(to right, #f97316, #ea580c)',
  green: 'linear-gradient(to right, #10b981, #059669)',
  purple: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
  teal: 'linear-gradient(to right, #14b8a6, #0d9488)',
};

export default function BoardHeader({ icon: Icon, title, description, stats, colorScheme }: BoardHeaderProps) {
  return (
    <div 
      className="p-4 mb-6 rounded-lg min-h-[70px] flex items-center text-white"
      style={{ background: colorSchemes[colorScheme] }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
            <Icon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xl font-bold">{stats.total}</span>
            </div>
            <p className="text-xs opacity-80">전체 게시글</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xl font-bold">{stats.today}</span>
            </div>
            <p className="text-xs opacity-80">오늘 작성</p>
          </div>
        </div>
      </div>
    </div>
  );
} 