"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import MemberGate from "@/components/member-gate";

const mockMessages = [
  { id: 1, from: "Tru.D", avatar: "✨", color: "#FF3F99", text: "Hey everyone! Welcome to your Thailand Island Hopper group chat 🎉 I'm Tru.D — your AI travel assistant. Tag me anytime with @Tru.D and I can help with visa info, packing tips, currency questions, or anything about your trip. If I can't help, I'll get the team on it! Let's get excited! 🌴", time: "4 days ago", isBot: true },
  { id: 2, from: "Sophie C.", avatar: "SC", color: "#6BD495", text: "Hiii! Coming from London, first time in Thailand! SO excited 🌴", time: "3 days ago" },
  { id: 3, from: "Marcus R.", avatar: "MR", color: "#2172D5", text: "Doing the Total Thailand so I'll be with you guys for the island hopper section. Can't wait to meet everyone!", time: "2 days ago" },
  { id: 4, from: "Priya K.", avatar: "PK", color: "#FCA501", text: "Coming from Mumbai! Been dreaming about this for months 🙌", time: "1 day ago" },
  { id: 5, from: "Jake M.", avatar: "JM", color: "#FCA501", text: "@Tru.D do we need to get the digital arrival card sorted before we fly?", time: "12 hours ago" },
  { id: 6, from: "Tru.D", avatar: "✨", color: "#FF3F99", text: "Great question Jake! Yes — you need to register for a Digital Arrival Card at tdac.immigration.go.th at least 3 days before you arrive. It only takes a few minutes. You'll get a confirmation email to show at immigration. 🛂", time: "12 hours ago", isBot: true },
  { id: 7, from: "Nina W.", avatar: "NW", color: "#2172D5", text: "I'm on the Discover Asia trip so I'll be joining you guys from Bangkok! Anyone else doing a multi-country?", time: "8 hours ago" },
  { id: 8, from: "Tom A.", avatar: "TA", color: "#FCA501", text: "Full Moon Island Hopper here 🌕 joining on day 3. Who's going to the Full Moon Party??", time: "6 hours ago" },
  { id: 9, from: "Chloe W.", avatar: "CW", color: "#6BD495", text: "Meee! Is it as crazy as everyone says? 😂", time: "5 hours ago" },
  { id: 10, from: "Marcus R.", avatar: "MR", color: "#2172D5", text: "It's INSANE. Did it last year on my Bali trip. Bring shoes you don't care about 😅", time: "4 hours ago" },
  { id: 11, from: "Sophie C.", avatar: "SC", color: "#6BD495", text: "@Tru.D how much spending money should I bring?", time: "2 hours ago" },
  { id: 12, from: "Tru.D", avatar: "✨", color: "#FF3F99", text: "Great question Sophie! Budget around £15-25 per day for food, drinks, and extras. Street food meals are £1-2, beers £1-3, and even nice restaurants are super affordable. ATMs are everywhere but charge 220 THB (~£5) per withdrawal, so withdraw larger amounts less often 💰", time: "2 hours ago", isBot: true },
];

const groupMembers = [
  { name: "Tru.D (AI Assistant)", avatar: "✨", color: "#FF3F99", online: true },
  { name: "Alex T.", avatar: "AT", color: "#FF3F99", online: true },
  { name: "Sophie C.", avatar: "SC", color: "#6BD495", online: true },
  { name: "Jake M.", avatar: "JM", color: "#FCA501", online: false },
  { name: "Priya K.", avatar: "PK", color: "#FCA501", online: false },
  { name: "Marcus R.", avatar: "MR", color: "#2172D5", online: true },
  { name: "Chloe W.", avatar: "CW", color: "#6BD495", online: false },
  { name: "Tom A.", avatar: "TA", color: "#FCA501", online: false },
  { name: "Nina W.", avatar: "NW", color: "#2172D5", online: true },
];

