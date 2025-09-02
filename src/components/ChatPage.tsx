import React, { useState } from 'react';
import { Paperclip, Mic, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import '../poppins.css';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function ChatPage() {
  const [showChatUI, setShowChatUI] = useState(false);
  const { resolvedTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I understand your question: "${message}". Let me help you with that. This is a simulated response that would normally come from our AI system.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div 
      className="flex flex-col min-h-[calc(100vh-96px)] transition-colors duration-300 relative"
      style={{
        background: resolvedTheme === 'dark'
          ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
          : 'radial-gradient(ellipse at center, #fff0fa 0%, #f3f0ff 50%, #e0e7ff 100%)',
      }}
    >
      {/* Top left: Lagentry AI with arrow */}
      <div className="absolute left-0 top-0 flex items-center pl-6 pt-4 z-20">
        <span className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Lagentry AI</span>
        <svg className="ml-2 w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col w-full px-4">
        {messages.length === 0 ? (
          // Welcome State
          <div className="flex flex-col items-center justify-center flex-1 py-16 w-full">
            {!showChatUI ? (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    {resolvedTheme === 'dark' ? (
                      <img src="/images/dark.png" alt="star" className="w-14 h-14 object-contain" />
                    ) : (
                      <img src="/images/light.png" alt="star" className="w-14 h-14 object-contain" />
                    )}
                  </div>
                  <h2 
                    className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-4 leading-tight transition-colors duration-300"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Hello, User_name
                  </h2>
                </div>
                {/* Input Area */}
                <div className="w-full max-w-3xl flex justify-center">
                  <form onSubmit={handleSubmit} className="relative w-full">
                    <div className="relative">
                      <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setShowChatUI(true)}
                        placeholder="Ask me anything about your projects"
                        className="w-full px-8 py-10 pr-40 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-2xl transition-all duration-300 shadow-md"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      />
                      {/* Action buttons */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <button type="button" className="p-2 text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2 text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full">
                          <Mic className="w-5 h-5" />
                        </button>
                        <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:to-blue-600  text-white rounded-full">
                      <Send className="w-5 h-5" />
 
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              // Sample Static Chat UI (all bubbles from screenshot) + search bar at bottom
              <div className="w-full flex flex-col flex-1 justify-between min-h-[60vh]">
                <div className="flex flex-col space-y-8">
                  {/* 1. Bot left */}
                  <div className="flex justify-start">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] border border-purple-400 ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark'
                          ? 'linear-gradient(90deg, #2d1846 0%, #7c4dff 100%)'
                          : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomRightRadius: '2rem',
                        borderBottomLeftRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Hey, How Can I Help You?
                    </div>
                  </div>
                  {/* 2. User right */}
                  <div className="flex justify-end">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark' ? '#7c4dff' : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomLeftRadius: '2rem',
                        borderBottomRightRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Hey, I Want To Create An AI Agent That Helps Summarize Emails. Can You Help Me Build It?
                    </div>
                  </div>
                  {/* 3. Bot left */}
                  <div className="flex justify-start">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] border border-purple-400 ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark'
                          ? 'linear-gradient(90deg, #2d1846 0%, #7c4dff 100%)'
                          : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomRightRadius: '2rem',
                        borderBottomLeftRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Absolutely! Let's Build Your Email Summarizer Agent.<br/>First, Do You Want This Agent To Work With Gmail, Outlook, Or Something Else?
                    </div>
                  </div>

                  {/* 4. User right */}
                  <div className="flex justify-end">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark' ? '#7c4dff' : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomLeftRadius: '2rem',
                        borderBottomRightRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Gmail.
                    </div>
                  </div>
                  {/* 5. Bot left */}
                  <div className="flex justify-start">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] border border-purple-400 ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark'
                          ? 'linear-gradient(90deg, #2d1846 0%, #7c4dff 100%)'
                          : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomRightRadius: '2rem',
                        borderBottomLeftRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Got It.<br/>
                      To Start, I'll Set Up A Gmail Integration Using OAuth. Next, Should The Agent Summarize Emails Daily, Hourly, Or On User Request, How Should I Send Reminders — Email, Slack, Or Notifications–Push Notifications Enabled. Want To Name Your Agent?
                    </div>
                  </div>
                  {/* 6. User right */}
                  <div className="flex justify-end">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark' ? '#7c4dff' : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomLeftRadius: '2rem',
                        borderBottomRightRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Yes, Name It Tasky.
                    </div>
                  </div>
                  {/* 7. Bot left */}
                  <div className="flex justify-start">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] border border-purple-400 ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark'
                          ? 'linear-gradient(90deg, #2d1846 0%, #7c4dff 100%)'
                          : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomRightRadius: '2rem',
                        borderBottomLeftRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Perfect. Agent Tasky Is Ready. Want To Test It Now?
                    </div>
                  </div>
                  {/* 8. User right */}
                  <div className="flex justify-end">
                    <div
                      className={`px-8 py-4 text-lg max-w-[80%] ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                      style={{
                        background: resolvedTheme === 'dark' ? '#7c4dff' : '#fff',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                        borderBottomLeftRadius: '2rem',
                        borderBottomRightRadius: '0',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Yes.
                    </div>
                  </div>
                </div>
                {/* Search bar at bottom */}
                <div className="w-full flex justify-center mt-8">
                  <form onSubmit={handleSubmit} className="relative w-full max-w-3xl">
                    <div className="relative">
                      <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me anything about your projects"
                        className="w-full px-8 py-10 pr-40 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-2xl transition-all duration-300 shadow-md"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      />
                      {/* Action buttons */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <button type="button" className="p-2 text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2 text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full">
                          <Mic className="w-5 h-5" />
                        </button>
                        <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 py-8">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.type === 'user' ? (
                      <div
                        className={`px-8 py-4 text-lg max-w-[80%] ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                        style={{
                          background: resolvedTheme === 'dark' ? '#7c4dff' : '#fff',
                          borderTopLeftRadius: '2rem',
                          borderTopRightRadius: '2rem',
                          borderBottomLeftRadius: '2rem',
                          borderBottomRightRadius: '0',
                          fontFamily: 'Poppins, sans-serif',
                        }}
                      >
                        {message.content}
                      </div>
                    ) : (
                      <div
                        className={`px-8 py-4 text-lg max-w-[80%] border border-purple-400 ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
                        style={{
                          background: resolvedTheme === 'dark'
                            ? 'linear-gradient(90deg, #2d1846 0%, #7c4dff 100%)'
                            : '#fff',
                          borderTopLeftRadius: '2rem',
                          borderTopRightRadius: '2rem',
                          borderBottomRightRadius: '2rem',
                          borderBottomLeftRadius: '0',
                          fontFamily: 'Poppins, sans-serif',
                        }}
                      >
                        {message.content}
                      </div>
                    )}
                    <div className={`text-xs text-gray-500 dark:text-gray-400 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-6 py-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 py-6 bg-transparent">
              <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your projects"
                    className="w-full px-6 py-4 pr-32 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-lg shadow-sm"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button type="button" className="p-2 text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
