import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Send, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const messages = [
  { id: 1, sender: "Kamolov A. (O'qituvchi)", text: "Assalomu alaykum! Bugun Python'da funksiyalar mavzusini ko'rib chiqamiz.", time: "14:00", isTeacher: true },
  { id: 2, sender: "Sardor Aliyev", text: "Vaalaykum assalom, ustoz!", time: "14:01", isTeacher: false },
  { id: 3, sender: "Dilnoza Karimova", text: "Tayyor, kutib turibmiz!", time: "14:01", isTeacher: false },
  { id: 4, sender: "Kamolov A. (O'qituvchi)", text: "Funksiya — bu qayta foydalanish mumkin bo'lgan kod bloki. Keling, misol ko'raylik:", time: "14:02", isTeacher: true },
  { id: 5, sender: "Kamolov A. (O'qituvchi)", text: "def salomlash(ism):\n    print(f'Salom, {ism}!')\n\nsalomlash('Sardor')", time: "14:03", isTeacher: true },
  { id: 6, sender: "Javohir Toshmatov", text: "Ustoz, funksiyaga bir nechta argument bersa bo'ladimi?", time: "14:05", isTeacher: false },
  { id: 7, sender: "Kamolov A. (O'qituvchi)", text: "Ha, albatta! *args va **kwargs haqida keyingi darsda batafsil gaplashamiz.", time: "14:06", isTeacher: true },
];

const participants = [
  { name: "Kamolov A.", role: "O'qituvchi", online: true },
  { name: "Sardor Aliyev", role: "O'quvchi", online: true },
  { name: "Dilnoza Karimova", role: "O'quvchi", online: true },
  { name: "Javohir Toshmatov", role: "O'quvchi", online: true },
  { name: "Malika Raximova", role: "O'quvchi", online: false },
];

const LiveClass = () => {
  const [input, setInput] = useState("");

  return (
    <AppLayout title="Jonli dars">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
        {/* Chat area */}
        <div className="lg:col-span-3 bg-card rounded-xl border shadow-sm flex flex-col animate-reveal">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-success" />
              <span className="font-medium text-sm">Python: Funksiyalar</span>
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">Jonli</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isTeacher ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                    msg.isTeacher
                      ? "bg-secondary"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className={`text-xs font-medium mb-1 ${msg.isTeacher ? "text-primary" : "opacity-80"}`}>
                    {msg.sender}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-1 tabular-nums ${msg.isTeacher ? "text-muted-foreground" : "opacity-60"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Xabar yozing..."
                className="flex-1 h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="icon" className="shrink-0 active:scale-95 transition-transform">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-card rounded-xl border shadow-sm p-4 animate-reveal animate-reveal-delay-1">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Ishtirokchilar ({participants.length})</span>
          </div>
          <div className="space-y-2.5">
            {participants.map((p) => (
              <div key={p.name} className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${p.online ? "bg-success" : "bg-muted-foreground/40"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LiveClass;
