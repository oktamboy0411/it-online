
import { useClassesContext } from "@/context/ClassesContext";
import { useNavigate } from "react-router-dom";
import { Archive, FolderOpen, Users } from "lucide-react";

const ArchivePage = () => {
  const { archivedDirections } = useClassesContext();
  const navigate = useNavigate();

  return (
    
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground animate-reveal">
          Faoliyati tugatilgan yo'nalishlar — jami {archivedDirections.length} ta
        </p>

        {archivedDirections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-reveal">
            <Archive className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Arxivda hech qanday yo'nalish yo'q</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archivedDirections.map((dir, i) => {
              const totalStudents = dir.groups.reduce((sum, g) => sum + g.students.length, 0);
              return (
                <div
                  key={dir.id}
                  className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer opacity-75 hover:opacity-100 animate-reveal"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => navigate(`/directions/${dir.id}`)}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{dir.name}</h3>
                      {dir.description && <p className="text-xs text-muted-foreground">{dir.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {dir.groups.length} guruh · {totalStudents} o'quvchi
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Arxivlangan: {dir.archivedAt}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    
  );
};

export { ArchivePage };
