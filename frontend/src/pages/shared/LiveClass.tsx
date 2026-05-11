import { useState } from "react";
import { Send, Users, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClassesContext } from "@/context/ClassesContext";

const LiveClass = () => {
  const [input, setInput] = useState("");
  const { liveClass, sendLiveMessage } = useClassesContext();

  const handleSend = () => {
    if (!input.trim()) return;
    sendLiveMessage(input.trim());
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-3 bg-card rounded-xl border shadow-sm flex flex-col animate-reveal">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-success" />
            <span className="font-medium text-sm">{liveClass.title}</span>
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success font-medium">Jonli</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {liveClass.messages.map((message) => (
            <div key={message.id} className={`flex ${message.isTeacher ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                  message.isTeacher ? "bg-secondary" : "bg-primary text-primary-foreground"
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${message.isTeacher ? "text-primary" : "opacity-80"}`}>
                  {message.sender}
                </p>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-[10px] mt-1 tabular-nums ${message.isTeacher ? "text-muted-foreground" : "opacity-60"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              placeholder="Xabar yozing..."
              className="flex-1 h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button size="icon" className="shrink-0 active:scale-95 transition-transform" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-4 animate-reveal animate-reveal-delay-1">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Ishtirokchilar ({liveClass.participants.length})</span>
        </div>
        <div className="space-y-2.5">
          {liveClass.participants.map((participant) => (
            <div key={participant.name} className="flex items-center gap-2.5">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                  {participant.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                    participant.online ? "bg-success" : "bg-muted-foreground/40"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">{participant.name}</p>
                <p className="text-[11px] text-muted-foreground">{participant.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { LiveClass };
