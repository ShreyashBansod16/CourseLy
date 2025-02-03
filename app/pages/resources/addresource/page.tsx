"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabaseClient"; // Import your Supabase client

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

      console.log("Sending request with:", {
        title,
        description,
        tags,
        pdfUrl,
      });

      // Save resource data to your database
      const response = await fetch("/api/resources", {
        method: "POST",
        //@ts-ignore
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
        console.log(response)
        const data = await response.json();
        // console.log("Resource added:", data);
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
    <div className="pt-10 p-4">
      <div className="max-w-full max-h-[500px] lg:max-w-[1200px] lg:max-h-[800px] mx-auto w-full h-auto rounded-lg border-2 border-gray-300 dark:border-gray-700 p-4 pt-6 lg:p-6 lg:pt-8">

        <h1 className="text-2xl font-bold mb-6">Add Resource</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <input
            type="file"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            accept="application/pdf"
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={addResource}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Loading..." : "Add Resource"}
            </button>
            <button
              onClick={() => router.push("/pages/resources/allresource")}
              className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
