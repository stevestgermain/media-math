import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, MoreVertical, Smartphone, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android-iframe' | 'android-direct' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Check if seen before
    const hasSeen = localStorage.getItem('mediaDrive_installPromptSeen');
    if (hasSeen) return;

    // 2. Check if mobile (width < 768px)
    if (window.innerWidth >= 768) return;

    // 3. Detect Environment
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
        // Direct Android visit: wait for beforeinstallprompt
        setPlatform('android-direct');
        // If event doesn't fire (already installed or not fully PWA compliant), 
        // we might choose to show nothing or a fallback. 
        // For now, we default to hidden until event fires.
      }
    }
  }, []);

  // Listen for the native install prompt event (Android Direct)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI notify the user they can install the PWA
      if (!localStorage.getItem('mediaDrive_installPromptSeen')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('mediaDrive_installPromptSeen', 'true');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      handleDismiss();
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 ring-1 ring-gray-900/5 p-4 relative overflow-hidden">
        
        {/* Dismiss Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex gap-4">
          <div className="shrink-0">
            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <Smartphone className="h-6 w-6" />
            </div>
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install App
            </h3>
            
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Add Media Drive to your home screen for instant, full-screen access.
            </p>

            {/* iOS Instructions */}
            {platform === 'ios' && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span>1. Tap</span>
                  <Share className="h-3.5 w-3.5 text-blue-500" />
                  <span>Share in menu bar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2. Select</span>
                  <PlusSquare className="h-3.5 w-3.5 text-gray-600" />
                  <span>Add to Home Screen</span>
                </div>
              </div>
            )}

            {/* Android Iframe Instructions */}
            {platform === 'android-iframe' && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span>1. Tap</span>
                  <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
                  <span>in browser menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2. Select</span>
                  <span className="font-medium">Install App</span>
                  <span>or</span>
                  <span className="font-medium">Add to Home</span>
                </div>
              </div>
            )}

            {/* Android Direct Button */}
            {platform === 'android-direct' && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full mt-1 flex justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Install Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};