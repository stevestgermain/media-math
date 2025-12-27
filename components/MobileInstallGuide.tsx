import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, MoreVertical, X, Gauge } from 'lucide-react';

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
    <div className="mt-8 w-full bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-5 relative shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500 overflow-hidden">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-full transition-colors z-10"
        aria-label="Dismiss guide"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-5 items-center">
        {/* Visual: App Icon Preview */}
        <div className="shrink-0 flex flex-col items-center gap-2">
           <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center text-white ring-2 ring-white ring-offset-2 ring-offset-gray-50">
              <Gauge className="w-7 h-7" strokeWidth={2.5} />
           </div>
           <span className="text-[10px] font-medium text-gray-400">Preview</span>
        </div>

        {/* Content: Instructions */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            Pro-Tip
          </h3>
          <p className="text-sm font-bold text-gray-900 mb-2 leading-tight">
            Enable quick access from your mobile home screen
          </p>
          
          <div className="text-xs text-gray-600 leading-relaxed">
            <div className="flex flex-wrap items-center gap-1.5">
              <span>Tap</span>
              {platform === 'ios' ? (
                <span className="inline-flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 shadow-sm">
                  <Share className="w-3.5 h-3.5 text-blue-500" />
                </span>
              ) : (
                <span className="inline-flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 shadow-sm">
                  <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
                </span>
              )}
              <span>then select</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="font-semibold text-gray-800 whitespace-nowrap">"Add to Home Screen"</span>
              <span className="inline-flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 shadow-sm">
                <PlusSquare className="w-3.5 h-3.5 text-gray-500" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
