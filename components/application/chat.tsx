'use client';

import { Bot, SendHorizonal, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GeneratedApplication, JobDescription, UserProfile } from '@/types/db';
import { chatWithCareerCoach, analyzeProfileUpdate } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { db } from '@/services/browser-client/db';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '../ui/input-group';
import { Card } from '../ui/card';
import { ChatMessage } from '@/types/ai';

export const Chat = ({
  profile,
  job,
  application,
  selectedTone,
}: {
  profile: UserProfile;
  job: JobDescription;
  application: GeneratedApplication | undefined;
  selectedTone: string;
}) => {
  const [chatInput, setChatInput] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);

  // Chatbot State
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI Career Coach. I've reviewed this job description. Ask me anything about the role, or let's practice some interview questions!",
    },
  ]);

  const handleChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || !profile || !job) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsChatThinking(true);

    try {
      // 1. Check for profile updates
      const extractedInfo = await analyzeProfileUpdate(userMsg);
      if (extractedInfo) {
        const updatedProfile = {
          ...profile,
          // 🐛 FIX: Change `additionalInfo` to `additional_info` for the snake_case schema
          additional_info: profile.additional_info // Read from snake_case
            ? `${profile.additional_info}\n${extractedInfo}`
            : extractedInfo,
        };
        await db.saveProfile(updatedProfile);
        // NOTE: setProfile is commented out, but if it were active,
        // it would correctly update the parent component's state with snake_case keys.
        // setProfile(updatedProfile);
      }

      // 2. Get Chat Response
      const response = await chatWithCareerCoach(
        [...chatHistory, { role: 'user', content: userMsg }],
        profile,
        job
      );
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsChatThinking(false);
    }
  };

  if (application && chatHistory.length === 0)
    setChatHistory([
      {
        role: 'assistant',
        content: `I've regenerated your application package with a ${selectedTone} tone. Ask me anything about it!`,
      },
    ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <Card className='flex-1 overflow-hidden flex flex-col h-full bg-transparent border-0 shadow-none'>
      <div className='relative flex flex-col items-center h-full bg-slate-50/30'>
        <div className='flex-1 w-full overflow-y-auto space-y-4 custom-scrollbar scroll-smooth'>
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in-up`}>
              <div
                className={`flex gap-2 max-w-[85%] ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-purple-100 text-purple-600'
                  }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isChatThinking && (
            <div className='flex justify-start animate-fade-in-up'>
              <div className='flex gap-2'>
                <div className='w-7 h-7 rounded-full bg-white border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm'>
                  <Bot size={14} />
                </div>
                <div className='bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-9 shadow-sm'>
                  <div className='w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce'></div>
                  <div className='w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100'></div>
                  <div className='w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200'></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className='fixed w-1/2 bottom-8 z-100'>
          <form onSubmit={handleChatSubmit}>
            <InputGroup className='border-2 bg-white'>
              <InputGroupTextarea
                placeholder='Ask your AI Career Coach...'
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatThinking}
              />
              <InputGroupAddon align='inline-end'>
                <InputGroupButton
                  size={'icon-sm'}
                  type='submit'
                  disabled={isChatThinking || !chatInput.trim()}>
                  <SendHorizonal className='h-4 w-4' />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>
      </div>
    </Card>
  );
};
