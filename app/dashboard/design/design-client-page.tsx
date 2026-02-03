'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import UpgradeBanner from '@/components/dashboard/upgrade-banner';
import DesignEditor from '@/components/dashboard/design/design-editor';
import { Profile } from '@/utils/user-data';

// Skeleton Component
function DesignPageSkeleton() {
  return (
    <div className="w-full h-full p-4 animate-pulse bg-gray-50 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-1/3 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-[60vh] w-full bg-gray-200 rounded-xl shadow-sm"></div>
    </div>
  );
}

interface DesignClientPageProps {
  initialConfig: any;
  initialProducts: any[];
  userId: string;
  slug: string;
  initialProfile: Profile;
}

export default function DesignClientPage({
  initialConfig,
  initialProducts,
  userId,
  slug,
  initialProfile
}: DesignClientPageProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to profile changes
    const channel = supabase
      .channel('realtime-profile')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          // Merge the new data with existing structure to maintain type consistency
          // assuming payload.new has the updated fields
          setProfile((prev) => ({ ...prev, ...payload.new } as Profile));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // If for some reason profile becomes null (shouldn't happen if initialized), show skeleton
  if (!profile) {
     return <DesignPageSkeleton />;
  }

  const isPro = profile.is_pro === true;

  if (!isPro) {
    return <UpgradeBanner />;
  }

  return (
    <div className="flex-1 w-full h-full bg-gray-50 overflow-hidden">
      <DesignEditor
        initialConfig={initialConfig}
        initialProducts={initialProducts}
        userId={userId}
        slug={slug}
        isPro={true}
      />
    </div>
  );
}
