import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Users } from "lucide-react";

const classes = [
  { id: "7a", name: "7-A sinf", students: 28 },
  { id: "7b", name: "7-B sinf", students: 26 },
  { id: "8a", name: "8-A sinf", students: 30 },
  { id: "8b", name: "8-B sinf", students: 27 },
  { id: "9a", name: "9-A sinf", students: 25 },
  { id: "9b", name: "9-B sinf", students: 24 },
];

const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];
const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
];

type Lesson = { subject: string; teacher: string };
type DaySchedule = Record<string, Lesson | undefined>;
type ClassSchedule = Record<string, DaySchedule>;

const scheduleByClass: Record<string, ClassSchedule> = {
  "7a": {
    Dushanba: {
      "09:00": { subject: "Python asoslari", teacher: "Kamolov A." },
      "14:00": { subject: "Web dasturlash", teacher: "Rahimova M." },
    },
    Seshanba: { "10:00": { subject: "HTML/CSS", teacher: "Rahimova M." } },
    Chorshanba: {
      "09:00": { subject: "Python (amaliy)", teacher: "Kamolov A." },
    },
    Payshanba: {
      "14:00": { subject: "Web dasturlash", teacher: "Rahimova M." },
    },
    Juma: { "09:00": { subject: "Python (test)", teacher: "Kamolov A." } },
  },
  "7b": {
    Dushanba: {
      "10:00": { subject: "Scratch", teacher: "Nurmatov B." },
      "15:00": { subject: "Algoritmlar", teacher: "Toshmatov J." },
    },
    Seshanba: {
      "09:00": { subject: "Python asoslari", teacher: "Kamolov A." },
    },
    Chorshanba: {
      "14:00": { subject: "Kompyuter savodxonligi", teacher: "Nurmatov B." },
    },
    Payshanba: {
      "10:00": { subject: "Scratch (amaliy)", teacher: "Nurmatov B." },
    },
    Juma: { "11:00": { subject: "Algoritmlar", teacher: "Toshmatov J." } },
  },
  "8a": {
    Dushanba: { "11:00": { subject: "Algoritmlar", teacher: "Toshmatov J." } },
    Seshanba: {
      "14:00": { subject: "Ma'lumotlar bazasi", teacher: "Kamolov A." },
    },
    Chorshanba: { "15:00": { subject: "JavaScript", teacher: "Toshmatov J." } },
    Payshanba: {
      "10:00": { subject: "Algoritmlar", teacher: "Toshmatov J." },
      "16:00": { subject: "Tarmoqlar", teacher: "Nurmatov B." },
    },
    Juma: { "11:00": { subject: "Loyiha ishi", teacher: "Rahimova M." } },
  },
  "8b": {
    Dushanba: { "09:00": { subject: "C++ asoslari", teacher: "Toshmatov J." } },
    Seshanba: {
      "11:00": { subject: "Python (amaliy)", teacher: "Kamolov A." },
      "15:00": { subject: "Tarmoqlar", teacher: "Nurmatov B." },
    },
    Chorshanba: {
      "10:00": { subject: "Ma'lumotlar bazasi", teacher: "Kamolov A." },
    },
    Payshanba: {
      "14:00": { subject: "C++ (amaliy)", teacher: "Toshmatov J." },
    },
    Juma: { "09:00": { subject: "Test", teacher: "Kamolov A." } },
  },
  "9a": {
    Dushanba: {
      "14:00": { subject: "Python (ilg'or)", teacher: "Kamolov A." },
    },
    Seshanba: {
      "09:00": { subject: "Web dasturlash", teacher: "Rahimova M." },
      "14:00": { subject: "Algoritmlar", teacher: "Toshmatov J." },
    },
    Chorshanba: { "11:00": { subject: "Loyiha ishi", teacher: "Rahimova M." } },
    Payshanba: {
      "09:00": { subject: "Kiberhavfsizlik", teacher: "Nurmatov B." },
    },
    Juma: { "14:00": { subject: "Python (amaliy)", teacher: "Kamolov A." } },
  },
  "9b": {
    Dushanba: { "10:00": { subject: "JavaScript", teacher: "Toshmatov J." } },
    Seshanba: {
      "15:00": { subject: "Web dasturlash", teacher: "Rahimova M." },
    },
    Chorshanba: {
      "09:00": { subject: "Algoritmlar", teacher: "Toshmatov J." },
      "14:00": { subject: "Loyiha ishi", teacher: "Rahimova M." },
    },
    Payshanba: {
      "11:00": { subject: "Python (ilg'or)", teacher: "Kamolov A." },
    },
    Juma: {
      "10:00": { subject: "Kiberhavfsizlik", teacher: "Nurmatov B." },
      "15:00": { subject: "Test", teacher: "Toshmatov J." },
    },
  },
};

const Schedule = () => {
  const [activeClass, setActiveClass] = useState("7a");
  const currentSchedule = scheduleByClass[activeClass] || {};

  return (
    <AppLayout title="Jadval">
      <div className="space-y-5">
        {/* Class selector */}
        <div className="flex items-center gap-2 flex-wrap animate-reveal">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setActiveClass(cls.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
                activeClass === cls.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border text-secondary-foreground hover:bg-secondary"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>{cls.name}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeClass === cls.id
                    ? "bg-primary-foreground/20"
                    : "bg-secondary"
                }`}
              >
                {cls.students}
              </span>
            </button>
          ))}
        </div>

        {/* Schedule table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-reveal animate-reveal-delay-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">
                    Vaqt
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[140px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time} className="border-b last:border-0">
                    <td className="px-4 py-3 text-xs font-medium text-muted-foreground tabular-nums">
                      {time}
                    </td>
                    {days.map((day) => {
                      const lesson = currentSchedule[day]?.[time];
                      return (
                        <td key={day} className="px-4 py-2">
                          {lesson ? (
                            <div className="bg-primary/8 border border-primary/15 rounded-lg p-2.5 hover:bg-primary/12 transition-colors">
                              <p className="font-medium text-xs text-foreground">
                                {lesson.subject}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {lesson.teacher}
                              </p>
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export { Schedule };
