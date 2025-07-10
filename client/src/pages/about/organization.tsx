export default function Organization() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              조직 현황
            </h1>
            <p className="text-lg text-medium-gray">
              한국아동청소년그룹홈협의회 인천지부의 조직 구성과 현황
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
            <h2 className="text-2xl font-semibold text-dark-gray mb-6">
              조직 구성
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <h3 className="font-semibold text-dark-gray mb-2">회장</h3>
                <p className="text-sm text-medium-gray">
                  협의회 대표 및 총괄
                </p>
              </div>

              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-dark-gray mb-2">이사회</h3>
                <p className="text-sm text-medium-gray">
                  주요 정책 및 방향 결정
                </p>
              </div>

              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold text-dark-gray mb-2">사무국</h3>
                <p className="text-sm text-medium-gray">
                  실무 업무 처리 및 운영
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                회원 현황
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-medium-gray">정회원</span>
                  <span className="font-semibold text-dark-gray">12개소</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-medium-gray">준회원</span>
                  <span className="font-semibold text-dark-gray">3개소</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-medium-gray">특별회원</span>
                  <span className="font-semibold text-dark-gray">2개소</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-dark-gray">총 회원</span>
                  <span className="font-bold text-primary text-lg">17개소</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                운영 위원회
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-dark-gray mb-2">기획운영위원회</h3>
                  <p className="text-sm text-medium-gray">
                    협의회 전반적인 운영 계획 수립
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark-gray mb-2">교육위원회</h3>
                  <p className="text-sm text-medium-gray">
                    종사자 교육 프로그램 개발 및 운영
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark-gray mb-2">정책위원회</h3>
                  <p className="text-sm text-medium-gray">
                    정책 연구 및 제안서 작성
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark-gray mb-2">홍보위원회</h3>
                  <p className="text-sm text-medium-gray">
                    대외 홍보 및 소통 활동
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