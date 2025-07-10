import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CreditCard, Building, Phone, Mail } from "lucide-react";

export default function Donation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">후원안내</h1>
          <p className="text-lg text-medium-gray">
            아이들의 밝은 미래를 위한 따뜻한 손길을 기다립니다
          </p>
        </div>

        {/* Hero Section */}
        <Card className="shadow-soft mb-8 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <Heart className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-dark-gray mb-4">
              작은 후원이 큰 희망이 됩니다
            </h2>
            <p className="text-medium-gray mb-6 leading-relaxed">
              여러분의 후원은 보호가 필요한 아동청소년들에게 따뜻한 보금자리와 
              밝은 미래를 선물하는 소중한 기회입니다.
            </p>
          </CardContent>
        </Card>

        {/* 후원 방법 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 정기후원 */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="text-red-500 mr-3" size={24} />
                정기후원
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-medium-gray text-sm">
                매월 일정 금액을 후원하여 지속적인 도움을 주는 방법입니다.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-dark-gray">추천 후원금액</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-warm-gray p-2 rounded text-center">월 1만원</div>
                  <div className="bg-warm-gray p-2 rounded text-center">월 3만원</div>
                  <div className="bg-warm-gray p-2 rounded text-center">월 5만원</div>
                  <div className="bg-warm-gray p-2 rounded text-center">월 10만원</div>
                </div>
              </div>

              <Button className="w-full" variant="default">
                정기후원 신청하기
              </Button>
            </CardContent>
          </Card>

          {/* 일시후원 */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="text-primary mr-3" size={24} />
                일시후원
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-medium-gray text-sm">
                필요할 때 원하는 금액으로 후원하는 방법입니다.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-dark-gray">추천 후원금액</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-warm-gray p-2 rounded text-center">5만원</div>
                  <div className="bg-warm-gray p-2 rounded text-center">10만원</div>
                  <div className="bg-warm-gray p-2 rounded text-center">30만원</div>
                  <div className="bg-warm-gray p-2 rounded text-center">50만원</div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                일시후원 하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 후원 계좌 정보 */}
        <Card className="shadow-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="text-accent mr-3" size={24} />
              후원 계좌 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-warm-gray p-4 rounded-lg">
                  <h4 className="font-semibold text-dark-gray mb-2">우리은행</h4>
                  <p className="text-lg font-bold text-primary">1002-123-456789</p>
                  <p className="text-sm text-medium-gray">예금주: 한국아동청소년그룹홈협의회인천지부</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-warm-gray p-4 rounded-lg">
                  <h4 className="font-semibold text-dark-gray mb-2">국민은행</h4>
                  <p className="text-lg font-bold text-primary">123456-04-123456</p>
                  <p className="text-sm text-medium-gray">예금주: 한국아동청소년그룹홈협의회인천지부</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-dark-gray">
                <strong>입금 시 유의사항:</strong> 후원자 성함과 연락처를 입금자명에 
                함께 기재해주시면 후원 확인 및 세금공제 영수증 발급에 도움이 됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 후원 혜택 */}
        <Card className="shadow-soft mb-8">
          <CardHeader>
            <CardTitle>후원 혜택</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-receipt text-primary text-xl"></i>
                </div>
                <h4 className="font-semibold text-dark-gray mb-2">세금공제</h4>
                <p className="text-sm text-medium-gray">
                  기부금 세액공제<br/>
                  (개인 15%, 법인 10%)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-newsletter text-accent text-xl"></i>
                </div>
                <h4 className="font-semibold text-dark-gray mb-2">소식지 발송</h4>
                <p className="text-sm text-medium-gray">
                  연 2회 협의회 소식지<br/>
                  및 활동 보고서 발송
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-calendar text-info text-xl"></i>
                </div>
                <h4 className="font-semibold text-dark-gray mb-2">행사 초청</h4>
                <p className="text-sm text-medium-gray">
                  주요 행사 및<br/>
                  감사 인사 행사 초청
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 문의처 */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>후원 문의</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-medium text-dark-gray">전화 문의</p>
                  <p className="text-medium-gray">032-364-1617</p>
                  <p className="text-sm text-medium-gray">평일 09:00 ~ 18:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-medium text-dark-gray">이메일 문의</p>
                  <p className="text-medium-gray">grouphome@daum.net</p>
                  <p className="text-sm text-medium-gray">24시간 접수 가능</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
