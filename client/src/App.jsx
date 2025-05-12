
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/queryClient';
import Router from './Router';
import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { useState } from 'react';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="smarthaven-theme">
        <TooltipProvider>
          <Toaster />
          <div className="flex h-screen bg-background">
            <Sidebar 
              isMobileOpen={isMobileMenuOpen} 
              setIsMobileOpen={setIsMobileMenuOpen} 
            />
            <div className="flex-1 flex flex-col min-h-screen">
              <TopNav />
              <main className="flex-1 overflow-y-auto pt-16 pb-20 md:pb-0">
                <Router />
              </main>
              <MobileNav onMenuClick={() => setIsMobileMenuOpen(true)} />
            </div>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
