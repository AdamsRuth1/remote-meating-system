import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Video,
  Calendar,
  Info,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Plus,
  Play,
  Users,
  Mail,
  ChevronUp,
  X,
  CheckCircle2,
  Clock,
  Radio,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Share2,
  Hand,
  Maximize2,
  Minimize2,
  Send,
  Lock,
  Copy,
  Check,
  Trash2
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  dayNum: string;
  dayName: string;
  month: string;
  host: string;
  status: 'upcoming' | 'past';
  code: string;
  category: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'meetings' | 'schedule' | 'about' | 'help'>('home');
  const [scheduleFilter, setScheduleFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  
  // Clean state: loaded from localStorage or initially empty (no demo data)
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = localStorage.getItem('rams_meetings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist user-created meetings
  useEffect(() => {
    try {
      localStorage.setItem('rams_meetings', JSON.stringify(meetings));
    } catch {
      // Ignore storage errors
    }
  }, [meetings]);

  // In-app Video Meeting Room State
  const [inActiveMeeting, setInActiveMeeting] = useState(false);
  const [currentMeetingRoom, setCurrentMeetingRoom] = useState<{ id: string; title: string; code: string }>({
    id: '',
    title: '',
    code: '',
  });

  // Call Controls
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // In-meeting Chat (Plain & clean, start empty)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');

  // Local WebCam Video Stream
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Modals & form states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [meetingsPageCode, setMeetingsPageCode] = useState('');
  
  // New Meeting Form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('10:00 AM - 11:00 AM');
  const [newHost, setNewHost] = useState('My Unit');

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Launch in-app live meeting
  const launchInAppMeeting = (title: string, code?: string) => {
    const roomCode = code || ('RAMS-' + Math.floor(1000 + Math.random() * 9000));
    setCurrentMeetingRoom({
      id: 'room-' + Date.now(),
      title: title || 'Tactical Meeting',
      code: roomCode,
    });
    setChatMessages([]);
    setInActiveMeeting(true);
  };

  // WebRTC User Media
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (inActiveMeeting && cameraEnabled) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: micEnabled })
        .then((s) => {
          stream = s;
          localStreamRef.current = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          console.log('Camera/Mic permission not available or denied.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [inActiveMeeting, cameraEnabled]);

  // Screen Share Toggle
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
        };
      } catch {
        setIsScreenSharing(false);
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    }
  };

  const toggleCamera = () => {
    if (cameraEnabled && localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => track.stop());
    }
    setCameraEnabled(!cameraEnabled);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !micEnabled;
      });
    }
    setMicEnabled(!micEnabled);
  };

  const leaveMeeting = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);
    setInActiveMeeting(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: 'msg-' + Date.now(),
        sender: 'You',
        text: messageInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMessageInput('');
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedDate = new Date(newDate);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const dayName = !isNaN(parsedDate.getTime()) ? dayNames[parsedDate.getDay()] : 'MON';
    const month = !isNaN(parsedDate.getTime()) ? monthNames[parsedDate.getMonth()] : 'NOV';
    const dayNum = !isNaN(parsedDate.getTime()) ? String(parsedDate.getDate()).padStart(2, '0') : '01';

    const code = 'RAMS-' + Math.floor(1000 + Math.random() * 9000);
    const newMeeting: Meeting = {
      id: 'm-' + Date.now(),
      title: newTitle.trim(),
      dateStr: newDate,
      timeStr: newTime.trim() || '10:00 AM - 11:00 AM',
      dayNum,
      dayName,
      month,
      host: newHost.trim() || 'Host',
      status: 'upcoming',
      code: code,
      category: 'General',
    };

    setMeetings([newMeeting, ...meetings]);
    setShowNewMeetingModal(false);
    setNewTitle('');
    setActiveTab('schedule');
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const filteredMeetings = meetings.filter((m) => {
    if (scheduleFilter === 'upcoming') return m.status === 'upcoming';
    if (scheduleFilter === 'past') return m.status === 'past';
    return true;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#050906] text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Subtle Topo Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `radial-gradient(circle at 75% 25%, rgba(34, 197, 94, 0.25) 0%, transparent 55%),
                              radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.15) 0%, transparent 45%),
                              repeating-radial-gradient(circle at 60% 40%, transparent 0, transparent 45px, rgba(34, 197, 94, 0.04) 46px, transparent 48px)`,
          }}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-[#050906]/75 to-[#050906]" />
      </div>

      {/* ========================================================================= */}
      {/* CLEAN IN-APP LIVE MEETING ROOM (ONLY YOU + LIVE ROOM PARTICIPANTS)       */}
      {/* ========================================================================= */}
      {inActiveMeeting ? (
        <div className="relative z-20 flex flex-col h-screen w-screen bg-[#040805] text-white">
          
          {/* Meeting Room Top Bar */}
          <header className="h-14 border-b border-[#122818] bg-[#071109] px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-[11px] text-yellow-400 font-black">
                  NA
                </div>
                <div>
                  <h1 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
                    <span>{currentMeetingRoom.title}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Encrypted</span>
                    </span>
                  </h1>
                  <span className="text-[10px] text-zinc-400 font-mono">CODE: {currentMeetingRoom.code}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentMeetingRoom.code);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="flex items-center space-x-1.5 bg-[#0e2415] hover:bg-[#14331e] border border-emerald-700/50 text-emerald-300 text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>

              <div className="flex items-center space-x-1 bg-[#09170e] border border-emerald-900 px-2.5 py-1 rounded-full text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>
          </header>

          {/* Meeting Stage Area (Clean: Local Stream + Screen Share if active) */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-3 sm:p-5 flex flex-col justify-center items-center overflow-y-auto">
              
              {isScreenSharing ? (
                /* Screen sharing active: 2 tiles side-by-side or stacked */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full max-h-[820px] max-w-6xl">
                  {/* Screen Share Tile */}
                  <div className="lg:col-span-2 relative rounded-2xl bg-[#09150d] border border-blue-500/50 overflow-hidden flex items-center justify-center shadow-xl">
                    <video
                      ref={screenShareVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-3 left-3 bg-blue-900/80 text-white text-xs px-3 py-1 rounded-lg">
                      Your Shared Screen
                    </div>
                  </div>

                  {/* Your Camera Feed Tile */}
                  <div className="relative rounded-2xl bg-[#09150d] border border-emerald-800/40 overflow-hidden flex flex-col items-center justify-center shadow-xl">
                    {cameraEnabled ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-xl font-bold text-white">
                          YOU
                        </div>
                        <span className="mt-2 text-xs text-zinc-400 font-mono">Camera Off</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-lg text-xs font-semibold">
                      <span>You (Host)</span>
                      {!micEnabled && <MicOff className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                  </div>
                </div>
              ) : (
                /* Solo / Primary Meeting Stage: Clean, focused view */
                <div className="relative w-full h-full max-h-[720px] max-w-4xl rounded-2xl bg-[#08120b] border border-emerald-800/40 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                  {cameraEnabled ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-24 h-24 rounded-full bg-[#0a1e11] border-2 border-emerald-400 flex items-center justify-center text-2xl font-black text-emerald-400 shadow-xl">
                        YOU
                      </div>
                      <span className="text-sm font-bold text-zinc-300">You are in the meeting room</span>
                      <span className="text-xs text-zinc-500 font-mono">Turn on your camera or invite members via code</span>
                    </div>
                  )}

                  {/* Clean Bottom Overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-semibold">
                    <span>You (Host)</span>
                    {!micEnabled && <MicOff className="w-3.5 h-3.5 text-red-400" />}
                  </div>

                  {handRaised && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg">
                      <Hand className="w-3.5 h-3.5" />
                      <span>Hand Raised</span>
                    </div>
                  )}

                  {/* Room code banner inside video stage for easy sharing */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl border border-emerald-900/60 text-xs text-zinc-300 flex items-center space-x-2">
                    <span className="text-emerald-400 font-mono font-bold">Code: {currentMeetingRoom.code}</span>
                  </div>
                </div>
              )}

            </div>

            {/* In-Meeting Chat Drawer */}
            {showChat && (
              <aside className="w-80 border-l border-[#122818] bg-[#071109] flex flex-col justify-between p-4 shrink-0 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-white">In-Call Messages</span>
                  </div>
                  <button onClick={() => setShowChat(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No messages yet.<br />Send a message below.
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className="p-2.5 rounded-xl bg-[#09170e] border border-emerald-900/40 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-emerald-400">{msg.sender}</span>
                          <span className="text-zinc-500">{msg.time}</span>
                        </div>
                        <p className="text-zinc-200">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="pt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-[#050c07] border border-emerald-900 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </aside>
            )}

            {/* In-Meeting Personnel Drawer */}
            {showParticipantsList && (
              <aside className="w-80 border-l border-[#122818] bg-[#071109] flex flex-col justify-between p-4 shrink-0 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-white">Personnel (1)</span>
                  </div>
                  <button onClick={() => setShowParticipantsList(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 py-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#09170e] border border-emerald-900/40">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white">
                        YOU
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">You (Host)</div>
                        <div className="text-[10px] text-zinc-400">Current Session</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 text-zinc-400">
                      {micEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentMeetingRoom.code);
                    alert(`Meeting Room Code copied: ${currentMeetingRoom.code}`);
                  }}
                  className="w-full py-2 bg-[#0d2214] hover:bg-[#122e1b] border border-emerald-700/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code to Invite</span>
                </button>
              </aside>
            )}
          </div>

          {/* Meeting Control Footer */}
          <footer className="h-20 border-t border-[#122818] bg-[#071109] px-4 flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-3 text-xs text-zinc-400">
              <span className="font-mono text-emerald-400">STATUS: SECURE ENCLAVE</span>
            </div>

            {/* Call Action Deck */}
            <div className="flex items-center space-x-2 sm:space-x-3 mx-auto md:mx-0">
              <button
                onClick={toggleMic}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  micEnabled 
                    ? 'bg-[#102416] border-emerald-700/60 text-emerald-300 hover:bg-[#16331f]' 
                    : 'bg-red-950 border-red-600 text-red-400'
                }`}
                title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  cameraEnabled 
                    ? 'bg-[#102416] border-emerald-700/60 text-emerald-300 hover:bg-[#16331f]' 
                    : 'bg-red-950 border-red-600 text-red-400'
                }`}
                title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-blue-900 border-blue-500 text-white'
                    : 'bg-[#102416] border-emerald-700/60 text-zinc-300 hover:bg-[#16331f]'
                }`}
                title="Share Screen"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  handRaised
                    ? 'bg-yellow-500 text-black border-yellow-400'
                    : 'bg-[#102416] border-emerald-700/60 text-zinc-300 hover:bg-[#16331f]'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setShowChat(!showChat);
                  if (showParticipantsList) setShowParticipantsList(false);
                }}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  showChat
                    ? 'bg-emerald-500 text-black border-emerald-400'
                    : 'bg-[#102416] border-emerald-700/60 text-zinc-300 hover:bg-[#16331f]'
                }`}
                title="Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setShowParticipantsList(!showParticipantsList);
                  if (showChat) setShowChat(false);
                }}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  showParticipantsList
                    ? 'bg-emerald-500 text-black border-emerald-400'
                    : 'bg-[#102416] border-emerald-700/60 text-zinc-300 hover:bg-[#16331f]'
                }`}
                title="Personnel"
              >
                <Users className="w-5 h-5" />
              </button>

              <button
                onClick={leaveMeeting}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold px-5 py-3 rounded-full transition-all shadow-lg shadow-red-900/40 cursor-pointer"
                title="Leave Meeting"
              >
                <PhoneOff className="w-5 h-5" />
                <span className="hidden sm:inline text-xs">End Meeting</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 rounded-xl bg-[#102416] border border-emerald-800/40 text-zinc-400 hover:text-white cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </footer>
        </div>
      ) : (

        /* ========================================================================= */
        /* STANDARD PORTAL SHELL (HOME, MEETINGS, SCHEDULE, ABOUT, HELP)             */
        /* ========================================================================= */
        <div className="relative z-10 flex flex-1 flex-col lg:flex-row min-h-screen">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-60 xl:w-64 border-r border-[#102315] bg-[#071109]/95 backdrop-blur-md flex flex-col justify-between p-5 shrink-0">
            <div>
              {/* Crest Header */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-[#102315]">
                <div className="relative w-14 h-16 bg-[#0a160d] border border-yellow-500/40 rounded-sm flex flex-col items-center justify-center p-1.5 shadow-xl shadow-black/80 mb-2">
                  <div className="w-3.5 h-2 bg-red-600 rounded-t-xs" />
                  <div className="my-0.5 text-yellow-400">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-yellow-400">
                      <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 2.18l6 3v4.82c0 4.39-3.04 8.52-6 9.77-2.96-1.25-6-5.38-6-9.77V7.18l6-3z"/>
                      <path d="M12 6.5l1.6 3.3 3.6.5-2.6 2.6.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.6 3.6-.5z" />
                    </svg>
                  </div>
                  <div className="text-[7.5px] text-yellow-400 font-black tracking-widest uppercase">NIGERIAN</div>
                </div>
                <h2 className="text-xs font-black tracking-widest uppercase text-zinc-100">NIGERIAN</h2>
                <h2 className="text-xs font-black tracking-widest uppercase text-emerald-400">ARMY</h2>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1.5">
                {[
                  { id: 'home', label: 'Home', icon: Home },
                  { id: 'meetings', label: 'Meetings', icon: Video },
                  { id: 'schedule', label: 'Schedule', icon: Calendar },
                  { id: 'about', label: 'About', icon: Info },
                  { id: 'help', label: 'Help', icon: HelpCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#12311b]/80 border-l-4 border-emerald-400 text-white shadow-md shadow-emerald-950/50'
                          : 'text-zinc-400 hover:text-white hover:bg-emerald-950/30'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout */}
            <div className="pt-4 border-t border-[#102315]">
              <button
                onClick={() => alert('Session logged out.')}
                className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-zinc-400 hover:text-red-400" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* VIEWPORT */}
          <div className="flex-1 flex flex-col justify-between">
            
            {/* Header */}
            <header className="px-6 py-4 border-b border-[#0f2113] bg-[#071109]/90 backdrop-blur flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white">RAMS</span>
                  <span className="text-emerald-500 font-light text-sm hidden sm:inline">|</span>
                  <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Remote Army Meeting System</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-normal sm:hidden">Remote Army Meeting System</p>
              </div>

              {/* Status and Profile Pill */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full bg-[#0a170e] border border-emerald-900/50 text-zinc-400 hover:text-emerald-400 transition-colors relative cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#0a160d] border border-emerald-700/40 rounded-xl p-3 shadow-2xl z-50">
                      <div className="text-xs font-bold text-white mb-2 pb-1 border-b border-emerald-900/40">Comms Alerts</div>
                      <div className="p-3 text-center text-xs text-zinc-500">
                        No active alerts.
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2.5 bg-[#0a170e] hover:bg-[#0f2516] border border-emerald-800/40 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-700/60 border border-emerald-400 overflow-hidden flex items-center justify-center text-[10px] font-bold text-white">
                      NA
                    </div>
                    <div className="text-left text-xs leading-none">
                      <span className="font-bold text-white block">OPERATOR</span>
                      <span className="text-[10px] text-emerald-400 flex items-center space-x-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Online</span>
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0a160d] border border-emerald-700/40 rounded-xl p-2 shadow-2xl z-50 text-xs">
                      <button onClick={() => { setActiveTab('about'); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 text-zinc-300 hover:text-white hover:bg-emerald-900/20 rounded cursor-pointer">About RAMS</button>
                      <button onClick={() => { setActiveTab('help'); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 text-zinc-300 hover:text-white hover:bg-emerald-900/20 rounded cursor-pointer">Help & Support</button>
                      <div className="border-t border-emerald-900/40 my-1" />
                      <button onClick={() => alert('Logged out.')} className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-red-950/20 rounded cursor-pointer">Disconnect</button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* TAB CONTENTS */}
            <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-7xl w-full mx-auto flex flex-col justify-center">
              
              {/* ---------------- 1. HOME TAB ---------------- */}
              {activeTab === 'home' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="relative rounded-3xl p-6 sm:p-10 border border-emerald-800/30 bg-gradient-to-r from-[#07130a]/90 via-[#0a1e10]/70 to-[#07130a]/40 overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl space-y-4">
                      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">RAMS</h1>
                      <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">Remote Army Meeting System</h2>
                      
                      <p className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-300/80">
                        Connect &bull; Collaborate &bull; Achieve
                      </p>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                        A secure in-app meeting portal for hosting and joining encrypted virtual meetings directly on this platform.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-3">
                        <button
                          onClick={() => launchInAppMeeting('Tactical Meeting')}
                          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <Video className="w-4 h-4 fill-current" />
                          <span>Start a Meeting</span>
                        </button>

                        <button
                          onClick={() => setShowJoinModal(true)}
                          className="flex items-center space-x-2 bg-[#09160d] hover:bg-[#0f2717] active:scale-95 text-zinc-200 border border-emerald-700/50 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-emerald-400" />
                          <span>Join with Code</span>
                        </button>
                      </div>

                      <div className="pt-2 text-[11px] text-zinc-500 italic">
                        NIGERIAN ARMY &bull; STRONGER TOGETHER
                      </div>
                    </div>
                  </div>

                  {/* 4 Bottom Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div 
                      onClick={() => launchInAppMeeting('Quick Session')}
                      className="p-5 rounded-2xl bg-[#08140b]/80 border border-emerald-800/30 hover:border-emerald-500/50 hover:bg-[#0c1f12] transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                        <Video className="w-5 h-5 fill-current" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Quick Meetings</h3>
                      <p className="text-xs text-zinc-400 mt-1">Start instantly on web</p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('schedule')}
                      className="p-5 rounded-2xl bg-[#08140b]/80 border border-emerald-800/30 hover:border-emerald-500/50 hover:bg-[#0c1f12] transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Scheduled Events</h3>
                      <p className="text-xs text-zinc-400 mt-1">View your agenda</p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('about')}
                      className="p-5 rounded-2xl bg-[#08140b]/80 border border-emerald-800/30 hover:border-emerald-500/50 hover:bg-[#0c1f12] transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Secure Access</h3>
                      <p className="text-xs text-zinc-400 mt-1">Army-grade security</p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('help')}
                      className="p-5 rounded-2xl bg-[#08140b]/80 border border-emerald-800/30 hover:border-emerald-500/50 hover:bg-[#0c1f12] transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                        <Headphones className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-white">24/7 Support</h3>
                      <p className="text-xs text-zinc-400 mt-1">Help & documentation</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 2. MEETINGS TAB ---------------- */}
              {activeTab === 'meetings' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <Video className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">Meetings</h2>
                        <p className="text-xs text-zinc-400">Launch and join web meeting sessions</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowNewMeetingModal(true)}
                      className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ New Meeting</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-6 rounded-2xl bg-[#08140b]/90 border border-emerald-800/30 flex flex-col justify-between shadow-xl">
                      <div>
                        <h3 className="text-base font-bold text-white">Start a New Meeting</h3>
                        <p className="text-xs text-zinc-400 mt-1">Begin an in-browser meeting instantly.</p>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => launchInAppMeeting('Live Session')}
                          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-md cursor-pointer"
                        >
                          <Video className="w-4 h-4 fill-current" />
                          <span>Start Meeting</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#08140b]/90 border border-emerald-800/30 flex flex-col justify-between shadow-xl">
                      <div>
                        <h3 className="text-base font-bold text-white">Join a Meeting</h3>
                        <p className="text-xs text-zinc-400 mt-1">Enter a meeting code to join.</p>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (meetingsPageCode.trim()) {
                            launchInAppMeeting(`Room: ${meetingsPageCode}`, meetingsPageCode);
                            setMeetingsPageCode('');
                          }
                        }}
                        className="pt-4 flex items-center space-x-2"
                      >
                        <input
                          type="text"
                          placeholder="Enter meeting code..."
                          value={meetingsPageCode}
                          onChange={(e) => setMeetingsPageCode(e.target.value)}
                          className="flex-1 bg-[#050c07] border border-emerald-900/60 focus:border-emerald-500 px-3.5 py-2 rounded-xl text-xs text-white placeholder-zinc-500 outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!meetingsPageCode.trim()}
                          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                        >
                          Join
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Meetings List */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white">Your Meetings ({meetings.length})</h3>
                      {meetings.length > 0 && (
                        <button 
                          onClick={() => setActiveTab('schedule')}
                          className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Manage All</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {meetings.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-emerald-900/40 rounded-2xl bg-[#071109]/50">
                        <Calendar className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                        <h4 className="text-xs font-bold text-zinc-300">No scheduled meetings</h4>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Click "+ New Meeting" above to create your first session.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {meetings.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-xl bg-[#08140b]/70 border border-emerald-900/30 hover:border-emerald-700/50 flex items-center justify-between transition-all"
                          >
                            <div className="flex items-center space-x-3.5">
                              <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/40 rounded-xl text-emerald-400">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                <p className="text-xs text-zinc-400">
                                  {item.dateStr} &bull; {item.timeStr}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => launchInAppMeeting(item.title, item.code)}
                              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Join</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ---------------- 3. SCHEDULE TAB ---------------- */}
              {activeTab === 'schedule' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">Schedule</h2>
                        <p className="text-xs text-zinc-400">View and manage your meeting schedule</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowNewMeetingModal(true)}
                      className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Schedule Meeting</span>
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center space-x-2 bg-[#061008] border border-emerald-950 p-1 rounded-xl w-fit">
                    <button
                      onClick={() => setScheduleFilter('upcoming')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        scheduleFilter === 'upcoming'
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Upcoming ({meetings.filter((m) => m.status === 'upcoming').length})
                    </button>
                    <button
                      onClick={() => setScheduleFilter('past')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        scheduleFilter === 'past'
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Past
                    </button>
                    <button
                      onClick={() => setScheduleFilter('all')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        scheduleFilter === 'all'
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      All ({meetings.length})
                    </button>
                  </div>

                  {/* Clean List */}
                  <div className="space-y-3.5">
                    {filteredMeetings.length === 0 ? (
                      <div className="p-10 text-center border border-dashed border-emerald-900/40 rounded-2xl bg-[#071109]/50">
                        <Calendar className="w-9 h-9 text-emerald-500/30 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-zinc-300">No scheduled meetings</h4>
                        <p className="text-xs text-zinc-500 mt-1">
                          You haven't scheduled any meetings yet.
                        </p>
                        <button
                          onClick={() => setShowNewMeetingModal(true)}
                          className="mt-4 bg-[#0d2415] hover:bg-[#13351f] border border-emerald-700/50 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Create Schedule
                        </button>
                      </div>
                    ) : (
                      filteredMeetings.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 rounded-2xl bg-[#08140b]/80 border border-emerald-900/30 hover:border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#050d07] border border-emerald-800/40 text-center shrink-0">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase">{item.dayName}</span>
                              <span className="text-lg font-black text-white leading-none my-0.5">{item.dayNum}</span>
                              <span className="text-[9px] font-bold text-emerald-400 uppercase">{item.month}</span>
                            </div>

                            <div>
                              <h4 className="text-base font-bold text-white">{item.title}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                                <span className="flex items-center space-x-1 text-emerald-300">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{item.timeStr}</span>
                                </span>
                                <span>&bull;</span>
                                <span>Host: <strong className="text-zinc-300">{item.host}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 self-end sm:self-center">
                            <button
                              onClick={() => launchInAppMeeting(item.title, item.code)}
                              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Join</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(item.id)}
                              className="p-2 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 hover:bg-red-900/40 transition-all cursor-pointer"
                              title="Delete meeting"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 bg-[#08140b] border border-emerald-900/40 rounded-xl flex items-center space-x-2 text-xs text-zinc-400">
                    <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All times in Nigerian Time (WAT)</span>
                  </div>
                </div>
              )}

              {/* ---------------- 4. ABOUT TAB ---------------- */}
              {activeTab === 'about' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">About</h2>
                      <p className="text-xs text-zinc-400">Learn more about RAMS</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 rounded-3xl bg-[#08140b]/90 border border-emerald-800/30 shadow-2xl space-y-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                      <div className="w-20 h-24 bg-[#050e07] border border-yellow-500/40 rounded-xl flex flex-col items-center justify-center p-2 shadow-xl shrink-0">
                        <div className="w-4 h-2.5 bg-red-600 rounded-t-xs" />
                        <div className="text-yellow-400 my-1">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-yellow-400">
                            <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 2.18l6 3v4.82c0 4.39-3.04 8.52-6 9.77-2.96-1.25-6-5.38-6-9.77V7.18l6-3z"/>
                            <path d="M12 6.5l1.6 3.3 3.6.5-2.6 2.6.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.6 3.6-.5z" />
                          </svg>
                        </div>
                        <span className="text-[8px] font-bold text-yellow-400">N.A.</span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-3xl font-black text-white">RAMS</h3>
                        <h4 className="text-base font-bold text-emerald-400">Remote Army Meeting System</h4>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                          RAMS is a secure communication platform providing real-time in-app video conferencing, screen sharing, and messaging for defense and military operations.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-emerald-900/30">
                      <div className="p-5 rounded-2xl bg-[#050d07] border border-emerald-900/40 space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                          <Radio className="w-4 h-4" />
                          <span>Our Mission</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          To deliver operational readiness and unified command communications through self-contained digital meeting infrastructure.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#050d07] border border-emerald-900/40 space-y-2">
                        <span className="text-emerald-400 font-bold text-sm block">Key Features</span>
                        <ul className="space-y-2 text-xs text-zinc-300">
                          <li className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>100% In-Browser Audio & Video</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Encrypted In-Meeting Text Messaging</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Screen Sharing & Hand Raising</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Zero Third-Party Dependency</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 5. HELP TAB ---------------- */}
              {activeTab === 'help' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Help</h2>
                      <p className="text-xs text-zinc-400">Get help and find answers</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Quick Help</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {[
                        { title: 'Getting Started', icon: Play, action: () => launchInAppMeeting('Test Meeting') },
                        { title: 'Joining a Meeting', icon: Users, action: () => setShowJoinModal(true) },
                        { title: 'Scheduling Meetings', icon: Calendar, action: () => setActiveTab('schedule') },
                        { title: 'Troubleshooting', icon: Headphones, action: () => alert('Ensure microphone and camera permissions are allowed in your browser.') },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            onClick={item.action}
                            className="p-4 rounded-2xl bg-[#08140b]/80 border border-emerald-900/30 hover:border-emerald-500/50 hover:bg-[#0c1f12] text-center flex flex-col items-center justify-center space-y-2.5 cursor-pointer transition-all shadow-md group"
                          >
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-white">{item.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="p-6 rounded-3xl bg-[#08140b]/80 border border-emerald-900/30 space-y-3">
                    <div className="flex items-center justify-between pb-2">
                      <h3 className="text-sm font-bold text-white">Frequently Asked Questions</h3>
                    </div>

                    {[
                      {
                        q: 'How do I start a meeting?',
                        a: 'Click "Start a Meeting" on the home screen or in the Meetings tab. Your live meeting room opens immediately inside this website.',
                      },
                      {
                        q: 'How do others join my meeting?',
                        a: 'Copy the room code displayed in your meeting room top bar and share it. Other participants enter that code into "Join with Code" to enter.',
                      },
                      {
                        q: 'How do I enable camera and audio?',
                        a: 'When your browser requests permission for camera and microphone, click Allow. You can toggle them anytime from the call control bar.',
                      },
                    ].map((faq, idx) => {
                      const isOpen = openFaq === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-emerald-900/30 bg-[#050d07] overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-zinc-200 hover:text-white cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                          </button>
                          {isOpen && (
                            <div className="px-3.5 pb-3.5 text-xs text-zinc-400 border-t border-emerald-950/60 pt-2.5 leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Contact Support */}
                  <div className="p-4 rounded-2xl bg-[#08140b] border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Still need help?</h4>
                        <p className="text-[11px] text-zinc-400">Contact the technical support team</p>
                      </div>
                    </div>

                    <button
                      onClick={() => alert('Support request acknowledged.')}
                      className="bg-[#0e2716] hover:bg-[#143a20] border border-emerald-700/50 text-emerald-300 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              )}

            </main>

            {/* FOOTER */}
            <footer className="border-t border-[#0f2113] bg-[#050b07] px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-zinc-300">NIGERIAN ARMY</span>
                <span>|</span>
                <span className="text-emerald-400 font-semibold">RAMS v1.0</span>
              </div>
              <div>
                <span>SECURE COMMUNICATIONS ENCLAVE</span>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* MODAL: Join with Code */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#09150d] border border-emerald-600/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">Enter Meeting Code</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Enter the room code provided by the meeting host.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (joinCodeInput.trim()) {
                  launchInAppMeeting(`Room: ${joinCodeInput}`, joinCodeInput);
                  setShowJoinModal(false);
                  setJoinCodeInput('');
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="e.g. RAMS-4821"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                autoFocus
                className="w-full bg-[#050c07] border border-emerald-800/80 focus:border-emerald-400 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 outline-none"
              />

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!joinCodeInput.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <span>Join Meeting</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: New Meeting / Schedule */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#09150d] border border-emerald-600/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowNewMeetingModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">Create Meeting</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Enter meeting details.
            </p>

            <form onSubmit={handleCreateMeeting} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Briefing Session"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-[#050c07] border border-emerald-800/80 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Host / Unit</label>
                <input
                  type="text"
                  placeholder="e.g. Command"
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  className="w-full bg-[#050c07] border border-emerald-800/80 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#050c07] border border-emerald-800/80 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 AM - 11:00 AM"
                    className="w-full bg-[#050c07] border border-emerald-800/80 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewMeetingModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
