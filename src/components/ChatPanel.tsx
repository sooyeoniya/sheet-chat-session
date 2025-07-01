
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, User } from '@/types';
import { Send } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

interface ChatPanelProps {
  classSpaceId: string;
  messages: ChatMessage[];
  currentUser: User | null;
}

export function ChatPanel({ classSpaceId, messages, currentUser }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser) return;

    // 실제로는 여기서 API 호출
    console.log('새 메시지:', {
      classSpaceId,
      userId: currentUser.id,
      content: newMessage,
    });

    setNewMessage('');
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

  const isMyMessage = (message: ChatMessage) => {
    return message.userId === currentUser?.id;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">실시간 채팅</h3>
        <p className="text-sm text-muted-foreground">
          {messages.length}개의 메시지
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  isMyMessage(message)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {!isMyMessage(message) && (
                  <div className="text-xs font-medium mb-1">
                    {getUserName(message.userId)}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className={`text-xs mt-1 opacity-70`}>
                  {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
