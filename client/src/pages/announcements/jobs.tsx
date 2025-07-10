export default function JobPostings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              채용공고
            </h1>
            <p className="text-lg text-medium-gray">
              그룹홈 및 아동복지 관련 채용 정보
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-dark-gray">
                최신 채용공고
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-medium-gray">총 채용공고:</span>
                <span className="text-sm font-semibold text-primary">12개</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      모집중
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      사회복지사 정규직 모집 (인천 서구)
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.20</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  <strong>기관명:</strong> 행복한우리집그룹홈 | 
                  <strong>자격:</strong> 사회복지사 1급 | 
                  <strong>경력:</strong> 3년 이상
                </p>
                <p className="text-medium-gray text-sm mb-3">
                  인천 서구에 위치한 그룹홈에서 함께 일할 열정적인 사회복지사를 모집합니다.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-medium-gray">
                    <span>마감일: 2024.02.15</span>
                    <span>조회수: 89</span>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    상세보기 →
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      모집중
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      그룹홈 생활복지사 채용 (인천 계양구)
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.18</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  <strong>기관명:</strong> 새싹그룹홈 | 
                  <strong>자격:</strong> 사회복지사 2급 이상 | 
                  <strong>경력:</strong> 신입 가능
                </p>
                <p className="text-medium-gray text-sm mb-3">
                  아동들과 함께 생활하며 돌봄 서비스를 제공할 생활복지사를 모집합니다.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-medium-gray">
                    <span>마감일: 2024.02.20</span>
                    <span>조회수: 67</span>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    상세보기 →
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                      급구
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      시간제 보조교사 모집 (인천 남동구)
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.15</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  <strong>기관명:</strong> 꿈나무그룹홈 | 
                  <strong>자격:</strong> 보육교사 또는 아동학과 졸업 | 
                  <strong>경력:</strong> 무관
                </p>
                <p className="text-medium-gray text-sm mb-3">
                  아동 학습지도 및 돌봄 업무를 담당할 시간제 보조교사를 모집합니다.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-medium-gray">
                    <span>마감일: 2024.02.05</span>
                    <span>조회수: 156</span>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    상세보기 →
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors opacity-60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      마감
                    </span>
                    <h3 className="font-semibold text-dark-gray">
                      그룹홈 시설장 채용 (인천 연수구)
                    </h3>
                  </div>
                  <span className="text-sm text-medium-gray">2024.01.10</span>
                </div>
                <p className="text-medium-gray text-sm mb-3">
                  <strong>기관명:</strong> 사랑의집그룹홈 | 
                  <strong>자격:</strong> 사회복지사 1급 + 5년 이상 경력 | 
                  <strong>경력:</strong> 관리자 경력 우대
                </p>
                <p className="text-medium-gray text-sm mb-3">
                  그룹홈 전체 운영을 총괄할 시설장을 모집하였습니다.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-medium-gray">
                    <span>마감일: 2024.01.31</span>
                    <span>조회수: 234</span>
                  </div>
                  <span className="text-medium-gray text-sm">채용 마감</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                채용 정보 안내
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold text-dark-gray mb-2">
                    📝 채용 공고 등록
                  </h3>
                  <p className="text-medium-gray text-sm mb-3">
                    회원기관은 채용 공고를 무료로 등록할 수 있습니다.
                  </p>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    공고 등록하기 →
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-dark-gray">채용 절차</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">
                        서류 심사
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">
                        면접 진행
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-medium-gray text-sm">
                        최종 합격자 발표
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-6">
                구직자 안내
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-dark-gray mb-2">
                    💼 구직 활동 팁
                  </h3>
                  <ul className="space-y-2 text-sm text-medium-gray">
                    <li>• 관련 자격증 및 경력 미리 준비</li>
                    <li>• 아동복지에 대한 관심과 열정 중요</li>
                    <li>• 지원 전 기관 정보 사전 조사</li>
                    <li>• 면접 시 실무 경험 구체적 설명</li>
                  </ul>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-dark-gray mb-2">
                    📧 채용 알림 서비스
                  </h3>
                  <p className="text-medium-gray text-sm mb-3">
                    새로운 채용 공고를 이메일로 받아보세요.
                  </p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    알림 신청하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}