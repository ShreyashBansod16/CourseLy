import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function UserMessagesPage() {
  const session = await getServerSession(authOptions as any);
  const email = (session as any)?.user?.email as string | undefined;
  if (!session || !email) {
    redirect("/user/login");
  }

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("id, name, email, subject, message, reply_text, replied_at, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6">Failed to load your messages: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Support Messages</h1>
      <div className="grid gap-4">
        {(data || []).map((m) => (
          <div key={m.id} className="rounded-xl border p-4 bg-background">
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{m.subject || "No Subject"}</p>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">You wrote:</p>
              <p className="whitespace-pre-wrap text-sm">{m.message}</p>
            </div>
            {m.reply_text ? (
              <div className="rounded border p-3 bg-muted/30 text-sm">
                <p className="font-medium mb-1">Our Reply</p>
                <p className="whitespace-pre-wrap">{m.reply_text}</p>
                {m.replied_at && (
                  <p className="text-xs text-muted-foreground mt-1">Replied at {new Date(m.replied_at).toLocaleString()}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reply yet. We will get back to you soon.</p>
            )}
          </div>
        ))}
        {data?.length === 0 && <p className="text-muted-foreground">You have not submitted any messages yet.</p>}
      </div>
    </div>
  );
}
