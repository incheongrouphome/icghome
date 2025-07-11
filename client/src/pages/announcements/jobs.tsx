import BoardList from "@/components/boards/board-list";

export default function JobPostings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">
              채용공고
            </h1>
            <p className="text-lg text-medium-gray">
              그룹홈 및 아동복지 관련 채용 정보
            </p>
          </div>

          <BoardList categorySlug="job-postings" />
        </div>
      </div>
    </div>
  );
}