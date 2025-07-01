import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  mockClassSpaces,
  mockDailySheets,
  mockUsers,
  mockSheetEntries,
  mockChatMessages,
} from "@/data/mockData";
import { ArrowLeft, Plus, Eye, EyeOff, MessageSquare } from "lucide-react";
import { SheetTable } from "@/components/SheetTable";
import { ChatPanel } from "@/components/ChatPanel";
import { AddRowDialog } from "@/components/AddRowDialog";

export default function DailySheet() {
  const { classId, sheetId } = useParams();
  const { user } = useAuth();
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const classSpace = mockClassSpaces.find((cs) => cs.id === classId);
  const dailySheet = mockDailySheets.find((ds) => ds.id === sheetId);

  if (!classSpace || !dailySheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">시트를 찾을 수 없습니다</h1>
          <Link to="/dashboard">
            <Button>대시보드로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isInstructor = user?.id === classSpace.instructorId;
  const students = mockUsers.filter((u) => classSpace.students.includes(u.id));
  const entries = mockSheetEntries.filter((e) => e.dailySheetId === sheetId);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link to={`/class/${classId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                수업 공간
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{dailySheet.title}</h1>
              <p className="text-muted-foreground">
                {classSpace.name} •{" "}
                {new Date(dailySheet.date).toLocaleDateString("ko-KR")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setChatOpen(!chatOpen)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {chatOpen ? "채팅 숨기기" : "채팅 보기"}
              </Button>
              {isInstructor && (
                <Button onClick={() => setAddRowOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  주제 추가
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-120px)]">
        <div
          className={`flex-1 ${
            chatOpen ? "pr-80" : ""
          } transition-all duration-300`}
        >
          <div className="p-6 h-full overflow-auto">
            <SheetTable
              dailySheet={dailySheet}
              students={students}
              entries={entries}
              currentUser={user}
              isInstructor={isInstructor}
            />
          </div>
        </div>

        {chatOpen && (
          <div className="fixed right-0 top-[120px] w-80 h-[calc(100vh-120px)] border-l bg-white">
            <ChatPanel
              classSpaceId={classId!}
              messages={mockChatMessages.filter(
                (m) => m.classSpaceId === classId
              )}
              currentUser={user}
            />
          </div>
        )}
      </main>

      <AddRowDialog
        open={addRowOpen}
        onOpenChange={setAddRowOpen}
        dailySheetId={sheetId!}
      />
    </div>
  );
}
