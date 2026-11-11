import React, { useState } from 'react';
import { 
  Home, 
  Video, 
  Calendar, 
  Info, 
  HelpCircle, 
  Mic, 
  MicOff, 
  VideoOff, 
  ScreenShare, 
  MoreVertical, 
  ArrowRight, 
  ShieldCheck, 
  Laptop, 
  Users, 
  Zap, 
  Radio, 
  ExternalLink,
  Signal,
  X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'meetings' | 'schedule' | 'about' | 'help'>('home');
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleStartMeeting = () => {
    // Direct link to Google Meet new meeting or room
    window.open('https://meet.google.com/new', '_blank');
  };

  const handleJoinWithCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!meetingCode.trim()) return;
    const cleanCode = meetingCode.trim().replace(/^https?:\/\/meet\.google\.com\//, '');
    window.open(`https://meet.google.com/${cleanCode}`, '_blank');
    setShowCodeModal(false);
    setMeetingCode('');
  };

  const handleQuickJoin = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      window.open('https://meet.google.com/new', '_blank');
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#060c07] text-white flex flex-col justify-between overflow-x-hidden selection:bg-emerald-600 selection:text-white">
      {/* Background Camo & Tactical Radar Grid Graphic */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle topographic contour overlay */}
        <div 
          className="absolute inset-0 opacity-[0.14] mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(circle at 75% 30%, rgba(34, 197, 94, 0.22) 0%, transparent 60%),
                              radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                              repeating-radial-gradient(circle at 35% 45%, transparent 0, transparent 40px, rgba(34, 197, 94, 0.05) 41px, transparent 42px)`,
          }}
        />

        {/* Tactical silhouettes backdrop: Soldier, Tower & Helicopter */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-black" />
        
        {/* Radar concentric circular guides */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-emerald-500/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/5 rounded-full pointer-events-none" />
      </div>

      {/* Main Container Layout */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-64 xl:w-72 border-r border-[#152a1a] bg-[#071009]/95 backdrop-blur-md flex flex-col justify-between p-6 shrink-0">
          <div>
            {/* Nigerian Army Crest / Emblem */}
            <div className="flex items-center space-x-3.5 mb-10 pb-6 border-b border-[#142c1b]">
              <div className="relative w-12 h-14 bg-[#0a180d] border border-yellow-500/40 rounded-sm flex items-center justify-center p-1 shadow-lg shadow-black/50">
                {/* Shield / Eagle Nigerian Army Badge representation */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-2 bg-red-600 rounded-t-xs" />
                  <div className="w-7 h-7 flex items-center justify-center text-yellow-400 font-bold text-xs tracking-tighter">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
                      <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 2.18l6 3v4.82c0 4.39-3.04 8.52-6 9.77-2.96-1.25-6-5.38-6-9.77V7.18l6-3z"/>
                      <path d="M12 6.5l1.6 3.3 3.6.5-2.6 2.6.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.6 3.6-.5z" />
                    </svg>
                  </div>
                  <span className="text-[7px] text-yellow-400 font-black tracking-widest uppercase">N.A.</span>
                </div>
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-wider uppercase text-zinc-100">NIGERIAN</h1>
                <h2 className="text-sm font-extrabold tracking-wider uppercase text-emerald-400">ARMY</h2>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5">
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
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-800/10 border-l-4 border-emerald-500 text-white shadow-lg shadow-emerald-950/40' 
                        : 'text-zinc-400 hover:text-white hover:bg-emerald-900/15'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Lower Sidebar Quote & Tactical Radar graphic */}
          <div className="mt-8 pt-6 border-t border-[#142c1b]">
            <div className="mb-4">
              <span className="italic text-xs font-semibold tracking-wider text-emerald-400/80 block uppercase">
                Stronger Together
              </span>
              <span className="text-[11px] text-zinc-500">Secure Comm Channel v2.4</span>
            </div>

            {/* Tactical dish visual representation */}
            <div className="relative w-full h-24 bg-gradient-to-t from-emerald-950/60 to-transparent rounded-lg border border-emerald-900/30 p-2 overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
              <div className="flex items-center space-x-2 text-[10px] text-emerald-400 z-10 font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>FREQ: 432.85 MHz [ENC]</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN HERO CONTENT */}
        <main className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          
          {/* Header Bar */}
          <header className="flex items-center justify-between pb-8">
            <div className="flex items-center space-x-4">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow">RAMS</span>
              <div className="h-7 w-[2px] bg-emerald-600/50" />
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold leading-tight">
                Remote Army<br />Meeting System
              </div>
            </div>

            {/* Status & Profile Pill */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-[#0c1a10] border border-emerald-600/30 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-[#0c1a10] border border-zinc-800 px-2.5 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-zinc-200 text-[#071009] flex items-center justify-center font-bold text-xs">
                  RO
                </div>
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </header>

          {/* Main Grid: Left copy & actions, Right interactive preview window */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#0d2113] border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Secure • Reliable • Easy</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Join Your <br />
                <span className="text-emerald-400 font-extrabold">Google Meet</span> <br />
                in Seconds
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-zinc-300 max-w-lg font-normal leading-relaxed">
                Connect, Collaborate and Communicate — All in One Place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={handleStartMeeting}
                  className="flex items-center space-x-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-6 py-3.5 rounded-full shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Video className="w-5 h-5 fill-current" />
                  <span>Start a Meeting</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button 
                  onClick={() => setShowCodeModal(true)}
                  className="flex items-center space-x-3 bg-[#0a170f] hover:bg-[#0e2417] active:scale-95 text-zinc-200 border border-emerald-800/60 font-medium px-6 py-3.5 rounded-full transition-all cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>Join with Code</span>
                </button>
              </div>

              {/* Helper disclaimer */}
              <div className="flex items-center space-x-2 text-xs text-zinc-400 pt-1">
                <Info className="w-4 h-4 text-emerald-500" />
                <span>No complicated setup. Just click and meet.</span>
              </div>
            </div>

            {/* Right Column: Google Meet Card Interface */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-md w-full bg-[#0a130c]/90 border border-emerald-600/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/80">
                {/* Glow backlight behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-500/20 rounded-3xl blur-xl -z-10 pointer-events-none" />

                {/* Card Top: Google Meet Header & Secure Indicator */}
                <div className="flex items-center justify-between pb-6 border-b border-emerald-950/80">
                  <div className="flex items-center space-x-3">
                    {/* Google Meet official 4-color icon recreation */}
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 48 48" className="w-8 h-8">
                        <path fill="#00832d" d="M14 28l5.5-5.5V16l-5.5 5.5v6.5z" />
                        <path fill="#0066da" d="M34 16l-5.5 5.5v6.5l5.5-5.5V16z" />
                        <path fill="#e94235" d="M28.5 10.5h-9l-5.5 5.5h20l-5.5-5.5z" />
                        <path fill="#2684fc" d="M28.5 37.5l5.5-5.5H14l5.5 5.5h9z" />
                        <path fill="#ffba00" d="M34 16l8-6v28l-8-6V16z" />
                        <path fill="#00ac47" d="M14 28v-6.5L6 16v16l8-4z" />
                      </svg>
                    </div>
                    <span className="font-bold text-lg text-white tracking-wide">Google Meet</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secure Connection</span>
                  </div>
                </div>

                {/* Inner Video Preview Frame */}
                <div className="relative my-6 aspect-video bg-[#050a06] border border-emerald-900/40 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-radial from-emerald-950/20 to-transparent" />
                  
                  {/* Watermark Logo */}
                  <div className="w-20 h-20 mb-3 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                    <svg viewBox="0 0 96 96" className="w-full h-full drop-shadow-lg">
                      <path fill="#00ac47" d="M24 56l12-12V32l-12 12v12z" />
                      <path fill="#2684fc" d="M68 32l-12 12v12l12-12V32z" />
                      <path fill="#ea4335" d="M56 20H40L28 32h40l-12-12z" />
                      <path fill="#0066da" d="M56 76l12-12H28l12 12h16z" />
                      <path fill="#ffba00" d="M68 32l16-12v56l-16-12V32z" />
                    </svg>
                  </div>
                  
                  <span className="text-lg font-bold text-zinc-100 tracking-wide">Ready to join?</span>
                  <span className="text-xs text-zinc-500 mt-1">Camera & Microphone are primed</span>
                </div>

                {/* Meeting Control Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    {/* Mic button */}
                    <button 
                      onClick={() => setMicActive(!micActive)}
                      title={micActive ? 'Mute microphone' : 'Unmute microphone'}
                      className={`p-3 rounded-full border transition-all cursor-pointer ${
                        micActive 
                          ? 'bg-[#122216] border-emerald-700/50 text-emerald-300 hover:bg-[#18311f]' 
                          : 'bg-red-950/80 border-red-600 text-red-400'
                      }`}
                    >
                      {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    {/* Camera button */}
                    <button 
                      onClick={() => setVideoActive(!videoActive)}
                      title={videoActive ? 'Turn off camera' : 'Turn on camera'}
                      className={`p-3 rounded-full border transition-all cursor-pointer ${
                        videoActive 
                          ? 'bg-[#122216] border-emerald-700/50 text-emerald-300 hover:bg-[#18311f]' 
                          : 'bg-red-950/80 border-red-600 text-red-400'
                      }`}
                    >
                      {videoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>

                    {/* Screen share icon */}
                    <button 
                      title="Present Screen"
                      className="p-3 rounded-full bg-[#122216] border border-emerald-700/50 text-zinc-300 hover:bg-[#18311f] transition-all cursor-pointer"
                    >
                      <ScreenShare className="w-4 h-4" />
                    </button>

                    {/* More button */}
                    <button 
                      title="More Options"
                      className="p-3 rounded-full bg-[#122216] border border-emerald-700/50 text-zinc-300 hover:bg-[#18311f] transition-all cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Join Now CTA */}
                  <button 
                    onClick={handleQuickJoin}
                    disabled={connecting}
                    className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{connecting ? 'Connecting...' : 'Join Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            
            {/* Card 1 */}
            <div className="group bg-[#09150d]/80 border border-emerald-800/30 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-[#0c1f13] cursor-pointer">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Instant Access</h3>
                  <p className="text-xs text-zinc-400 leading-tight">Start or join meetings with one click.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#122618] flex items-center justify-center text-zinc-400 group-hover:text-emerald-400">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#09150d]/80 border border-emerald-800/30 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-[#0c1f13] cursor-pointer">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Secure & Trusted</h3>
                  <p className="text-xs text-zinc-400 leading-tight">Built with Google Meet security.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#122618] flex items-center justify-center text-zinc-400 group-hover:text-emerald-400">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#09150d]/80 border border-emerald-800/30 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-[#0c1f13] cursor-pointer">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Works Everywhere</h3>
                  <p className="text-xs text-zinc-400 leading-tight">On any device, anytime.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#122618] flex items-center justify-center text-zinc-400 group-hover:text-emerald-400">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="group bg-[#09150d]/80 border border-emerald-800/30 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-[#0c1f13] cursor-pointer">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Built for the Army</h3>
                  <p className="text-xs text-zinc-400 leading-tight">Stay connected, get the job done.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#122618] flex items-center justify-center text-zinc-400 group-hover:text-emerald-400">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="relative z-10 border-t border-[#132819] bg-[#050c07]/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-yellow-500/20 border border-yellow-500/50 rounded-sm flex items-center justify-center text-[10px] text-yellow-400 font-bold">
            ★
          </div>
          <span className="font-bold tracking-wider text-zinc-200">NIGERIAN ARMY</span>
          <span className="text-zinc-600">|</span>
          <span className="font-extrabold text-emerald-400">RAMS</span>
        </div>

        <div className="flex items-center space-x-6 tracking-widest text-[11px] font-semibold text-zinc-400">
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">CONNECT</span>
          <span className="text-emerald-600">•</span>
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">COLLABORATE</span>
          <span className="text-emerald-600">•</span>
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">ACHIEVE</span>
        </div>

        <div className="flex items-center space-x-2 text-emerald-400">
          <Signal className="w-4 h-4" />
          <span className="font-mono text-[11px]">COMMS LINK SECURE</span>
        </div>
      </footer>

      {/* MODAL: Join with Code */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b180e] border border-emerald-600/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowCodeModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Enter Meeting Code</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Enter the meeting code or link provided by the command organizer.
            </p>

            <form onSubmit={handleJoinWithCode} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. abc-defg-hij or meet.google.com/..."
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                autoFocus
                className="w-full bg-[#050d07] border border-emerald-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
              />

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!meetingCode.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                >
                  <span>Join Meeting</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
