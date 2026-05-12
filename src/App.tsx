import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeScreen } from '@/src/components/WelcomeScreen';
import { OnboardingScreen } from '@/src/components/OnboardingScreen';
import { ClassSelection } from '@/src/components/ClassSelection';
import { SubjectSelection } from '@/src/components/SubjectSelection';
import { MediaUpload } from '@/src/components/MediaUpload';
import { Dashboard } from '@/src/components/Dashboard';
import { ProfileSettings } from '@/src/components/ProfileSettings';
import { PlanSelection } from '@/src/components/PlanSelection';
import { ChatRoom } from '@/src/components/ChatRoom';
import { HelpCenter } from '@/src/components/HelpCenter';
import { FileManager } from '@/src/components/FileManager';
import { DocumentAnalysis } from '@/src/components/DocumentAnalysis';
import { AINotes } from '@/src/components/AINotes';
import { Auth } from '@/src/components/Auth';
import { PolicyScreen } from '@/src/components/PolicyScreen';
import { SafeFriendZone } from '@/src/components/SafeFriendZone';
import { Whiteboard } from '@/src/components/Whiteboard';
import { YoutubeSummary } from '@/src/components/YoutubeSummary';
import { FocusMode } from '@/src/components/FocusMode';
import { Screen, CloudFile } from './types';
import { getSupabase } from './lib/supabase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('s1');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Splash screen timeout
  useEffect(() => {
    if (currentScreen === 's1') {
      const timer = setTimeout(() => {
        setCurrentScreen('s2');
      }, 1820);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigateTo = (screen: Screen) => {
    // Guest Mode Guard: Features involving AI or personal data require auth
    const authRequired = ['s_notes', 's_files', 's_chat', 's_safe_chat', 's_whiteboard'];
    if (authRequired.includes(screen) && !user) {
      setCurrentScreen('s_auth');
      return;
    }
    setCurrentScreen(screen);
  };

  useEffect(() => {
    (window as any).navigateTo = navigateTo;
  }, [user]);

  return (
    <div className="phone">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="screen screen-active"
        >
          {currentScreen === 's1' && <WelcomeScreen />}
          {currentScreen === 's2' && <OnboardingScreen onNext={() => navigateTo('s3')} onSkip={() => navigateTo('s3')} />}
          {currentScreen === 's3' && (
            <ClassSelection 
              selectedClass={selectedClass} 
              onSelect={setSelectedClass} 
              onNext={() => navigateTo('s4')} 
              onBack={() => navigateTo('s2')}
            />
          )}
          {currentScreen === 's4' && (
            <SubjectSelection 
              selectedSubjects={selectedSubjects}
              onToggle={(subj) => setSelectedSubjects(prev => prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj])}
              onNext={() => navigateTo('s5')}
              onBack={() => navigateTo('s3')}
            />
          )}
          {currentScreen === 's_5' || currentScreen === 's5' ? (
            <MediaUpload 
              onAnalyze={() => navigateTo('s_analysis')}
              onBack={() => navigateTo('s4')}
            />
          ) : null}
          {currentScreen === 's6' && (
            <Dashboard 
              onChat={() => navigateTo('s_chat')}
              onProfile={() => navigateTo('s7')}
            />
          )}
          {currentScreen === 's7' && (
            <ProfileSettings 
              onBack={() => navigateTo('s6')}
              onUpgrade={() => navigateTo('s8')}
              onHelp={() => navigateTo('s_help')}
              onNotes={() => navigateTo('s_notes')}
            />
          )}
          {currentScreen === 's8' && (
            <PlanSelection onBack={() => navigateTo('s7')} />
          )}
          {currentScreen === 's_chat' && (
            <ChatRoom onBack={() => navigateTo('s6')} />
          )}
          {currentScreen === 's_help' && (
            <HelpCenter 
              onBack={() => navigateTo('s7')} 
              onFiles={() => navigateTo('s_files')} 
            />
          )}
          {currentScreen === 's_files' && (
            <FileManager 
              onBack={() => navigateTo('s_help')} 
            />
          )}
          {currentScreen === 's_analysis' && (
            <DocumentAnalysis 
              onBack={() => navigateTo('s_files')} 
            />
          )}
          {currentScreen === 's_notes' && (
            <AINotes onBack={() => navigateTo('s7')} />
          )}
          {currentScreen === 's_auth' && (
            <Auth onBack={() => navigateTo('s1')} onSuccess={() => navigateTo('s6')} />
          )}
          {currentScreen === 's_privacy' && (
            <PolicyScreen 
              title="Privacy Policy" 
              lastUpdated="April 2026" 
              content={`Privacy Policy — ALLWIN AI 2\n\nWelcome to ALLWIN AI 2. Your privacy is important to us. This Privacy Policy explains how our app collects, uses, and protects your information when you use our AI-powered services. By using ALLWIN AI 2, you agree to the practices described in this Privacy Policy.\n\n1. Information We Collect: Account Information (Name, Email), Usage Information, AI Inputs & Generated Content, Payment Information.\n\n2. How We Use Your Information: Provide AI services, Improve performance, Personalize experience, Security.\n\n3. AI Generated Content: AI responses may contain inaccuracies.\n\n4. Data Protection: Secure servers, HTTPS.\n\n5. Contact Us: topperflowproai2@gmail.com`} 
              onBack={() => navigateTo('s7')} 
            />
          )}
          {currentScreen === 's_terms' && (
            <PolicyScreen 
              title="Terms of Service" 
              lastUpdated="April 2026" 
              content={`Terms of Service — ALLWIN AI 2\n\nWelcome to ALLWIN AI 2. These Terms of Service govern your access to and use of our application, website, and AI-powered services.\n\n1. Acceptance of Terms: By using ALLWIN AI 2, you confirm that you agree to these Terms.\n\n2. Description of Services: AI Chat, Image solver, YT Summary, Study Tools.\n\n3. Acceptable Use: No illegal activities, no abuse, no spam.\n\n4. Limitation of Liability: ALLWIN AI 2 is provided "as is" without warranties.`} 
              onBack={() => navigateTo('s7')} 
            />
          )}
          {currentScreen === 's_update_policy' && (
            <PolicyScreen 
              title="Version Update Policy" 
              lastUpdated="April 2026" 
              content={`Version Update Policy — ALLWIN AI 2\n\nThis Version Update Policy explains how updates, upgrades, and new versions of ALLWIN AI 2 are managed and delivered.\n\n1. Purpose: Improve performance, Add AI features, Fix bugs.\n\n2. Types: Minor improvements and Major system upgrades.\n\n3. Features: Availability may vary based on version and region.`} 
              onBack={() => navigateTo('s7')} 
            />
          )}
          {currentScreen === 's_takeover_policy' && (
            <PolicyScreen 
              title="User Takeover Policy" 
              lastUpdated="April 2026" 
              content={`User Takeover Policy — ALLWIN AI 2\n\nThis policy explains how we handle unauthorized access and account recovery.\n\n1. Detection: Monitoring logins and device verification.\n\n2. Response: Suspending compromised accounts immediately.\n\n3. Recovery: Verified proof of identity required to restore access.`} 
              onBack={() => navigateTo('s7')} 
            />
          )}
          {currentScreen === 's_safe_chat' && (
            <SafeFriendZone onBack={() => navigateTo('s7')} onWhiteboard={() => navigateTo('s_whiteboard')} />
          )}
          {currentScreen === 's_whiteboard' && (
            <Whiteboard onBack={() => navigateTo('s_safe_chat')} roomId={(window as any).currentFriendId || 'global'} />
          )}
          {currentScreen === 's_yt_summary' && (
            <YoutubeSummary onBack={() => navigateTo('s6')} />
          )}
          {currentScreen === 's_focus' && (
            <FocusMode onBack={() => navigateTo('s6')} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
