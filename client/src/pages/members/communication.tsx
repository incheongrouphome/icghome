import BoardList from "@/components/boards/board-list";

export default function Communication() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              소통공간
            </h1>
            <p className="text-lg text-medium-gray">
              회원기관 간 소통과 정보 공유를 위한 공간
            </p>
          </div>

          <BoardList categorySlug="communication" />
        </div>
      </div>
    </div>
  );
}