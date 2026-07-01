import React, { useEffect, useRef, useState } from 'react';
import { sendMessage, subscribeToMessages, getConversationId } from '../services/chatService';

export default function ChatPanel({ currentUserId, currentUserName, otherUserId, otherUserName, cropId, cropName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const conversationId = getConversationId(currentUserId, otherUserId, cropId);

  useEffect(() => {
    const unsub = subscribeToMessages(conversationId, setMessages);
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendMessage({
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: otherUserId,
        cropId,
        cropName,
        text: text.trim(),
      });
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-80 sm:h-96 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <p className="font-bold text-sm">{otherUserName}</p>
          {cropName && <p className="text-xs text-green-100">Re: {cropName}</p>}
        </div>
        {onClose && <button onClick={onClose} className="text-white/80 hover:text-white text-lg">×</button>}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
        {messages.length === 0 && <p className="text-xs text-slate-400 text-center py-8">Start the conversation</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.senderId === currentUserId ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
              {m.senderId !== currentUserId && <p className="text-[10px] font-bold opacity-70 mb-0.5">{m.senderName}</p>}
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button type="submit" disabled={sending} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50">Send</button>
      </form>
    </div>
  );
}
