
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface JoinClassSpaceForm {
  inviteCode: string;
}

interface JoinClassSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinClassSpaceDialog({ open, onOpenChange }: JoinClassSpaceDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JoinClassSpaceForm>();
  const { toast } = useToast();

  const onSubmit = (data: JoinClassSpaceForm) => {
    // 실제로는 여기서 API 호출해서 초대 코드 검증
    console.log('수업 참여 시도:', data);
    
    toast({
      title: "수업에 참여했습니다!",
      description: "새로운 수업 공간에 성공적으로 참여했습니다.",
    });
    
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>수업 참여하기</DialogTitle>
          <DialogDescription>
            멘토가 제공한 초대 코드를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">초대 코드</Label>
            <Input
              id="inviteCode"
              placeholder="LEVEL1ABC"
              className="font-mono uppercase"
              {...register('inviteCode', { 
                required: '초대 코드를 입력해주세요',
                minLength: {
                  value: 6,
                  message: '초대 코드는 최소 6자리입니다'
                }
              })}
            />
            {errors.inviteCode && (
              <p className="text-sm text-destructive">{errors.inviteCode.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">
              참여하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
