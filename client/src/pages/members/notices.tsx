import BoardList from "@/components/boards/board-list";

export default function MemberNotices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              회원공지
            </h1>
            <p className="text-lg text-medium-gray">
              회원기관을 위한 중요 공지사항
            </p>
          </div>

          <BoardList categorySlug="member-notices" />
        </div>
      </div>
    </div>
  );
}