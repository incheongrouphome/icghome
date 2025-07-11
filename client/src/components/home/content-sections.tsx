import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const posts = {
  members: {
    notices: [
      {
        category: "회원공지",
        title: "2024년 하반기 정기총회 개최 안내",
        date: "25.04.14"
      },
      {
        category: "회원공지",
        title: "회원기관 운영 매뉴얼 배포",
        date: "25.03.28"
      },
      {
        category: "회원공지",
        title: "종사자 교육 이수 의무화 안내",
        date: "25.03.22"
      },
      {
        category: "회원공지",
        title: "2024년도 사업계획서 제출 안내",
        date: "25.03.18"
      },
      {
        category: "회원공지",
        title: "회원기관 실무자 회의 개최",
        date: "25.03.12"
      }
    ],
    communication: [
      {
        category: "소통공간",
        title: "운영 노하우 공유 - 아동 상담 사례",
        date: "25.04.10"
      },
      {
        category: "소통공간",
        title: "시설 개선 아이디어 모음",
        date: "25.04.05"
      },
      {
        category: "소통공간",
        title: "우수 운영사례 공유회 후기",
        date: "25.04.02"
      },
      {
        category: "소통공간",
        title: "그룹홈 아동 학습지도 방법론",
        date: "25.03.30"
      },
      {
        category: "소통공간",
        title: "지역사회 연계 프로그램 사례",
        date: "25.03.25"
      }
    ],
    applications: [
      {
        category: "사업신청",
        title: "2024년 그룹홈 운영비 지원사업 신청",
        date: "25.03.20"
      },
      {
        category: "사업신청",
        title: "종사자 교육비 지원 프로그램 접수",
        date: "25.03.15"
      },
      {
        category: "사업신청",
        title: "시설 개보수 지원 사업 안내",
        date: "25.03.10"
      },
      {
        category: "사업신청",
        title: "아동 문화활동 지원 프로그램",
        date: "25.03.05"
      },
      {
        category: "사업신청",
        title: "심리치료 프로그램 운영비 지원",
        date: "25.03.01"
      }
    ]
  },
  announcements: {
    public: [
      {
        category: "열린공지",
        title: "아동보호전문기관 연계 강화 방안",
        date: "25.04.20"
      },
      {
        category: "열린공지",
        title: "청소년 자립지원 프로그램 운영 계획",
        date: "25.04.15"
      },
      {
        category: "열린공지",
        title: "2024년 아동복지법 개정안 시행 안내",
        date: "25.04.12"
      },
      {
        category: "열린공지",
        title: "그룹홈 운영 가이드라인 개정",
        date: "25.04.08"
      },
      {
        category: "열린공지",
        title: "아동학대 예방교육 의무화 공지",
        date: "25.04.05"
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
        category: "채용공고",
        title: "그룹홈 시설장 채용 공고",
        date: "25.05.02"
      },
      {
        category: "채용공고",
        title: "사회복지사 계약직 모집",
        date: "25.04.28"
      },
      {
        category: "채용공고",
        title: "보조교사 시간제 근무자 모집",
        date: "25.04.25"
      }
    ]
  }
};

export default function ContentSections() {

  const getCategoryColors = (category: string) => {
    switch(category) {
      case "회원공지":
        return "bg-primary-light text-primary";
      case "소통공간":
        return "bg-green-100 text-green-600";
      case "사업신청":
        return "bg-purple-100 text-purple-600";
      case "열린공지":
        return "bg-blue-100 text-blue-600";
      case "채용공고":
        return "bg-info-light text-info";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 회원기관 */}
      <Card className="shadow-soft border border-gray-100 h-48">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-dark-gray">회원기관</h3>
            <a 
              href="/members" 
              className="text-xs text-medium-gray hover:text-primary transition-colors"
            >
              더보기 →
            </a>
          </div>
          <Tabs defaultValue="notices" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="notices" className="text-xs">회원공지</TabsTrigger>
              <TabsTrigger value="communication" className="text-xs">소통공간</TabsTrigger>
              <TabsTrigger value="applications" className="text-xs">사업신청</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notices" className="mt-2">
              <div className="space-y-1">
                {posts.members.notices.slice(0, 5).map((post, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-full border border-purple-100">
                        회원공지
                      </span>
                      <span className="text-xs text-dark-gray hover:text-primary transition-colors truncate">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-xs text-medium-gray ml-2">
                      {post.date}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="communication" className="mt-2">
              <div className="space-y-1">
                {posts.members.communication.slice(0, 5).map((post, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-50 rounded-full border border-orange-100">
                        소통
                      </span>
                      <span className="text-xs text-dark-gray hover:text-primary transition-colors truncate">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-xs text-medium-gray ml-2">
                      {post.date}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-2">
              <div className="space-y-1">
                {posts.members.applications.slice(0, 5).map((post, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100">
                        사업신청
                      </span>
                      <span className="text-xs text-dark-gray hover:text-primary transition-colors truncate">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-xs text-medium-gray ml-2">
                      {post.date}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 열린공지 */}
      <Card className="shadow-soft border border-gray-100 h-48">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-dark-gray">열린공지</h3>
            <a 
              href="/announcements" 
              className="text-xs text-medium-gray hover:text-primary transition-colors"
            >
              더보기 →
            </a>
          </div>
          <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="public" className="text-xs">열린공지</TabsTrigger>
              <TabsTrigger value="jobs" className="text-xs">채용공고</TabsTrigger>
            </TabsList>
            
            <TabsContent value="public" className="mt-2">
              <div className="space-y-1">
                {posts.announcements.public.slice(0, 5).map((post, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                        공지
                      </span>
                      <span className="text-xs text-dark-gray hover:text-primary transition-colors truncate">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-xs text-medium-gray ml-2">
                      {post.date}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="jobs" className="mt-2">
              <div className="space-y-1">
                {posts.announcements.jobs.slice(0, 5).map((post, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full border border-green-100">
                        채용
                      </span>
                      <span className="text-xs text-dark-gray hover:text-primary transition-colors truncate">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-xs text-medium-gray ml-2">
                      {post.date}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}