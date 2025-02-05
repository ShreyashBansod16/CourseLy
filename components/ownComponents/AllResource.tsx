'use client';
import { useResources } from "../../app/context/ResourceContext";
import { Button } from "@/components/ui/button";

export default function ResourcesList() {
  const { resources, loading, refreshResources } = useResources();

  if (loading) return <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading resources...</p>;
  if (resources.length === 0) return <p className="text-center text-lg text-gray-600 dark:text-gray-300">No resources found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="flex flex-row justify-center text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Resources</h2>

      <Button onClick={refreshResources} className="mb-4 w-full">
        Refresh Resources
      </Button>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div 
            key={resource.id} 
            className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 transition-all hover:shadow-lg"
          >
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{resource.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{resource.description}</p>
            <a 
              href={resource.pdf_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline mt-2 inline-block"
            >
              View PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

