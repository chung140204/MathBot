'use client';

import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
