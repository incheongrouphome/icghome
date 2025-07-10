export default function MemberNotices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              회원공지
            </h1>
            <p className="text-lg text-medium-gray">
              회원기관을 위한 중요 공지사항
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-dark-gray">
                최신 공지사항
              </h2>
              <span className="text-sm text-medium-gray">
                회원 로그인 후 이용 가능
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-dark-gray">
                    [중요] 2024년 정기총회 안내
                  </h3>
                  <span className="text-sm text-medium-gray">2024.01.15</span>
                </div>
                <p className="text-medium-gray text-sm">
                  2024년 정기총회 개최 관련 안내사항을 공지드립니다.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-dark-gray">
                    종사자 교육 프로그램 신청 안내
                  </h3>
                  <span className="text-sm text-medium-gray">2024.01.10</span>
                </div>
                <p className="text-medium-gray text-sm">
                  2024년 상반기 종사자 교육 프로그램 참가 신청을 받습니다.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-dark-gray">
                    회원기관 현황 조사 협조 요청
                  </h3>
                  <span className="text-sm text-medium-gray">2024.01.05</span>
                </div>
                <p className="text-medium-gray text-sm">
                  연례 회원기관 현황 조사에 협조 부탁드립니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-dark-gray mb-6">
              회원 전용 서비스
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-primary/5 rounded-lg">
                <h3 className="font-semibold text-dark-gray mb-3">
                  📋 회의자료 다운로드
                </h3>
                <p className="text-medium-gray text-sm mb-4">
                  정기회의 및 임시회의 자료를 다운로드 받을 수 있습니다.
                </p>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  로그인하여 이용하기 →
                </button>
              </div>

              <div className="p-6 bg-primary/5 rounded-lg">
                <h3 className="font-semibold text-dark-gray mb-3">
                  📊 통계 자료실
                </h3>
                <p className="text-medium-gray text-sm mb-4">
                  인천지부 회원기관 관련 통계 자료를 확인할 수 있습니다.
                </p>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  로그인하여 이용하기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}