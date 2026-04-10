import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className='min-h-screen flex items-center justify-center py-20'>
      <div className='w-full max-w-md mx-auto px-4'>
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-dark-card border border-white/[0.08] shadow-2xl',
            }
          }}
          fallbackRedirectUrl="/courses/dashboard"
          signInUrl="/courses/sign-in"
        />
      </div>
    </main>
  );
}
