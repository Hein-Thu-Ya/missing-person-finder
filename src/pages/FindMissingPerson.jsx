import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Search, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

function FindMissingPerson() {
  const [searchTerm, setSearchTerm] = useState("");
  const [missingPeople, setMissingPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMissingPeople();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('missing_people_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'missing_people'
        },
        (payload) => {
          fetchMissingPeople();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMissingPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('missing_people')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissingPeople(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch missing people data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsFound = async (personId) => {
    try {
      const updatedPeople = missingPeople.map((person) =>
        person.id === personId
          ? { ...person, status: 'found', date_found: new Date().toISOString() }
          : person
      );
      setMissingPeople(updatedPeople);

      const { error } = await supabase
        .from('missing_people')
        .update({
          status: 'found',
          date_found: new Date().toISOString()
        })
        .eq('id', personId);

      if (error) throw error;

      toast({
        title: "Person Found",
        description: "The missing person has been marked as found.",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update the status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredPeople = missingPeople.filter((person) =>
    Object.values(person).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Missing Person</h1>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search by name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeople.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={person.status === "found" ? "border-green-500" : ""}>
              {person.image_url && (
                <div className="w-full h-48 relative">
                  <img
                    src={person.image_url}
                    alt={`Photo of ${person.name}`}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{person.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Age: {person.age}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Last Seen:</strong> {person.last_seen}
                  </p>
                  <p>
                    <strong>Description:</strong> {person.description}
                  </p>
                  <p>
                    <strong>Contact:</strong> {person.contact}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reported on: {new Date(person.date_reported).toLocaleDateString()}
                  </p>
                  {person.status === "found" && person.date_found && (
                    <p className="text-sm text-green-600">
                      Found on: {new Date(person.date_found).toLocaleDateString()}
                    </p>
                  )}
                  {person.status === "found" && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center w-20">
                      <CheckCircle2 className="w-4 h-4" />&nbsp;Found
                    </div>
                  )}
                </div>
              </CardContent>
              {person.status !== "found" && (
                <CardFooter>
                  <Button
                    onClick={() => handleMarkAsFound(person.id)}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Found
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
        
        {filteredPeople.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No matching records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindMissingPerson;
