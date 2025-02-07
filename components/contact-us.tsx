"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useUser } from "@/app/context/UserContext"

export default function ContactUs() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { userData } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const userName = userData?.name;
      const userEmail = userData?.email;
      const userId = userData?.id; 
      console.log('fetch started');
      const rawResponse = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,
          id: userId,
          email: userEmail,
          message: message,
        }),
      });
  
      if (!rawResponse.ok) {
        throw new Error(`HTTP error! status: ${rawResponse.status}`);
      }
  
      const content = await rawResponse.json();
  
      if (content) {
        // get mail id here
        // console.log(content);
        setMessage("");
        setResponse("Thank you for your message. Our team will get back to you soon.");
      }
    } catch (error) {
      setResponse("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>Get in touch with our support team</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter>
        <div className="w-full">
          <CardTitle className="mb-2">Response</CardTitle>
          {response ? (
            <Alert>
              <AlertTitle>Support Response</AlertTitle>
              <AlertDescription>{response}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTitle>Waiting for response</AlertTitle>
              <AlertDescription>Our team will respond to your inquiry soon.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

