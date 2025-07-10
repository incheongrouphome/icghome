import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, MessageSquare, User } from "lucide-react";

const announcements = [
  {
    title: "2024년 그룹홈 운영 지원사업 공고",
    date: "2024.03.15"
  },
  {
    title: "제2차 정기총회 개최 안내",
    date: "2024.03.10"
  },
  {
    title: "아동청소년 그룹홈 종사자 교육 안내",
    date: "2024.03.05"
  }
];

const communications = [
  {
    title: "운영 노하우 공유",
    author: "김○○",
    date: "2024.03.14"
  },
  {
    title: "아동복지 관련 문의",
    author: "박○○",
    date: "2024.03.13"
  },
  {
    title: "교육자료 요청",
    author: "이○○",
    date: "2024.03.12"
  }
];

export default function ContentSections() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Latest Announcements */}
      <Card className="shadow-soft border border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-gray flex items-center">
              <Megaphone className="text-primary mr-2" size={20} />
              최신 공지사항
            </h3>
            <a 
              href="/announcements" 
              className="text-sm text-medium-gray hover:text-primary transition-colors"
            >
              더보기 →
            </a>
          </div>
          <div className="space-y-3">
            {announcements.map((item, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark-gray hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-medium-gray mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Communication */}
      <Card className="shadow-soft border border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-gray flex items-center">
              <MessageSquare className="text-info mr-2" size={20} />
              회원 소통공간
            </h3>
            <a 
              href="/members" 
              className="text-sm text-medium-gray hover:text-primary transition-colors"
            >
              더보기 →
            </a>
          </div>
          <div className="space-y-3">
            {communications.map((item, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-primary" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark-gray hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-medium-gray mt-1">
                    {item.author} · {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
