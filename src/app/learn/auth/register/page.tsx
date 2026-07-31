import type { Metadata } from 'next';
import { GraduationCap } from 'lucide-react';
import { RegisterForm } from '@/features/learn/auth/components/register-form';

export const metadata: Metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <GraduationCap className="mx-auto size-10 text-primary" />
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start learning today
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
