import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DailySheet, User, SheetEntry } from "@/types";
import { Eye, EyeOff, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useData } from "@/hooks/useData";

interface SheetTableProps {
  dailySheet: DailySheet;
  students: User[];
  entries: SheetEntry[];
  currentUser: User | null;
  isInstructor: boolean;
}

export function SheetTable({
  dailySheet,
  students,
  entries,
  currentUser,
  isInstructor,
}: SheetTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();
  const { updateSheetEntry, addChatMessage } = useData();

  const getEntryContent = (rowId: string, userId: string) => {
    const entry = entries.find((e) => e.rowId === rowId && e.userId === userId);
    return entry?.content || "";
  };

  const handleEdit = (rowId: string, userId: string) => {
    const cellKey = `${rowId}-${userId}`;
    const content = getEntryContent(rowId, userId);
    setEditingCell(cellKey);
    setEditContent(content);
  };

  const handleSave = (rowId: string, userId: string) => {
    // 시트 엔트리 업데이트
    updateSheetEntry({
      dailySheetId: dailySheet.id,
      rowId,
      userId,
      content: editContent,
    });

    // 채팅 메시지 추가 (선택적)
    addChatMessage({
      classSpaceId: dailySheet.classSpaceId,
      userId,
      content: `${students.find((s) => s.id === userId)?.name}님이 "${
        dailySheet.rows.find((r) => r.id === rowId)?.title
      }"에 답변했습니다: ${editContent}`,
    });

    toast({
      title: "저장되었습니다",
      description: "내용이 성공적으로 저장되었습니다.",
    });

    setEditingCell(null);
    setEditContent("");
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditContent("");
  };

  const visibleRows = dailySheet.rows.filter(
    (row) => isInstructor || row.isPublic
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">주제</TableHead>
              {students.map((student) => (
                <TableHead key={student.id} className="text-center min-w-48">
                  {student.name}
                </TableHead>
              ))}
              {isInstructor && <TableHead className="w-20">관리</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row) => {
              const cellKey = editingCell?.split("-");
              const isRowEditing = cellKey?.[0] === row.id;

              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {!row.isPublic && (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span>{row.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {row.type === "checkin" && "체크인"}
                      {row.type === "question" && "질문"}
                      {row.type === "discussion" && "토론"}
                      {row.type === "text" && "텍스트"}
                    </div>
                  </TableCell>

                  {students.map((student) => {
                    const cellKey = `${row.id}-${student.id}`;
                    const isEditing = editingCell === cellKey;
                    const content = getEntryContent(row.id, student.id);
                    const canEdit =
                      currentUser?.id === student.id && row.isPublic;

                    return (
                      <TableCell key={student.id} className="align-top">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-20"
                              placeholder="내용을 입력하세요..."
                            />
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSave(row.id, student.id)}
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="group relative min-h-20">
                            {content ? (
                              <div className="whitespace-pre-wrap text-sm p-2 bg-muted/50 rounded">
                                {content}
                              </div>
                            ) : (
                              <div className="text-muted-foreground text-sm p-2 bg-muted/20 rounded dashed border-2 border-dashed">
                                {row.isPublic
                                  ? "내용을 입력하세요"
                                  : "비공개 주제"}
                              </div>
                            )}

                            {canEdit && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                                onClick={() => handleEdit(row.id, student.id)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}

                  {isInstructor && (
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // 공개/비공개 토글 로직
                          toast({
                            title: row.isPublic
                              ? "주제를 비공개로 변경했습니다"
                              : "주제를 공개로 변경했습니다",
                          });
                        }}
                      >
                        {row.isPublic ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  )}
                  <TableCell>
                    <Button size="sm">삭제</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
