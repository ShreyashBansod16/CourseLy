"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUser();
  const isLoggedIn = !!userData?.email;

  // Prefill when logged in
  useEffect(() => {
    if (userData) {
      setName(userData.name || name);
      setEmail(userData.email || email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const rawResponse = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      if (!rawResponse.ok) {
        const err = await rawResponse.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP error! status: ${rawResponse.status}`);
      }

      const content = await rawResponse.json();

      if (content) {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setResponse("Thank you for your message. Our team will get back to you soon.");
      }
    } catch (error) {
      setResponse((error as Error).message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Contact Us</CardTitle>
          <CardDescription className="text-muted-foreground">
            Get in touch with our support team. We're here to help!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <Textarea
              placeholder="How can we help you?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] resize-none"
              required
            />
            <div className="flex gap-3 items-center">
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !message.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              {isLoggedIn && (
                <Link href="/user/messages" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">View My Messages</Button>
                </Link>
              )}
            </div>
          </form>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex flex-col items-start">
          <CardTitle className="text-lg font-semibold text-foreground mb-2">Response</CardTitle>
          {response ? (
            <Alert className="w-full">
              <AlertTitle className="text-foreground">Support Response</AlertTitle>
              <AlertDescription className="text-muted-foreground">{response}</AlertDescription>
            </Alert>
          ) : (
            <Alert className="w-full">
              <AlertTitle className="text-foreground">Waiting for response</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Our team will respond to your inquiry soon.
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}