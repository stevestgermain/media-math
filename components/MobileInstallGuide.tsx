import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, MoreVertical, X, Smartphone } from 'lucide-react';

export const MobileInstallGuide: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // 1. Check if already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      return;
    }

    // 2. Check if user previously dismissed this guide
    const isDismissed = localStorage.getItem('mediaDrive_installGuideDismissed');
    if (isDismissed) {
      return;
    }

    // 3. Detect Platform
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    // Only show on mobile devices
    const isMobileWidth = window.innerWidth < 768;

    if (isMobileWidth) {
      if (isIOS) {
        setPlatform('ios');
        setIsVisible(true);
      } else if (isAndroid) {
        setPlatform('android');
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('mediaDrive_installGuideDismissed', 'true');
  };

  if (!isVisible || platform === 'other') return null;

  return (
    <div className="mt-6 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 p-4 relative animate-in slide-in-from-bottom-4 fade-in duration-500">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
        aria-label="Dismiss guide"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex flex-col gap-2 pr-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
            Pro Tip: Save App for Quick Access
          </span>
        </div>
        
        <div className="text-xs text-gray-600 leading-relaxed flex flex-wrap items-center gap-1">
          {platform === 'ios' ? (
            <>
              <span>Tap</span>
              <span className="inline-flex items-center justify-center bg-white border border-gray-200 rounded px-1 py-0.5 mx-0.5 shadow-sm">
                <Share className="w-3 h-3 text-blue-500" />
              </span>
              <span>Share, then select</span>
              <span className="font-medium text-gray-900 whitespace-nowrap">"Add to Home Screen"</span>
              <span className="inline-flex items-center justify-center bg-white border border-gray-200 rounded px-1 py-0.5 mx-0.5 shadow-sm">
                <PlusSquare className="w-3 h-3 text-gray-500" />
              </span>
            </>
          ) : (
            <>
              <span>Tap</span>
              <span className="inline-flex items-center justify-center bg-white border border-gray-200 rounded px-1 py-0.5 mx-0.5 shadow-sm">
                <MoreVertical className="w-3 h-3 text-gray-600" />
              </span>
              <span>Menu, then select</span>
              <span className="font-medium text-gray-900 whitespace-nowrap">"Add to Home Screen"</span>
              <span className="inline-flex items-center justify-center bg-white border border-gray-200 rounded px-1 py-0.5 mx-0.5 shadow-sm">
                <PlusSquare className="w-3 h-3 text-gray-500" />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
