export default function Association() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              협의회 소개
            </h1>
            <p className="text-lg text-medium-gray">
              한국아동청소년그룹홈협의회 인천지부의 역할과 목적
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
            <h2 className="text-2xl font-semibold text-dark-gray mb-6">
              설립 목적
            </h2>
            <p className="text-medium-gray leading-relaxed mb-6">
              한국아동청소년그룹홈협의회 인천지부는 인천 지역 내 아동청소년 그룹홈 간의 
              협력과 연대를 통해 보다 나은 아동복지 서비스를 제공하고자 설립되었습니다.
            </p>
            <ul className="space-y-3 text-medium-gray">
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>인천 지역 그룹홈 간의 정보 공유 및 협력 강화</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>아동청소년 복지 서비스 질 향상</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>종사자 역량 강화 및 교육 지원</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>정책 개발 및 제안 활동</span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-4">
                주요 활동
              </h2>
              <ul className="space-y-3 text-medium-gray">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>정기 회의 및 워크숍 개최</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>종사자 교육 및 연수</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>정보 교류 및 네트워킹</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>정책 연구 및 제안</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-4">
                비전과 가치
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-dark-gray mb-2">비전</h3>
                  <p className="text-medium-gray text-sm">
                    아동청소년이 안전하고 건강하게 성장할 수 있는 
                    지역사회 환경 조성
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark-gray mb-2">가치</h3>
                  <p className="text-medium-gray text-sm">
                    협력, 전문성, 투명성, 책임감을 바탕으로 
                    아동 최우선의 원칙 실현
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}