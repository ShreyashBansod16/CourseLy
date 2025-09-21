"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  reply_text?: string | null;
  replied_at?: string | null;
  replied_by?: string | null;
};

export default function MessagesList({ initial }: { initial: AdminMessage[] }) {
  const [items, setItems] = useState<AdminMessage[]>(initial);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const { data: session } = useSession();

  const SafeDateTime = ({ value }: { value: string }) => {
    const [text, setText] = useState<string>(new Date(value).toISOString().replace("T", " ").slice(0, 19));
    useEffect(() => {
      try {
        setText(new Date(value).toLocaleString());
      } catch {}
    }, [value]);
    return <>{text}</>;
  };

  const sendReply = async (id: string) => {
    const res = await fetch("/api/admin/messages/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply_text: replyText, replied_by: session?.user?.email || null }),
    });
    const json = await res.json();
    if (res.ok) {
      setItems((prev) => prev.map((m) => (m.id === id ? { ...m, reply_text: replyText, replied_at: new Date().toISOString(), replied_by: session?.user?.email || null } : m)));
      setReplyOpen(null);
      setReplyText("");
    } else {
      alert(json.error || "Failed to reply");
    }
  };

  return (
    <div className="grid gap-4">
      {items.map((m) => (
        <div key={m.id} className="rounded-xl border p-4 bg-background">
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-semibold">
                {m.name} &lt;{m.email}&gt;
              </p>
              {m.subject && <p className="text-sm text-muted-foreground">{m.subject}</p>}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                <SafeDateTime value={m.created_at} />
              </p>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm mb-3">{m.message}</p>

          {m.reply_text && (
            <div className="rounded border p-3 bg-muted/30 text-sm mb-3">
              <p className="font-medium mb-1">Admin Reply</p>
              <p className="whitespace-pre-wrap">{m.reply_text}</p>
              {m.replied_at && (
                <p className="text-xs text-muted-foreground mt-1">
                  Replied at <SafeDateTime value={m.replied_at} />
                </p>
              )}
            </div>
          )}

          {replyOpen === m.id ? (
            <div className="space-y-2">
              <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." />
              <div className="flex gap-2">
                <Button onClick={() => sendReply(m.id)} disabled={!replyText.trim()}>
                  Send Reply
                </Button>
                <Button variant="outline" onClick={() => setReplyOpen(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setReplyOpen(m.id)}>
                {m.reply_text ? "Edit Reply" : "Reply"}
              </Button>
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
    </div>
  );
}