function renderMessageText(text: string) {
  const parts = text.split(/(@[\w.]+)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="text-tru-pink font-semibold">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function ChatContent({ bookingId }: { bookingId: string }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [showMembers, setShowMembers] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const mentionNames = groupMembers.map((m) => m.name).filter((n) => !n.includes("Tru.D"));
  const filteredMentions = mentionQuery !== null
    ? mentionNames.filter((n) => n.toLowerCase().includes(mentionQuery.toLowerCase()))
    : [];

  const handleInputChange = (value: string) => {
    setInput(value);
    const atMatch = value.match(/@(\w*)$/);
    if (atMatch) {
      setMentionQuery(atMatch[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (name: string) => {
    const newInput = input.replace(/@\w*$/, `@${name.replace(/\s/g, "")} `);
    setInput(newInput);
    setMentionQuery(null);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      from: user?.name || "You",
      avatar: user?.avatar || "U",
      color: "#FF3F99",
      text: input,
      time: "Just now",
    }]);
    setInput("");
    setMentionQuery(null);
  };

  const onlineCount = groupMembers.filter((m) => m.online).length;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 bg-tru-navy/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 pt-20">
        <Link href={`/member/trip-hub/${bookingId}`} className="text-gray-400 hover:text-white transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm font-heading uppercase truncate">Thailand Island Hopper <span className="text-tru-pink font-normal normal-case">&middot; 12 Apr 2026</span></p>
          <p className="text-gray-400 text-[10px]">{groupMembers.length} members &middot; {onlineCount} online</p>
        </div>
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      {/* Members sidebar */}
      {showMembers && (
        <div className="flex-shrink-0 border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {groupMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
                <div className="relative">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: m.color }}>{m.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-tru-navy ${m.online ? "bg-tru-green" : "bg-gray-600"}`} />
                </div>
                <span className="text-xs text-gray-300">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.from === (user?.name || "You");
          const isBot = (msg as any).isBot;
          return (
            <div key={msg.id} className="flex gap-3">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? "bg-gradient-to-br from-tru-pink to-tru-blue text-lg" : "text-[10px] font-bold text-white"}`} style={!isBot ? { background: msg.color } : undefined}>{msg.avatar}</div>
              <div className="max-w-[80%]">
                <p className="text-[10px] text-gray-500 mb-1">
                  {isBot ? <span className="text-tru-pink font-semibold">Tru.D</span> : isMe ? <span className="text-tru-green font-semibold">{msg.from} (You)</span> : msg.from}
                  {" "}&middot; {msg.time}
                </p>
                <div className={`rounded-[10px] px-4 py-3 ${isBot ? "bg-gradient-to-br from-tru-pink/10 to-tru-blue/10 border border-tru-pink/20" : isMe ? "bg-tru-green/10 border border-tru-green/20" : "bg-white/5 border border-white/10"}`}>
                  <p className="text-gray-200 text-sm leading-relaxed">{renderMessageText(msg.text)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mentions dropdown */}
      {mentionQuery !== null && filteredMentions.length > 0 && (
        <div className="flex-shrink-0 border-t border-white/10 bg-tru-navy/95 backdrop-blur-md px-4 py-2">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1.5 font-heading">Mention someone</p>
          <div className="flex flex-wrap gap-1.5">
            {filteredMentions.map((name, i) => {
              const member = groupMembers.find((m) => m.name === name);
              return (
                <button
                  key={name}
                  onClick={() => insertMention(name)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                    i === mentionIndex ? "bg-tru-pink/20 border border-tru-pink/40 text-white" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <div className="h-5 w-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: member?.color || "#666" }}>{member?.avatar}</div>
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/10 bg-tru-navy/95 backdrop-blur-md px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (mentionQuery !== null && filteredMentions.length > 0) {
                e.preventDefault();
                insertMention(filteredMentions[mentionIndex]);
              } else {
                handleSend();
              }
            } else if (e.key === "ArrowDown" && mentionQuery !== null) {
              e.preventDefault();
              setMentionIndex((prev) => Math.min(prev + 1, filteredMentions.length - 1));
            } else if (e.key === "ArrowUp" && mentionQuery !== null) {
              e.preventDefault();
              setMentionIndex((prev) => Math.max(prev - 1, 0));
            }
          }}
          placeholder="Type @ to mention someone..."
          className="flex-1 bg-white/5 border border-white/10 rounded-[10px] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-tru-pink/50 transition"
        />
        <button
          onClick={handleSend}
          className="rounded-[10px] bg-tru-pink px-5 py-3 text-xs font-semibold text-white hover:bg-tru-pink-light transition uppercase tracking-wider font-heading flex-shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  return (
    <MemberGate>
      <ChatContent bookingId={bookingId} />
    </MemberGate>
  );
}
