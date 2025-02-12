"use client";
import { Coins } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function CreditDisplay() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    if (session?.user?.credits !== undefined) {
      setCredits(session.user.credits);
    }
  }, [session?.user?.credits]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-full">
      <Coins className="h-4 w-4 text-amber-500" />
      <span className="text-sm font-medium text-amber-500">{credits} credits</span>
    </div>
  );
}
