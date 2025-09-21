import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import MessagesList from "@/components/admin/MessagesList";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions as any);
  const isAdmin = (session as any)?.user?.isadmin || (session as any)?.user?.isAdmin;
  if (!session || !isAdmin) {
    redirect("/user/login");
  }

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("id, name, email, subject, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6">Failed to load messages: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
      <MessagesList initial={data || []} />
    </div>
  );
}
