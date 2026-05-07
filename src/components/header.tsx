"use client";

import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-2">
        <span className="text-xl">🏋️</span>
        <span className="font-bold text-lg tracking-tight">LiftingDiary</span>
      </div>

      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <>
            <span className="text-sm text-muted-foreground">
              {user.firstName ?? user.username ?? user.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton />
          </>
        ) : (
          <>
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </>
        )}
      </div>
    </header>
  );
}
