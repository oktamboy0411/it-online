import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import { useClassesContext } from "@/context/ClassesContext";

const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

const Schedule = () => {
  const { activeGroups, schedule } = useClassesContext();
  const classes = useMemo(
    () =>
      activeGroups.map((group) => ({
        id: group.id,
        name: `${group.directionName} / ${group.name} guruh`,
        students: group.students.filter((student) => student.status === "active").length,
      })),
    [activeGroups],
  );
  const [activeClass, setActiveClass] = useState(classes[0]?.id || "");
  const selectedClass = classes.find((item) => item.id === activeClass) || classes[0];
  const currentSchedule = schedule[selectedClass?.id || ""] || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap animate-reveal">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setActiveClass(cls.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
              selectedClass?.id === cls.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border text-secondary-foreground hover:bg-secondary"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>{cls.name}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedClass?.id === cls.id ? "bg-primary-foreground/20" : "bg-secondary"
              }`}
            >
              {cls.students}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-reveal animate-reveal-delay-1">
        {classes.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Faol guruhlar mavjud emas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">Vaqt</th>
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
                              <p className="font-medium text-xs text-foreground">{lesson.subject}</p>
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
        )}
      </div>
    </div>
  );
};

export { Schedule };
