import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { Send, Smile, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';

const Chat = () => {
    const { userId } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
        id: 1,
        text: 'Hey! How are you doing?',
        sender: 'other',
        time: '10:30 AM',
        },
        {
        id: 2,
        text: "I'm doing great! Just working on some projects. How about you?",
        sender: 'me',
        time: '10:32 AM',
        },
        {
        id: 3,
        text: 'Same here! Been pretty busy with work lately.',
        sender: 'other',
        time: '10:35 AM',
        },
    ]);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Animate chat container on mount
        gsap.fromTo(
        chatContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );

        // Animate existing messages
        const messageElements = document.querySelectorAll('.chat-message');
        gsap.fromTo(
        messageElements,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
        );
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: 'me',
            time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            }),
        };

        setMessages([...messages, newMessage]);
        setMessage('');

        // Animate new message
        setTimeout(() => {
            const lastMessage = document.querySelector('.chat-message:last-child');
            gsap.fromTo(
            lastMessage,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }, 0);
        }
    };

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col h-screen bg-background"
    >
      {/* Chat Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b mt-12 sm:mt-16 bg-card shadow-sm">
        <button
          className="lg:hidden p-2 hover:bg-accent rounded-full transition-colors"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold text-lg">
          JD
        </div>
        
        <div className="flex-1">
          <h2 className="font-semibold text-lg">John Doe</h2>
          <p className="text-sm text-muted-foreground">Active now</p>
        </div>
        
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
            <div
            key={msg.id}
            className={`chat-message flex ${
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                msg.sender === 'me'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              } rounded-2xl px-4 py-2.5 shadow-sm`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  msg.sender === 'me'
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button
            type="button"
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;