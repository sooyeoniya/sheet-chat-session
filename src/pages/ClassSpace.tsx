
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { mockClassSpaces, mockDailySheets, mockUsers } from '@/data/mockData';
import { ArrowLeft, Calendar, Plus, MessageSquare } from 'lucide-react';
import { CreateDailySheetDialog } from '@/components/CreateDailySheetDialog';

export default function ClassSpace() {
  const { classId } = useParams();
  const { user } = useAuth();
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const classSpace = mockClassSpaces.find(cs => cs.id === classId);
  const dailySheets = mockDailySheets.filter(ds => ds.classSpaceId === classId);

  if (!classSpace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">수업을 찾을 수 없습니다</h1>
          <Link to="/dashboard">
            <Button>대시보드로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const instructor = mockUsers.find(u => u.id === classSpace.instructorId);
  const isInstructor = user?.role === 'instructor' && user.id === classSpace.instructorId;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                대시보드
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{classSpace.name}</h1>
              <p className="text-muted-foreground">
                멘토: {instructor?.name} | {classSpace.startDate} ~ {classSpace.endDate}
              </p>
            </div>
            {isInstructor && (
              <div className="flex gap-2">
                <Button onClick={() => setCreateSheetOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  데일리 시트 만들기
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">데일리 시트</h2>
            <div className="space-y-4">
              {dailySheets
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((sheet) => (
                <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {sheet.title}
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>
                      {new Date(sheet.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground">
                        주제 {sheet.rows.length}개 • 공개된 주제 {sheet.rows.filter(r => r.isPublic).length}개
                      </p>
                    </div>
                    <Link to={`/class/${classId}/sheet/${sheet.id}`}>
                      <Button className="w-full">
                        시트 열기
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {dailySheets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  아직 생성된 데일리 시트가 없습니다.
                </p>
                {isInstructor && (
                  <Button onClick={() => setCreateSheetOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    첫 데일리 시트 만들기
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  수업 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">참여 학생</h4>
                    <div className="space-y-1">
                      {classSpace.students.map(studentId => {
                        const student = mockUsers.find(u => u.id === studentId);
                        return student ? (
                          <div key={studentId} className="text-sm text-muted-foreground">
                            {student.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  {isInstructor && (
                    <div>
                      <h4 className="font-medium mb-2">초대 코드</h4>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        {classSpace.inviteCode}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        학생들에게 이 코드를 공유하세요
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CreateDailySheetDialog 
        open={createSheetOpen} 
        onOpenChange={setCreateSheetOpen}
        classSpaceId={classId!}
      />
    </div>
  );
}
