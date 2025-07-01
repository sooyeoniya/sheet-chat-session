import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { mockClassSpaces } from "@/data/mockData";

interface CreateClassSpaceForm {
  name: string;
  startDate: string;
  endDate: string;
}

interface CreateClassSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateClassSpaceDialog({
  open,
  onOpenChange,
}: CreateClassSpaceDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClassSpaceForm>();
  const { toast } = useToast();
  const { user } = useAuth();

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const onSubmit = (data: CreateClassSpaceForm) => {
    if (!user) return;

    // 새로운 수업 공간 생성
    const newClassSpace = {
      id: `class_${Date.now()}`,
      name: data.name,
      instructorId: user.id,
      startDate: data.startDate,
      endDate: data.endDate,
      inviteCode: generateInviteCode(),
      students: [],
      createdAt: new Date().toISOString(),
    };

    // mockData에 추가
    mockClassSpaces.push(newClassSpace);

    console.log("새 수업 공간 생성:", newClassSpace);

    toast({
      title: "수업 공간이 생성되었습니다!",
      description: `${data.name} 수업이 성공적으로 만들어졌습니다.`,
    });

    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 수업 공간 만들기</DialogTitle>
          <DialogDescription>
            수업 공간의 기본 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">수업 이름</Label>
            <Input
              id="name"
              placeholder="예: 레벨 1"
              {...register("name", { required: "수업 이름을 입력해주세요" })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">시작일</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", {
                  required: "시작일을 선택해주세요",
                })}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">종료일</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate", { required: "종료일을 선택해주세요" })}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit">만들기</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
