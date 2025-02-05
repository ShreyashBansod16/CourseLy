"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/db";

// Define Resource Type 
interface Resource {
  id: string;
  title: string;
  description: string;
  tags: string;
  pdf_url: string;
  created_at: string;
}

// Define Context Type
interface ResourceContextType {
  resources: Resource[]; 
  loading: boolean;
  refreshResources: () => Promise<void>;
}

// Create Context with Default Values
const ResourceContext = createContext<ResourceContextType>({
  resources: [],
  loading: true,
  refreshResources: async () => {},
});

// Provider Component
export const ResourceProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch resources from Supabase
  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resources:", error.message);
    } else {
      setResources(data || []);
    }

    setLoading(false);
  };

  // Function to manually refresh resources
  const refreshResources = async () => {
    await fetchResources();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <ResourceContext.Provider value={{ resources, loading, refreshResources }}>
      {children}
    </ResourceContext.Provider>
  );
};

// Custom hook to use resources
export const useResources = () => useContext(ResourceContext);
