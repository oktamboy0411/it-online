import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, UserMinus, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const { toast } = useToast();
  const [studentTab, setStudentTab] = useState<"active" | "inactive">("active");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  const { data: cls } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: classStudents = [] } = useQuery({
    queryKey: ["class-students", id, studentTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_students")
        .select("*, profiles!class_students_student_id_fkey(full_name, phone)")
        .eq("class_id", id!)
        .eq("is_active", studentTab === "active")
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addStudentMutation = useMutation({
    mutationFn: async () => {
      // Find user by email
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", (await supabase.rpc("get_user_id_by_email" as any, { email: studentEmail })).data)
        .maybeSingle();

      // Simplified: try to find by looking up profiles
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name");
      const match = profiles?.find((p: any) => p.full_name?.toLowerCase().includes(studentEmail.toLowerCase()));
      if (!match) throw new Error("O'quvchi topilmadi");

      const { error } = await supabase.from("class_students").insert({
        class_id: id!,
        student_id: match.user_id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-students", id] });
      setDialogOpen(false);
      setStudentEmail("");
      toast({ title: "O'quvchi qo'shildi" });
    },
    onError: (err: any) => {
      toast({ title: "Xatolik", description: err.message, variant: "destructive" });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from("class_students")
        .update({ is_active: false, left_at: new Date().toISOString() })
        .eq("class_id", id!)
        .eq("student_id", studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-students", id] });
      toast({ title: "O'quvchi faoliyati tugatildi" });
    },
  });

  const canManage = role === "admin" || role === "teacher";

  if (!cls) {
    return (
      <AppLayout title="Sinf">
        <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      </AppLayout>
    );
  }

  const activeCount = classStudents.filter((s: any) => studentTab === "active").length;

  return (
    <AppLayout title={cls.name}>
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-reveal">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/classes")} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold text-foreground">{cls.name}</h2>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
            <button
              onClick={() => setStudentTab("active")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                studentTab === "active" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Faol o'quvchilar
            </button>
            <button
              onClick={() => setStudentTab("inactive")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                studentTab === "inactive" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tugatilganlar
            </button>
          </div>
          {canManage && studentTab === "active" && (
            <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> O'quvchi qo'shish
            </Button>
          )}
        </div>

        {/* Students table */}
        {classStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-xl border">
            <Users className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">{studentTab === "active" ? "Faol o'quvchilar yo'q" : "Tugatilganlar yo'q"}</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ism</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Telefon</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Qo'shilgan</th>
                  {studentTab === "inactive" && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ketgan sana</th>}
                  {canManage && studentTab === "active" && <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amal</th>}
                </tr>
              </thead>
              <tbody>
                {classStudents.map((cs: any, i: number) => (
                  <tr key={cs.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{cs.profiles?.full_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cs.profiles?.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(cs.joined_at).toLocaleDateString("uz")}</td>
                    {studentTab === "inactive" && <td className="px-4 py-3 text-muted-foreground">{cs.left_at ? new Date(cs.left_at).toLocaleDateString("uz") : "—"}</td>}
                    {canManage && studentTab === "active" && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deactivateMutation.mutate(cs.student_id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Faoliyatini tugatish"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>O'quvchi qo'shish</DialogTitle>
              <DialogDescription>O'quvchi ismini kiriting</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>O'quvchi ismi</Label>
                <Input value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="Ismni kiriting" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={() => addStudentMutation.mutate()} disabled={!studentEmail.trim() || addStudentMutation.isPending}>Qo'shish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ClassDetail;
