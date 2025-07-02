import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { Plus, Users, Calendar, LogOut } from "lucide-react";
import { CreateClassSpaceDialog } from "@/components/CreateClassSpaceDialog";
import { JoinClassSpaceDialog } from "@/components/JoinClassSpaceDialog";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { classSpaces, users } = useData();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  if (!user) return null;

  // 내가 멘토인 수업과 수강생인 수업을 구분
  const myInstructorClasses = classSpaces.filter(
    (cs) => cs.instructorId === user.id
  );
  const myStudentClasses = classSpaces.filter((cs) =>
    cs.students.includes(user.id)
  );
  const allMyClasses = [...myInstructorClasses, ...myStudentClasses];

  const getInstructorName = (instructorId: string) => {
    const instructor = users.find((u) => u.id === instructorId);
    return instructor?.name || "알 수 없음";
  };

  const getUserRole = (classSpace: { instructorId: string }) => {
    return classSpace.instructorId === user.id ? "instructor" : "student";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">실시간 수업 플랫폼</h1>
            <p className="text-muted-foreground">안녕하세요, {user.name}님</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">내 수업 공간</h2>
          <div className="flex gap-2">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              수업 공간 만들기
            </Button>
            <Button onClick={() => setJoinDialogOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              수업 참여하기
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMyClasses.map((classSpace) => {
            const userRole = getUserRole(classSpace);
            return (
              <Card
                key={classSpace.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {classSpace.name}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          userRole === "instructor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {userRole === "instructor" ? "멘토" : "수강생"}
                      </span>
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {userRole === "student" &&
                      `멘토: ${getInstructorName(classSpace.instructorId)}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {classSpace.startDate} ~ {classSpace.endDate}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      수강생 {classSpace.students.length}명
                    </div>
                    {userRole === "instructor" && (
                      <div className="text-xs bg-muted p-2 rounded">
                        초대 코드:{" "}
                        <code className="font-mono">
                          {classSpace.inviteCode}
                        </code>
                      </div>
                    )}
                  </div>
                  <Link to={`/class/${classSpace.id}`}>
                    <Button className="w-full">수업 공간 입장</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {allMyClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              참여 중인 수업이 없습니다.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                수업 공간 만들기
              </Button>
              <Button onClick={() => setJoinDialogOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                수업 참여하기
              </Button>
            </div>
          </div>
        )}
      </main>

      <CreateClassSpaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <JoinClassSpaceDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
      />
    </div>
  );
}
