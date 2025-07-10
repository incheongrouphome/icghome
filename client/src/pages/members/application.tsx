export default function Application() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              사업신청
            </h1>
            <p className="text-lg text-medium-gray">
              협의회에서 진행하는 각종 사업 신청 안내
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
            <h2 className="text-2xl font-semibold text-dark-gray mb-6">
              신청 가능한 사업
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">교육 사업</h3>
                    <p className="text-sm text-medium-gray">종사자 역량 강화 교육</p>
                  </div>
                </div>
                <p className="text-medium-gray text-sm mb-4">
                  그룹홈 종사자를 위한 전문 교육 프로그램 신청
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">신청 기간: 연중</span>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    신청하기 →
                  </button>
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">지원 사업</h3>
                    <p className="text-sm text-medium-gray">운영비 및 프로그램 지원</p>
                  </div>
                </div>
                <p className="text-medium-gray text-sm mb-4">
                  회원기관 운영 지원 및 특별 프로그램 개발비 지원
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">신청 기간: 1월~2월</span>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    신청하기 →
                  </button>
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">협력 사업</h3>
                    <p className="text-sm text-medium-gray">기관 간 협력 프로젝트</p>
                  </div>
                </div>
                <p className="text-medium-gray text-sm mb-4">
                  회원기관 간 협력을 통한 공동 프로젝트 및 프로그램
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">신청 기간: 상시</span>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    신청하기 →
                  </button>
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">🔬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">연구 사업</h3>
                    <p className="text-sm text-medium-gray">정책 연구 및 개발</p>
                  </div>
                </div>
                <p className="text-medium-gray text-sm mb-4">
                  아동복지 정책 연구 및 현장 기반 연구 프로젝트
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">신청 기간: 3월~4월</span>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    신청하기 →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                신청 절차
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">신청서 작성</h3>
                    <p className="text-medium-gray text-sm">
                      온라인 신청서 작성 및 필요서류 준비
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">서류 검토</h3>
                    <p className="text-medium-gray text-sm">
                      제출된 서류 및 신청 내용 검토
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">심사 및 승인</h3>
                    <p className="text-medium-gray text-sm">
                      심사위원회 심사 후 승인 여부 결정
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">사업 진행</h3>
                    <p className="text-medium-gray text-sm">
                      승인된 사업 계획에 따라 진행
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                신청 안내
              </h2>
              <div className="space-y-4">
                <div className="p-4 border border-primary/30 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold text-dark-gray mb-2">
                    회원 로그인 필요
                  </h3>
                  <p className="text-medium-gray text-sm mb-3">
                    사업 신청을 위해서는 회원 로그인이 필요합니다.
                  </p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    로그인하기
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-dark-gray">필수 서류</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">사업 계획서</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">예산서</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">기관 현황서</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">기타 관련 서류</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}