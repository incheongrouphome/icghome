export default function GeneralAnnouncements() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              열린공지
            </h1>
            <p className="text-lg text-medium-gray">
              한국아동청소년그룹홈협의회 인천지부의 공개 공지사항
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-dark-gray">
                최신 공지사항
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-medium-gray">총 게시물:</span>
                <span className="text-sm font-semibold text-primary">23개</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      중요
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      2024년 아동복지법 개정안 시행 안내
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.22</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  2024년 3월 1일부터 시행되는 아동복지법 개정안에 대한 주요 내용과 
                  그룹홈 운영에 미치는 영향에 대해 안내드립니다.
                </p>
                <div className="flex items-center space-x-4 text-sm text-medium-gray">
                  <span>조회수: 156</span>
                  <span>첨부파일: 2개</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      일반
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      2024년 상반기 종사자 교육 일정 안내
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.18</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  2024년 상반기 종사자 교육 프로그램 일정과 신청 방법을 안내드립니다.
                </p>
                <div className="flex items-center space-x-4 text-sm text-medium-gray">
                  <span>조회수: 89</span>
                  <span>첨부파일: 1개</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      행사
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      아동권리 증진을 위한 공개 세미나 개최
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.15</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  아동권리 증진을 위한 공개 세미나가 2월 20일 개최됩니다. 
                  많은 관심과 참여 부탁드립니다.
                </p>
                <div className="flex items-center space-x-4 text-sm text-medium-gray">
                  <span>조회수: 67</span>
                  <span>첨부파일: 3개</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      안내
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      정부 지원 사업 공모 안내
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.12</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  2024년 정부 지원 사업 공모 관련 안내사항을 공지드립니다.
                </p>
                <div className="flex items-center space-x-4 text-sm text-medium-gray">
                  <span>조회수: 134</span>
                  <span>첨부파일: 4개</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                공지사항 분류
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      중요
                    </span>
                    <span className="text-dark-gray">중요 공지사항</span>
                  </div>
                  <span className="text-sm text-medium-gray">8개</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      일반
                    </span>
                    <span className="text-dark-gray">일반 공지사항</span>
                  </div>
                  <span className="text-sm text-medium-gray">12개</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      행사
                    </span>
                    <span className="text-dark-gray">행사 안내</span>
                  </div>
                  <span className="text-sm text-medium-gray">3개</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                알림 서비스
              </h2>
              <div className="space-y-4">
                <div className="p-4 border border-primary/30 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold text-dark-gray mb-2">
                    📧 이메일 알림
                  </h3>
                  <p className="text-medium-gray text-sm mb-3">
                    새로운 공지사항을 이메일로 받아보세요.
                  </p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    알림 신청하기
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-dark-gray">공지사항 이용 안내</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">
                        누구나 열람 가능
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">
                        첨부파일 다운로드 가능
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">
                        정기적으로 업데이트
                      </span>
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