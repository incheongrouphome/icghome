export default function GroupHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              그룹홈 소개
            </h1>
            <p className="text-lg text-medium-gray">
              아동청소년 그룹홈의 역할과 의미에 대해 알아보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-4">
                그룹홈이란?
              </h2>
              <p className="text-medium-gray leading-relaxed">
                그룹홈은 가정과 같은 환경에서 보호가 필요한 아동청소년들이 
                함께 생활하며 건강하게 성장할 수 있도록 돕는 가정형 보호시설입니다.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-dark-gray mb-4">
                그룹홈의 목적
              </h2>
              <p className="text-medium-gray leading-relaxed">
                아동청소년의 건전한 성장과 발달을 지원하고, 
                가정과 같은 환경에서 안정적인 보호와 교육을 제공합니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-dark-gray mb-6">
              그룹홈의 특징
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="font-semibold text-dark-gray mb-2">가정적 환경</h3>
                <p className="text-sm text-medium-gray">
                  가정과 같은 환경에서 소규모 집단생활
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-dark-gray mb-2">개별화된 보호</h3>
                <p className="text-sm text-medium-gray">
                  아동 개인의 특성에 맞춘 맞춤형 보호
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="font-semibold text-dark-gray mb-2">교육지원</h3>
                <p className="text-sm text-medium-gray">
                  학습 및 진로 지원을 통한 자립 준비
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}