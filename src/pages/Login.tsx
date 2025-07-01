
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LoginForm {
  phone: string;
  name: string;
  role: 'instructor' | 'student';
}

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (data: LoginForm) => {
    login(data.phone, data.name, data.role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">실시간 수업 플랫폼</CardTitle>
          <CardDescription>
            전화번호로 간편하게 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                {...register('phone', { 
                  required: '전화번호를 입력해주세요',
                  pattern: {
                    value: /^010-\d{4}-\d{4}$/,
                    message: '010-0000-0000 형식으로 입력해주세요'
                  }
                })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="홍길동"
                {...register('name', { required: '이름을 입력해주세요' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>역할</Label>
              <RadioGroup defaultValue="student" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="student" 
                    id="student"
                    {...register('role')}
                  />
                  <Label htmlFor="student">수강생</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="instructor" 
                    id="instructor"
                    {...register('role')}
                  />
                  <Label htmlFor="instructor">멘토</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
