import BoardList from "@/components/boards/board-list";

export default function GeneralAnnouncements() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              열린공지
            </h1>
            <p className="text-lg text-medium-gray">
              한국아동청소년그룹홈협의회 인천지부의 공개 공지사항
            </p>
          </div>

          <BoardList categorySlug="general-notices" />
        </div>
      </div>
    </div>
  );
}