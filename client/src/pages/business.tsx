import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BookOpen, Heart, Award, Briefcase } from "lucide-react";

export default function Business() {
  const businesses = [
    {
      icon: <BookOpen className="text-primary" size={24} />,
      title: "교육 및 연수사업",
      description: "그룹홈 종사자의 전문성 향상을 위한 다양한 교육 프로그램",
      details: [
        "신규 종사자 기초교육",
        "보수교육 및 보수연수",
        "전문성 강화 워크숍",
        "아동권리 교육"
      ],
      status: "연중 진행"
    },
    {
      icon: <Users className="text-accent" size={24} />,
      title: "네트워킹 사업",
      description: "회원기관 간 정보교류 및 협력체계 구축",
      details: [
        "정기 회원총회",
        "실무진 간담회",
        "정보교류 워크숍",
        "공동사업 추진"
      ],
      status: "월 1회"
    },
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: "아동복지 증진사업",
      description: "보호아동의 건전한 성장과 자립지원을 위한 프로그램",
      details: [
        "자립준비 프로그램",
        "심리치료 지원",
        "문화체험 활동",
        "진로지도 상담"
      ],
      status: "연중 진행"
    },
    {
      icon: <Award className="text-info" size={24} />,
      title: "정책제안 및 옹호사업",
      description: "아동청소년 그룹홈 관련 정책 개선 및 권익보호",
      details: [
        "정책연구 및 제안",
        "제도개선 건의",
        "권익보호 활동",
        "대외협력 강화"
      ],
      status: "상시 진행"
    },
    {
      icon: <Briefcase className="text-purple-500" size={24} />,
      title: "인력개발 사업",
      description: "우수한 그룹홈 종사자 양성 및 역량강화",
      details: [
        "멘토링 프로그램",
        "우수사례 공유",
        "전문인력 양성",
        "리더십 교육"
      ],
      status: "분기별"
    },
    {
      icon: <Calendar className="text-orange-500" size={24} />,
      title: "특별사업",
      description: "계절별 특별 프로그램 및 이벤트 운영",
      details: [
        "여름캠프",
        "송년회 및 신년회",
        "어린이날 행사",
        "추석 명절 프로그램"
      ],
      status: "계절별"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">사업소개</h1>
          <p className="text-lg text-medium-gray">
            인천지부에서 진행하는 다양한 사업들을 소개합니다
          </p>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((business, index) => (
            <Card key={index} className="shadow-soft card-hover transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    {business.icon}
                    <span className="ml-3">{business.title}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {business.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-medium-gray text-sm leading-relaxed">
                  {business.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-dark-gray text-sm">주요 내용:</h4>
                  <ul className="space-y-1">
                    {business.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-medium-gray">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-soft bg-primary-light">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
                <Calendar className="text-primary mr-2" size={20} />
                2024년 주요 일정
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-medium-gray">정기총회</span>
                  <span className="font-medium">3월</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-gray">종사자 교육</span>
                  <span className="font-medium">4월, 9월</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-gray">여름캠프</span>
                  <span className="font-medium">7월</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-gray">송년회</span>
                  <span className="font-medium">12월</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-warm-gray">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
                <Briefcase className="text-accent mr-2" size={20} />
                사업 참여 안내
              </h3>
              <div className="space-y-3 text-sm text-medium-gray">
                <p>• 회원기관은 모든 사업에 참여 가능합니다</p>
                <p>• 비회원기관도 일부 사업 참여 가능합니다</p>
                <p>• 참가비는 사업별로 상이하며 사전 공지됩니다</p>
                <p>• 자세한 내용은 사무국으로 문의해주세요</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
