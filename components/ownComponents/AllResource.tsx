'use client';
import { useResources } from "../../app/context/ResourceContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Added for loading state
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added for better card styling

export default function ResourcesList() {
  const { resources, loading, refreshResources } = useResources();

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-1/2 mx-auto" /> {/* Loading title */}
        <Skeleton className="h-10 w-full" /> {/* Loading button */}
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" /> {/* Loading title */}
            <Skeleton className="h-4 w-full mb-2" /> {/* Loading description */}
            <Skeleton className="h-4 w-1/4" /> {/* Loading link */}
          </Card>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Resources</h2>
        <p className="text-muted-foreground">No resources found.</p>
        <Button onClick={refreshResources} className="mt-4 w-full sm:w-auto">
          Refresh Resources
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground text-center mb-6">
        Resources
      </h2>

      <Button
        onClick={refreshResources}
        className="w-full sm:w-auto mb-6 mx-auto block"
      >
        Refresh Resources
      </Button>

      <div className="space-y-4">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {resource.title.toUpperCase()}
              </h3>
              <p className="text-muted-foreground mb-4">{resource.description}</p>
              <a
                href={resource.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                View PDF
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}