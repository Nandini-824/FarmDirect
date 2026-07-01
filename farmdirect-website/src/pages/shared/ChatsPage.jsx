import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserConversations } from '../../services/chatService';
import { getUserProfile } from '../../services/authService';
import ChatPanel from '../../components/ChatPanel';

export default function ChatsPage() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [otherName, setOtherName] = useState('');

  useEffect(() => {
    if (!user) return;
    getUserConversations(user.uid).then(setConversations);
  }, [user]);

  const openChat = async (convo) => {
    setActive(convo);
    const otherProfile = await getUserProfile(convo.otherUserId);
    setOtherName(otherProfile?.name || 'User');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Messages</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-semibold text-sm text-slate-700">Conversations</div>
          {conversations.length === 0 ? (
            <p className="p-6 text-sm text-slate-400 text-center">No messages yet</p>
          ) : conversations.map((c) => (
            <button key={c.conversationId} onClick={() => openChat(c)} className={`w-full text-left p-4 border-b border-slate-50 hover:bg-green-50 ${active?.conversationId === c.conversationId ? 'bg-green-50' : ''}`}>
              <p className="font-semibold text-sm text-slate-800">{c.cropName || 'General'}</p>
              <p className="text-xs text-slate-400 truncate">{c.lastMessage}</p>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2">
          {active ? (
            <ChatPanel
              currentUserId={user.uid}
              currentUserName={profile?.name}
              otherUserId={active.otherUserId}
              otherUserName={otherName}
              cropId={active.cropId}
              cropName={active.cropName}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 h-96 flex items-center justify-center text-slate-400 text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
