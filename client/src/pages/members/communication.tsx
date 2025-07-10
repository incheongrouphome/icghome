export default function Communication() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              소통공간
            </h1>
            <p className="text-lg text-medium-gray">
              회원기관 간 소통과 정보 공유를 위한 공간
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
            <h2 className="text-2xl font-semibold text-dark-gray mb-6">
              소통 게시판
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-dark-gray">
                    종사자 교육 후기 공유
                  </h3>
                  <span className="text-sm text-medium-gray">2024.01.20</span>
                </div>
                <p className="text-medium-gray text-sm mb-2">
                  최근 참여한 종사자 교육 프로그램 후기를 공유합니다.
                </p>
                <div className="flex items-center space-x-4 text-sm text-medium-gray">
                  <span>작성자: 김○○</span>
                  <span>조회수: 42</span>
                  <span>댓글: 5</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-dark-gray">
                    아동 자립 지원 프로그램 경험 공유
                  </h3>
                  <span className="text-sm text-medium-gray">2024.01.18</span>
                </div>
                <p className="text-medium-gray text-sm mb-2">
                  효과적인 자립 지원 프로그램 운영 사례를 공유하고 싶습니다.
                </p>
                <div className="flex items-center space-x-4 text-sm text-medium-gray">
                  <span>작성자: 이○○</span>
                  <span>조회수: 38</span>
                  <span>댓글: 3</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-dark-gray">
                    그룹홈 운영 관련 질문
                  </h3>
                  <span className="text-sm text-medium-gray">2024.01.15</span>
                </div>
                <p className="text-medium-gray text-sm mb-2">
                  그룹홈 운영 중 발생한 어려움에 대해 조언 구합니다.
                </p>
                <div className="flex items-center space-x-4 text-sm text-medium-gray">
                  <span>작성자: 박○○</span>
                  <span>조회수: 25</span>
                  <span>댓글: 8</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                자료 공유
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <span className="text-xs">📄</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-dark-gray">교육 자료</h3>
                    <p className="text-sm text-medium-gray">종사자 교육 관련 자료</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <span className="text-xs">📋</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-dark-gray">운영 매뉴얼</h3>
                    <p className="text-sm text-medium-gray">그룹홈 운영 가이드</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <span className="text-xs">📊</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-dark-gray">통계 자료</h3>
                    <p className="text-sm text-medium-gray">회원기관 현황 통계</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                참여 안내
              </h2>
              <div className="space-y-4">
                <div className="p-4 border border-primary/30 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold text-dark-gray mb-2">
                    회원 로그인 필요
                  </h3>
                  <p className="text-medium-gray text-sm mb-3">
                    소통공간 이용을 위해서는 회원 로그인이 필요합니다.
                  </p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    로그인하기
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-medium-gray text-sm">자유로운 의견 교환</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-medium-gray text-sm">경험과 노하우 공유</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-medium-gray text-sm">질문과 답변</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-medium-gray text-sm">자료 공유</span>
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