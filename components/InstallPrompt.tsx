import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, MoreVertical, Smartphone, Download, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  trigger: boolean;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ trigger }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android-iframe' | 'android-direct' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // 1. Listen for Android native install event immediately (in case it fires early)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // 2. Determine visibility when 'trigger' becomes true (User clicked Solve)
  useEffect(() => {
    if (!trigger) return;

    // Check if seen before
    const hasSeen = localStorage.getItem('mediaDrive_installPromptSeen');
    if (hasSeen) return;

    // Check if mobile (width < 768px)
    if (window.innerWidth >= 768) return;

    // Detect Environment
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isIframe = window.self !== window.top;

    if (isIOS) {
      setPlatform('ios');
      setIsVisible(true);
    } else if (isAndroid) {
      if (isIframe) {
        setPlatform('android-iframe');
        setIsVisible(true);
      } else {
        // Direct Android visit
        setPlatform('android-direct');
        // We show the modal if we have a deferred prompt OR just as instructions if not
        setIsVisible(true);
      }
    }
  }, [trigger]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('mediaDrive_installPromptSeen', 'true');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      handleDismiss();
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/75 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={handleDismiss}
        aria-hidden="true" 
      />

      {/* Modal Panel */}
      <div className="relative inline-block align-bottom bg-white dark:bg-zinc-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full max-w-sm animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pt-8 pb-6">
          <div className="flex flex-col items-center text-center">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 mb-5">
              <Smartphone className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Install Media Drive
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              Get the best experience. Add this tool to your home screen for instant, full-screen access.
            </p>

            {/* Instructions Box */}
            <div className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 p-4 text-left">
              
              {/* iOS Instructions */}
              {platform === 'ios' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center justify-center h-6 w-6 rounded bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 shadow-sm shrink-0">
                      <Share className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <span>Tap <strong>Share</strong> in menu bar</span>
                  </div>
                  <div className="w-full h-px bg-gray-200/60 dark:bg-zinc-700" />
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                     <div className="flex items-center justify-center h-6 w-6 rounded bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 shadow-sm shrink-0">
                      <PlusSquare className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span>Select <strong>Add to Home Screen</strong></span>
                  </div>
                </div>
              )}

              {/* Android Iframe Instructions */}
              {platform === 'android-iframe' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                     <div className="flex items-center justify-center h-6 w-6 rounded bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 shadow-sm shrink-0">
                      <MoreVertical className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span>Tap <strong>Menu</strong> (3 dots)</span>
                  </div>
                  <div className="w-full h-px bg-gray-200/60 dark:bg-zinc-700" />
                   <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center justify-center h-6 w-6 rounded bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 shadow-sm shrink-0">
                      <Download className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span>Select <strong>Install App</strong></span>
                  </div>
                </div>
              )}

              {/* Android Direct Button */}
              {platform === 'android-direct' && (
                <div>
                   {deferredPrompt ? (
                    <button
                      onClick={handleInstallClick}
                      className="w-full flex justify-center items-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Install App Now
                    </button>
                   ) : (
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-center justify-center h-6 w-6 rounded bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 shadow-sm shrink-0">
                            <MoreVertical className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span>Tap <strong>Menu</strong> (3 dots)</span>
                        </div>
                        <div className="w-full h-px bg-gray-200/60 dark:bg-zinc-700" />
                        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-center justify-center h-6 w-6 rounded bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 shadow-sm shrink-0">
                            <Download className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span>Select <strong>Add to Home Screen</strong></span>
                        </div>
                      </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50/50 dark:bg-zinc-800/50 px-6 py-4 flex justify-center border-t border-gray-100 dark:border-zinc-800">
          <button
            type="button"
            className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            onClick={handleDismiss}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};;
