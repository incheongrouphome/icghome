import BoardList from "@/components/boards/board-list";

export default function Application() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              사업신청
            </h1>
            <p className="text-lg text-medium-gray">
              협의회에서 진행하는 각종 사업 신청 안내
            </p>
          </div>

          <BoardList categorySlug="business-application" />
        </div>
      </div>
    </div>
  );
}