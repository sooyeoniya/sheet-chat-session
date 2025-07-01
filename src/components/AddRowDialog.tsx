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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/useToast";

interface AddRowForm {
  title: string;
  type: "text" | "question" | "discussion" | "checkin";
  isPublic: boolean;
}

interface AddRowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailySheetId: string;
}

export function AddRowDialog({
  open,
  onOpenChange,
  dailySheetId,
}: AddRowDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddRowForm>({
    defaultValues: {
      isPublic: true,
      type: "text",
    },
  });
  const { toast } = useToast();

  const onSubmit = (data: AddRowForm) => {
    // 실제로는 여기서 API 호출
    console.log("새 주제 추가:", { ...data, dailySheetId });

    toast({
      title: "주제가 추가되었습니다!",
      description: `${data.title} 주제가 성공적으로 추가되었습니다.`,
    });

    reset();
    onOpenChange(false);
  };

  const typeLabels = {
    text: "텍스트",
    question: "질문",
    discussion: "토론",
    checkin: "체크인",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 주제 추가</DialogTitle>
          <DialogDescription>
            데일리 시트에 새로운 주제를 추가합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">주제명</Label>
            <Input
              id="title"
              placeholder="예: 오늘의 학습 목표"
              {...register("title", { required: "주제명을 입력해주세요" })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">주제 유형</Label>
            <Select
              onValueChange={(value) =>
                setValue("type", value as AddRowForm["type"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="주제 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              {...register("isPublic")}
              onCheckedChange={(checked) => setValue("isPublic", checked)}
            />
            <Label htmlFor="isPublic">
              즉시 공개 (체크 해제 시 수업 중 공개 가능)
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit">추가하기</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
