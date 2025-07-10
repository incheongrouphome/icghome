import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Briefcase } from "lucide-react";
import BoardList from "@/components/boards/board-list";

export default function Announcements() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">공지사항</h1>
          <p className="text-lg text-medium-gray">
            일반인도 열람 가능한 공개 공지사항입니다
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="general" className="flex items-center">
              <Megaphone size={16} className="mr-2" />
              열린공지
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase size={16} className="mr-2" />
              채용공고
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Megaphone className="text-primary mr-3" size={24} />
                  열린공지
                </CardTitle>
                <p className="text-sm text-medium-gray">
                  일반인도 열람 가능한 공개 공지사항입니다. 관리자만 작성 가능하며, 누구나 댓글을 달 수 있습니다.
                </p>
              </CardHeader>
              <CardContent>
                <BoardList categorySlug="general-notices" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="text-accent mr-3" size={24} />
                  채용공고
                </CardTitle>
                <p className="text-sm text-medium-gray">
                  그룹홈 및 관련 기관의 채용정보입니다. 관리자만 작성 가능하며, 누구나 열람할 수 있습니다.
                </p>
              </CardHeader>
              <CardContent>
                <BoardList categorySlug="job-postings" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
