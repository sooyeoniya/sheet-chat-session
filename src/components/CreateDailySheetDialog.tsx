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

interface CreateDailySheetForm {
  title: string;
  date: string;
}

interface CreateDailySheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classSpaceId: string;
}

export function CreateDailySheetDialog({
  open,
  onOpenChange,
  classSpaceId,
}: CreateDailySheetDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDailySheetForm>();
  const { toast } = useToast();

  const onSubmit = (data: CreateDailySheetForm) => {
    // 실제로는 여기서 API 호출
    console.log("새 데일리 시트 생성:", { ...data, classSpaceId });

    toast({
      title: "데일리 시트가 생성되었습니다!",
      description: `${data.title} 시트가 성공적으로 만들어졌습니다.`,
    });

    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 데일리 시트 만들기</DialogTitle>
          <DialogDescription>
            오늘 수업의 데일리 시트를 만들어보세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">시트 제목</Label>
            <Input
              id="title"
              placeholder="예: 1주차 1일차 - 오리엔테이션"
              {...register("title", { required: "시트 제목을 입력해주세요" })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">수업 날짜</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: "수업 날짜를 선택해주세요" })}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
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
