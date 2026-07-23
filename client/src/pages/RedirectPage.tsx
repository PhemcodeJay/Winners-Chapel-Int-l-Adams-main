import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function RedirectPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the admin login
    setLocation('/admin/auth');
  }, [setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
