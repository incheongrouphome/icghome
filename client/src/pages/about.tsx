import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">협의회 소개</h1>
          <p className="text-lg text-medium-gray">
            아동청소년의 건강한 성장과 발달을 위한 안전한 보금자리를 제공합니다
          </p>
        </div>

        {/* 그룹홈 소개 */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="text-primary mr-3" size={24} />
              그룹홈이란?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-medium-gray leading-relaxed">
              그룹홈은 보호가 필요한 아동청소년들에게 가정과 같은 환경에서 안전하고 
              따뜻한 보살핌을 제공하는 소규모 주거시설입니다.
            </p>
            <p className="text-medium-gray leading-relaxed">
              일반 가정과 유사한 환경에서 소수의 아동청소년이 생활하며, 
              전문적인 보육교사의 24시간 돌봄을 받습니다.
            </p>
          </CardContent>
        </Card>

        {/* 협의회 소개 */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="text-accent mr-3" size={24} />
              인천지부 협의회 소개
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-medium-gray leading-relaxed">
              사단법인 한국아동청소년그룹홈협의회 인천지부는 인천지역 내 그룹홈들의 
              네트워크 강화와 서비스 질 향상을 위해 설립되었습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-warm-gray p-4 rounded-lg">
                <h4 className="font-semibold text-dark-gray mb-2">설립목적</h4>
                <p className="text-sm text-medium-gray">
                  아동청소년 그룹홈의 건전한 발전과 운영의 전문성 향상
                </p>
              </div>
              <div className="bg-warm-gray p-4 rounded-lg">
                <h4 className="font-semibold text-dark-gray mb-2">주요활동</h4>
                <p className="text-sm text-medium-gray">
                  교육, 연수, 정보교환, 정책제안 및 권익보호 활동
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비전과 미션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="text-info mr-3" size={24} />
                우리의 비전
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-medium-gray leading-relaxed">
                모든 아동청소년이 안전하고 따뜻한 환경에서 건강하게 성장할 수 있는 
                사회 구현
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="text-red-500 mr-3" size={24} />
                우리의 미션
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-medium-gray leading-relaxed">
                전문적이고 체계적인 그룹홈 운영을 통해 보호가 필요한 아동청소년에게 
                최적의 돌봄 서비스 제공
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 조직현황 */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>조직현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-primary" size={24} />
                </div>
                <h4 className="font-semibold text-dark-gray mb-1">회원기관</h4>
                <p className="text-2xl font-bold text-primary">25개소</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-accent" size={24} />
                </div>
                <h4 className="font-semibold text-dark-gray mb-1">보호아동</h4>
                <p className="text-2xl font-bold text-accent">150여명</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="text-info" size={24} />
                </div>
                <h4 className="font-semibold text-dark-gray mb-1">종사자</h4>
                <p className="text-2xl font-bold text-info">80여명</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
