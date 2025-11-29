'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push('/');
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="w-full"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}
