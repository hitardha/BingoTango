'use client';

import { GiColiseum } from 'react-icons/gi';
import { appConfig } from '@/app/config';

// Validation function as requested
const isMaintenanceMode = () => {
  return appConfig.maintenance;
};

export default function Page() {
  if (isMaintenanceMode()) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <GiColiseum size={128} className="text-primary mb-8" />
        <h1 className="text-4xl font-bold font-headline text-primary">
          Getting Ready - Comeback soon
        </h1>
      </div>
    );
  }

  // This part will be shown when maintenance mode is off
  return (
    <div>
      <h1>Arena Home</h1>
      <p>Full content goes here when the site is live.</p>
    </div>
  );
}
