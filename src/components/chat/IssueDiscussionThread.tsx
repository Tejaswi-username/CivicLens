import React, { useState, useEffect } from 'react';
import { chatService, ChatMessage } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/date';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  User,
  Shield,
  Sparkles,
  Info
} from 'lucide-react';

interface IssueDiscussionThreadProps {
  reportId: string;
  reportTitle: string;
  category: string;
}

export const IssueDiscussionThread: React.FC<IssueDiscussionThreadProps> = ({
  reportId,
  reportTitle,
  category
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const list = chatService.getMessages(reportId);
    setMessages(list);
  }, [reportId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (currentUser.role === 'Guest') {
      alert('Please log in with a citizen or admin account to contribute to discussion.');
      return;
    }

    setSubmitting(true);
    const newMsg = chatService.sendMessage({
      channelId: reportId,
      userId: currentUser.userId,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role === 'Admin' ? 'Admin' : 'Citizen',
      content: content.trim(),
      reportReference: {
        reportId,
        title: reportTitle,
        category
      }
    });

    setMessages(prev => [...prev, newMsg]);
    setContent('');
    setSubmitting(false);
  };

  const handleLike = (msgId: string) => {
    if (currentUser.role === 'Guest') {
      alert('Please log in to like updates.');
      return;
    }
    const updated = chatService.toggleLike(msgId, currentUser.userId);
    if (updated) {
      setMessages(prev => prev.map(m => (m.id === msgId ? updated : m)));
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Community Field Notes & Updates</span>
              <span className="text-xs font-mono font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {messages.length} notes
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Share real-time ground updates, repair crew spottings, or neighborhood safety tips.
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-1">
            <p className="text-xs font-semibold text-slate-600">No community updates on this issue yet.</p>
            <p className="text-[11px] text-slate-400">
              Be the first to post a field update or share additional safety context!
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isLiked = msg.likedBy.includes(currentUser.userId);
            const isAdmin = msg.userRole === 'Admin';

            return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl border transition ${
                  isAdmin
                    ? 'bg-purple-50/70 border-purple-200'
                    : 'bg-slate-50/80 border-slate-200/90'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {msg.userAvatar ? (
                      <img
                        src={msg.userAvatar}
                        alt={msg.userName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-slate-300"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                        {msg.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
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
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatRelativeTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(msg.id)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition ${
                      isLiked
                        ? 'bg-teal-100 text-teal-800 font-bold'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                    }`}
                    title="Mark helpful"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{msg.likes > 0 ? msg.likes : ''}</span>
                  </button>
                </div>

                <div className="mt-2 text-xs text-slate-800 leading-relaxed pl-9">
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`Post an update as ${currentUser.name}... (e.g. "Water cleared after rain", "Crew on site")`}
            className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post Note</span>
          </button>
        </div>
      </form>
    </div>
  );
};
