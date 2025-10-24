import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { Send, Smile, Paperclip, MoreVertical, ArrowLeft, Phone, Video } from 'lucide-react';
import { gsap } from 'gsap';
import { createSocketConnection } from '../../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';
import ChatSkeleton from './ChatSkeleton';
const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

// Profile view
    
    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                BASE_URL + "/chat/userId/" + targetUserId,
                { withCredentials: true }
            );
            const chats = await axios.get(
                BASE_URL + "/chat/message/" + targetUserId,
                { withCredentials: true }
            );
            setMessages(chats?.data?.messages)
            setTargetUser(res?.data)
        } catch (error) {
            console.log(error.message + "  from the chat") 
        }
        finally{
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

  // Socket connection
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit('joinChat', { userId, targetUserId });

    socket.on('recieveMessage', ({ senderUserId, targetId, text, time }) => {
      const newMessage = {
        id: Date.now(),
        senderId : senderUserId,
        targetId,
        text,
        time,
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Initial animation
  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.fromTo(
        chatContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  // Animate new messages
  useEffect(() => {
    const messageElements = document.querySelectorAll('.chat-message');
    if (messageElements.length > 0) {
      const lastMessage = messageElements[messageElements.length - 1];
      if (lastMessage) {
        gsap.fromTo(
          lastMessage,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
// auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        userId: userId,
        targetId: targetUserId,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      const socket = createSocketConnection();
      socket.emit('sendMessage', newMessage);
      setMessage('');
    }
  };
 
  return (
    <>
    {loading ? <ChatSkeleton /> : 
    (<div ref={chatContainerRef} className="absolute inset-0 flex flex-col bg-background"
        style={{
            height: "100svh", // dynamically adjusts when keyboard opens
    }}>
      {/* Chat Header - Fixed */}
      <div className="flex-none flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b mt-12 sm:mt-16 bg-card/95 backdrop-blur-sm shadow-sm z-10"
        
      >
        <button
          className="p-2 hover:bg-accent rounded-full transition-colors"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-lg ring-2 ring-primary/20 overflow-hidden">
        {targetUser?.photo ? <img src={targetUser?.photo} className='h-full w-full' alt="img" /> : <div>
            {targetUser?.firstName?.[0] || 'J'}
          {targetUser?.lastName?.[0] || 'D'}
          </div>
          }
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-base sm:text-lg truncate">
            {targetUser?.firstName || 'John'} {targetUser?.lastName || 'Doe'}
          </h2>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div 
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 sm:space-y-4"
        style={{ 
          maxHeight: 'calc(100vh - 180px)',
          minHeight: 0
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              <Send className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Start the conversation by sending a message!
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`chat-message flex ${
                  msg.senderId === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg ${
                    msg.senderId === userId 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
                      : 'bg-muted text-foreground'
                  } rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      msg.senderId === userId
                        ? 'text-white/80'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input - Fixed */}
      <div className="flex-none px-4 sm:px-6 py-3 sm:py-4 border-t bg-card/95 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">

          <button
            type="button"
            className="p-2 hover:bg-accent rounded-full transition-colors hidden sm:block"
            title="Add emoji"
          >
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 sm:py-2.5 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"d
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2.5 sm:p-3 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-lg text-center disabled:shadow-none"
            title="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </div>
    )}
    </>
  )
};

export default Chat;