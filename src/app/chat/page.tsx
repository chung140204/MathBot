'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ChatSidebar from '@/features/chat/components/ChatSidebar';
import ChatWindow from '@/features/chat/components/ChatWindow';

export default function ChatPage() {
  useEffect(() => { document.title = 'AI Chat | MathBot'; }, []);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
  };

  const handleSessionCreated = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setRefreshKey((prev) => prev + 1);
  };

  const handleMessageSent = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar 
        userId={userId}
        activeSessionId={activeSessionId}
        refreshKey={refreshKey}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
      />
      <ChatWindow 
        userId={userId}
        sessionId={activeSessionId}
        onSessionCreated={handleSessionCreated}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}
