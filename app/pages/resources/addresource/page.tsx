"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function AddResource() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to upload PDF to Supabase
  const uploadPdfToSupabase = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("pdfs") // Bucket name
      .upload(`${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("pdfs").getPublicUrl(file.name);
    return publicUrl;
  };

  const addResource = async () => {
    if (!title || !description || !pdf) {
      setError("Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      // Upload the PDF and get its public URL
      const pdfUrl = await uploadPdfToSupabase(pdf);

      // Save resource data to your database
      const response = await fetch("/api/resources", {
        method: "POST",
        // @ts-ignore
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          title,
          description,
          tags,
          pdfUrl, // Uploaded file URL from Supabase storage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push("/pages/resources/allresource"); // Navigate to resources page
      } else {
        setError("Failed to add resource");
      }
    } catch (error) {
      console.error("Error uploading resource:", error);
      setError("Failed to upload resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Add Resource</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf" className="text-foreground">
              Upload PDF
            </Label>
            <Input
              id="pdf"
              type="file"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
              accept="application/pdf"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-foreground">
              Tags
            </Label>
            <Input
              id="tags"
              type="text"
              placeholder="Enter tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/pages/resources/allresource")}
          >
            Cancel
          </Button>
          <Button onClick={addResource} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Resource"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}