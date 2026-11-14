import React, { useState, useEffect, useRef } from 'react';
import { chatService, ChatMessage, CHAT_CHANNELS, ChatChannel } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { formatRelativeTime } from '../utils/date';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  User,
  Shield,
  Hash,
  AlertOctagon,
  Lightbulb,
  Droplets,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  Paperclip
} from 'lucide-react';

export const CommunityChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports } = useReports();
  const [activeChannelId, setActiveChannelId] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = CHAT_CHANNELS.find(c => c.id === activeChannelId) || CHAT_CHANNELS[0];

  const loadChannelMessages = (channelId: string) => {
    const list = chatService.getMessages(channelId);
    setMessages(list);
  };

  useEffect(() => {
    loadChannelMessages(activeChannelId);
  }, [activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (currentUser.role === 'Guest') {
      alert('Please log in with a citizen or admin account to chat with the community.');
      return;
    }

    setSubmitting(true);

    let reportRef: { reportId: string; title: string; category?: string } | undefined;
    if (selectedReportId) {
      const rep = reports.find(r => r.reportId === selectedReportId);
      if (rep) {
        reportRef = {
          reportId: rep.reportId,
          title: rep.description,
          category: rep.category
        };
      }
    }

    const newMsg = chatService.sendMessage({
      channelId: activeChannelId,
      userId: currentUser.userId,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role === 'Admin' ? 'Admin' : 'Citizen',
      content: content.trim(),
      reportReference: reportRef
    });

    setMessages(prev => [...prev, newMsg]);
    setContent('');
    setSelectedReportId('');
    setSubmitting(false);
  };

  const handleToggleLike = (msgId: string) => {
    if (currentUser.role === 'Guest') {
      alert('Please sign in to like community messages.');
      return;
    }
    const updated = chatService.toggleLike(msgId, currentUser.userId);
    if (updated) {
      setMessages(prev => prev.map(m => (m.id === msgId ? updated : m)));
    }
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertOctagon':
        return <AlertOctagon className="w-4 h-4 text-amber-500" />;
      case 'Lightbulb':
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
    }
  };

  // Helper to highlight #REP-BAC-XXXX in message content
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#REP-BAC-\d{4})/g);
    return parts.map((part, i) => {
      if (part.startsWith('#REP-BAC-')) {
        const id = part.replace('#', '');
        return (
          <Link
            key={i}
            to={`/reports/${id}`}
            className="text-blue-600 font-bold underline hover:text-blue-800 bg-blue-50 px-1 py-0.2 rounded"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-blue-800 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Civic Neighborhood Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            Bachupally Community Civic Discussion
          </h1>
          <p className="text-xs text-teal-100 max-w-xl mt-1">
            Connect directly with fellow Bachupally residents and municipal ward engineers to coordinate neighborhood safety, pothole alerts, and repair tracking.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs">
          <span className="text-slate-300 block">Active Persona:</span>
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </div>

      {/* Main Chat Grid (Sidebar Channels + Chat Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Channels List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="p-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Discussion Channels
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {CHAT_CHANNELS.length} Active
            </span>
          </div>

          <div className="space-y-1.5">
            {CHAT_CHANNELS.map(channel => {
              const isActive = channel.id === activeChannelId;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-start gap-3 ${
                    isActive
                      ? 'bg-blue-50/90 border border-blue-200 text-blue-900 shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {getChannelIcon(channel.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{channel.tag}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {channel.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Guidelines info card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">💡 Pro Tip</span>
            <p>
              Type <span className="font-mono font-bold text-blue-600">#REP-BAC-1001</span> in your message to automatically embed an interactive report card preview!
            </p>
          </div>
        </div>

        {/* Right Main Chat Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Channel Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                {getChannelIcon(activeChannel.icon)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{activeChannel.name}</span>
                  <span className="text-xs font-normal text-slate-500 font-mono">
                    ({activeChannel.tag})
                  </span>
                </h2>
                <p className="text-xs text-slate-500 line-clamp-1">{activeChannel.description}</p>
              </div>
            </div>

            <span className="text-xs font-mono font-semibold text-slate-400">
              {messages.length} messages
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-400">
                <MessageSquare className="w-10 h-10 text-slate-300" />
                <p className="text-xs font-semibold">No messages in this channel yet.</p>
                <p className="text-[11px]">Start the conversation by posting an update!</p>
              </div>
            ) : (
              messages.map(msg => {
                const isLiked = msg.likedBy.includes(currentUser.userId);
                const isAdmin = msg.userRole === 'Admin';
                const isMe = msg.userId === currentUser.userId;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition ${
                      isAdmin
                        ? 'bg-purple-50/60 border-purple-200'
                        : isMe
                        ? 'bg-blue-50/40 border-blue-200'
                        : 'bg-white border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {/* User Avatar */}
                    {msg.userAvatar ? (
                      <img
                        src={msg.userAvatar}
                        alt={msg.userName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                        {msg.userName.charAt(0)}
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{msg.userName}</span>
                          {isAdmin ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-purple-700 text-white rounded">
                              Ward Officer
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-1.5 py-0.2 rounded">
                              Citizen
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatRelativeTime(msg.createdAt)}
                          </span>

                          <button
                            onClick={() => handleToggleLike(msg.id)}
                            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition ${
                              isLiked
                                ? 'bg-teal-100 text-teal-800 font-bold'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                            title="Mark helpful"
                          >
                            <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{msg.likes > 0 ? msg.likes : ''}</span>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-xs text-slate-800 leading-relaxed break-words">
                        {renderFormattedContent(msg.content)}
                      </p>

                      {/* Attached Report Reference Preview Card */}
                      {msg.reportReference && (
                        <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2 max-w-md">
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              {msg.reportReference.reportId}
                            </span>
                            <span className="text-xs text-slate-700 font-medium truncate">
                              {msg.reportReference.title}
                            </span>
                          </div>
                          <Link
                            to={`/reports/${msg.reportReference.reportId}`}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Open Report"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Compose Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white space-y-2.5">
            {/* Quick Report Link Selector */}
            <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
              <Paperclip className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-[11px] whitespace-nowrap">Link Report:</span>
              <select
                value={selectedReportId}
                onChange={e => setSelectedReportId(e.target.value)}
                className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
              >
                <option value="">None (General Message)</option>
                {reports.slice(0, 10).map(r => (
                  <option key={r.reportId} value={r.reportId}>
                    {r.reportId} - {r.category} ({r.landmark.substring(0, 25)}...)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Post update to ${activeChannel.tag} as ${currentUser.name}...`}
                className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-5 py-3 bg-gradient-to-r from-blue-700 to-teal-700 hover:from-blue-800 hover:to-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
