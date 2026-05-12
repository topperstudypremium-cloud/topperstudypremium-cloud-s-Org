export type Screen = 
  | 's1' // Welcome/Splash
  | 's2' // Onboarding
  | 's3' // Select Class
  | 's4' // Select Subject
  | 's5' // PDF & Photos
  | 's6' // Home Dashboard
  | 's7' // Profile Settings
  | 's8' // Plan Selection
  | 's_neon' // Neon Paper Selection
  | 's_chat' // Chat
  | 's_help' // Help Center
  | 's_files' // File Manager
  | 's_notes' // AI Notes
  | 's_auth' // Login/Signup
  | 's_privacy' // Privacy Policy
  | 's_terms' // Terms of Service
  | 's_update_policy' // Update Policy
  | 's_takeover_policy' // Takeover Policy
  | 's_safe_chat' // Safe Friend Chat
  | 's_yt_summary' // YouTube Video Summarizer
  | 's_focus' // Stay Focused Productivity Mode
  | 's_whiteboard' // Collaborative Whiteboard
  | 's_analysis'; // Document Analysis Results

export interface CloudFile {
  name: string;
  size: number;
  type: string;
  date: string;
}

export interface PaperFile {
  name: string;
  type: string;
  subject: string;
}
