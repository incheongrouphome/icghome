import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const posts = {
  general: [
    {
      category: "일반공지",
      title: "2024년 하반기 정기총회 개최 안내",
      date: "25.04.14"
    },
    {
      category: "사업안내",
      title: "신규 그룹홈 인증 지원사업 신청 접수",
      date: "25.03.28"
    },
    {
      category: "교육안내",
      title: "아동보호전문기관 연계 강화 방안",
      date: "25.03.20"
    },
    {
      category: "일반공지",
      title: "청소년 자립지원 프로그램 운영 계획",
      date: "25.03.15"
    }
  ],
  jobs: [
    {
      category: "채용공고",
      title: "인천지역 그룹홈 생활복지사 채용",
      date: "25.05.07"
    },
    {
      category: "채용공고",
      title: "아동상담사 정규직 모집",
      date: "25.05.05"
    },
    {
      category: "계약직",
      title: "방과후 돌봄교사 채용공고",
      date: "25.04.28"
    },
    {
      category: "인턴십",
      title: "사회복지 현장실습생 모집",
      date: "25.04.20"
    }
  ]
};

export default function ContentSections() {
  return (
    <Card className="shadow-soft border border-gray-100">
      <CardContent className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">공지사항</TabsTrigger>
            <TabsTrigger value="jobs">자료실</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4">
            <div className="space-y-2">
              {posts.general.map((post, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-xs px-2 py-1 bg-primary-light text-primary rounded-md font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-dark-gray hover:text-primary transition-colors flex-1 truncate">
                      {post.title}
                    </span>
                  </div>
                  <span className="text-xs text-medium-gray ml-4">
                    {post.date}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a 
                href="/announcements" 
                className="text-sm text-medium-gray hover:text-primary transition-colors"
              >
                더보기 →
              </a>
            </div>
          </TabsContent>
          
          <TabsContent value="jobs" className="mt-4">
            <div className="space-y-2">
              {posts.jobs.map((post, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-xs px-2 py-1 bg-info-light text-info rounded-md font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-dark-gray hover:text-primary transition-colors flex-1 truncate">
                      {post.title}
                    </span>
                  </div>
                  <span className="text-xs text-medium-gray ml-4">
                    {post.date}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a 
                href="/announcements" 
                className="text-sm text-medium-gray hover:text-primary transition-colors"
              >
                더보기 →
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}