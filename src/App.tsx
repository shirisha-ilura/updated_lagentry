import { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
// ...existing code...
import { WelcomeScreen } from './components/WelcomeScreen';
import { BillingPage } from './components/BillingPage';
// ...existing code...
import { BuildView } from './components/BuildView';
import { ChatModal } from './components/ChatModal';
import { Dashboard } from './components/Dashboard';
import { Connections } from './components/Connections';
// ...existing code...

type ViewType = 'login' | 'welcome' | 'building' | 'dashboard' | 'connections' | 'billing';
// Use DashboardView type from Dashboard component
import type { DashboardView } from './components/Dashboard';


function App() {
  // Removed auth/login/signup state
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [dashboardView] = useState<DashboardView>('workflow-runs');
  // removed unused isBuilding
  // removed unused buildProgress
  // removed unused isAgentReady
  const [showChatModal, setShowChatModal] = useState(false);
  // removed unused userPrompt
  // Handler stubs to resolve reference errors
  const handleStartBuilding = () => {};
  const handleProgressUpdate = () => {};
  const handleBuildComplete = () => {};
  const handleDashboardViewChange = () => {};

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showGoogleMock, setShowGoogleMock] = useState(false);

  // Dark mode detection state and effect
  const [isDark, setIsDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (currentView === 'login' && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        if (showGoogleMock) {
          // Mock Google account chooser UI (heading and subheading left of account list)
          const handleAccountClick = () => {
            setShowGoogleMock(false);
            setCurrentView('welcome');
          };
          return (
            <div className="relative min-h-screen w-full bg-gray-100 flex flex-col justify-center items-center">
              <div className="bg-white rounded-2xl shadow-xl px-0 py-12 w-full max-w-5xl border border-gray-200 flex flex-col" style={{ minHeight: 600 }}>
                {/* Top: Google logo and Sign in with Google */}
                <div className="flex items-center px-10 pt-2 pb-2">
                  <img src="/images/logo.webp" alt="Google Logo" className="h-8 w-8 mr-3 rounded-md" />
                  <span className="text-base text-gray-700 font-normal">Sign in with Google</span>
                </div>
                <hr className="border-gray-200 mx-10 mb-2" />
                <div className="flex flex-row flex-1 w-full">
                  {/* Left: Heading, subheading */}
                  <div className="flex flex-col items-start justify-start w-[420px] pl-16 pt-8">
                    <img src="/images/lagentry-light-logo.png" alt="Lagentry Logo" className="h-12 mb-6" />
                    <h2 className="text-4xl font-semibold mb-2 text-left">Choose an account</h2>
                    <div className="text-gray-600 mb-8 text-lg text-left">to continue to <span className="text-blue-600 font-medium">Lagentry</span></div>
                  </div>
                  {/* Right: Account list only */}
                  <div className="flex flex-col flex-1 pr-16 pl-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200" onClick={handleAccountClick}>
                        <div className="bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold text-base">J</div>
                        <div>
                          <div className="font-medium text-gray-900 text-base">John</div>
                          <div className="text-sm text-gray-500">John123@gmail.com</div>
                        </div>
                      </div>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200" onClick={handleAccountClick}>
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Hazel" className="h-8 w-8 rounded-full mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 text-base">Jack</div>
                          <div className="text-sm text-gray-500">Jack123@gmail.com</div>
                        </div>
                      </div>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200" onClick={handleAccountClick}>
                        <div className="bg-black text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold text-base">Z</div>
                        <div>
                          <div className="font-medium text-gray-900 text-base">Zayn</div>
                          <div className="text-sm text-gray-500">Zayn123@gmail.com</div>
                        </div>
                      </div>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200" onClick={handleAccountClick}>
                        <div className="bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold text-base">H</div>
                        <div>
                          <div className="font-medium text-gray-900 text-base">Harry</div>
                          <div className="text-sm text-gray-500">Harry@gmail.com</div>
                        </div>
                      </div>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200" onClick={handleAccountClick}>
                        <div className="bg-gray-300 text-gray-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold text-base">+</div>
                        <div>
                          <div className="font-medium text-gray-900 text-base">Use another account</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-8">
                      Before using this app, you can review Lagentry's <a href="#" className="text-blue-600 underline">privacy policy</a> and <a href="#" className="text-blue-600 underline">Terms of Service</a>.
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer fixed at bottom of page */}
              <div className="fixed bottom-0 left-0 w-full flex items-center justify-between px-10 py-2 text-xs text-gray-500 border-t border-gray-200 bg-white z-50">
                <div>English (United Kingdom)</div>
                <div className="space-x-4">
                  <a href="#" className="hover:underline">Help</a>
                  <a href="#" className="hover:underline">Privacy</a>
                  <a href="#" className="hover:underline">Terms</a>
                </div>
              </div>
            </div>
          );
        }
        // Default login page (not Google chooser)
        return (
          <div className="flex flex-col md:flex-row min-h-screen w-full bg-white dark:bg-transparent">
            {/* Left: Animated text, logo, button, etc. */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-12">
              <img src={isDark ? "/images/lagentry-dark-logo-no-bg.png" : "/images/lagentry-light-logo.png"} alt="Lagentry Logo" className="h-16 mb-8" />
              <h1 className="text-5xl font-bold mb-4 text-center">Welcome to Lagentry</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">The fastest way to build, deploy, and manage your AI workflows.</p>
              <button
                className="flex items-center justify-center border border-gray-300 rounded-lg py-3 mb-3 text-lg font-medium shadow-sm transition opacity-0 animate-fadein dark:text-gray-900"
                style={{ background: '#f5f7fa', animationDelay: '0.2s', animationFillMode: 'forwards', width: 480, maxWidth: '100%' }}
                onClick={() => setShowGoogleMock(true)}
              >
                <img src="/images/logo.webp" alt="Google" className="h-6 w-6 mr-3" />
                Sign up with Google
              </button>
              <div className="text-xs text-gray-500 dark:text-gray-400 w-full text-center mb-5 opacity-0 animate-fadein" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                By signing up, you agree to Lagentry's{' '}
                <a href="#" className="underline text-blue-600">Privacy Policy</a> and{' '}
                <a href="#" className="underline text-blue-600">Terms of Service</a>.
              </div>
              <div className="w-full text-center mb-6 opacity-0 animate-fadein" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <a href="#" className="text-base text-black dark:text-white font-medium underline">I don't use Gmail</a>
              </div>
              <hr className="mb-6 opacity-0 animate-fadein" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', width: 480, maxWidth: '100%' }} />
              <div className="w-full text-center mb-2 opacity-0 animate-fadein" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                <span className="text-base text-black dark:text-white">Already have an account? </span>
                <a href="#" className="text-base text-black dark:text-white font-medium underline">Log in</a>
              </div>
            </div>
            {/* Right: Video */}
            <div className="w-full md:w-1/2 flex justify-center items-center h-full p-0 m-0 bg-white dark:bg-transparent" style={{ minHeight: 400, background: isDark ? 'transparent' : undefined }}>
              <div className="flex justify-center items-center w-full h-full p-6">
                <video
                  ref={videoRef}
                  src={isDark ? "/videos/Screen Recording 2025-08-29 143054.mp4" : "/videos/Screen Recording 2025-08-27 145235.mp4"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  className="no-video-controls"
                  style={{
                    objectFit: 'contain',
                    width: 'calc(100vw - 60px)',
                    height: 'calc(100vh - 60px)',
                    maxWidth: '100%',
                    maxHeight: '95vh',
                    display: 'block',
                    margin: 'auto',
                    borderRadius: '18px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        );
      // ...other cases unchanged...
      case 'welcome':
        return <WelcomeScreen onStartBuilding={handleStartBuilding} />;
      case 'building':
        return (
          <BuildView
            userPrompt=""
            isBuilding={false}
            buildProgress={0}
            isAgentReady={false}
            onProgressUpdate={handleProgressUpdate}
            onBuildComplete={handleBuildComplete}
            onOpenChat={() => setShowChatModal(true)}
          />
        );
      case 'dashboard':
        return <Dashboard currentView={dashboardView} onDashboardViewChange={handleDashboardViewChange} />;
      case 'connections':
        return <Connections />;
      case 'billing':
        return <BillingPage />;
      default:
        break;
    }
    return null;
  };


  // Set body background for dark mode gradient only on starting page
  useEffect(() => {
    if (currentView === 'login' && !showGoogleMock && isDark) {
      document.body.style.background = 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)';
    } else {
      document.body.style.background = '';
    }
    return () => {
      document.body.style.background = '';
    };
  }, [currentView, showGoogleMock, isDark]);

  return (
    <ThemeProvider>
      <div className="min-h-screen text-gray-900 dark:text-white transition-colors duration-300" style={isDark ? { background: 'none' } : { background: '#fff' }}>
        {/* Only show Header (with navigation) if not on login page */}
        {currentView !== 'login' && (
          <Header 
            currentView={currentView} 
            onNavigate={() => {}}
            dashboardView={dashboardView}
            onDashboardViewChange={() => {}}
            onBillingClick={() => setCurrentView('billing')}
          />
        )}
        {renderCurrentView()}
        <ChatModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} agentName="Lagentry" />
      </div>
    </ThemeProvider>
  );
}
export default App;