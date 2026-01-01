import React from 'react';
import { AppProvider, useAppStore } from './store';
import { CapturePhase } from './components/CapturePhase';
import { AssignmentPhase } from './components/AssignmentPhase';
import { SettlementPhase } from './components/SettlementPhase';
import { LandingPhase } from './components/LandingPhase';
import { RotateCcw, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { FinalLogo } from './components/FinalLogo';
import { AuthButton } from './components/AuthButton';

const Main: React.FC = () => {
  const { phase, reset, user, authLoading } = useAppStore();

  if (authLoading) {
    return (
      <div className="h-[100dvh] bg-white flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <FinalLogo size={80} className="animate-pulse" />
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[100dvh] bg-gray-50 flex flex-col max-w-md md:max-w-2xl mx-auto shadow-xl bg-white overflow-hidden">
        <LandingPhase />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col max-w-md md:max-w-2xl mx-auto shadow-xl bg-white overflow-hidden">
      <header className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          <FinalLogo size={24} className="flex-shrink-0 sm:hidden" />
          <FinalLogo size={28} className="hidden sm:block flex-shrink-0" />
          <div className="flex items-baseline tracking-tight leading-none text-lg min-w-0">
            <span className="font-black text-slate-800">Bill</span>
            <span className="font-light text-slate-800">Beam</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          {phase !== 'capture' && (
            <button
              onClick={reset}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all active:scale-90 flex-shrink-0"
              title="Start Over"
              aria-label="Start Over"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative h-full">
        <AnimatePresence mode="wait">
          {phase === 'capture' && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <CapturePhase />
            </motion.div>
          )}
          {phase === 'assignment' && (
            <motion.div
              key="assignment"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <AssignmentPhase />
            </motion.div>
          )}
          {phase === 'settlement' && (
            <motion.div
              key="settlement"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <SettlementPhase />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Main />
    </AppProvider>
  );
}

export default App;
