
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6">Help Find Missing Persons</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Join our community effort to reunite families and find missing loved ones.
          Report missing persons or help in the search.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link to="/find">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            <Search className="mr-2 h-5 w-5" />
            Find Missing Person
          </Button>
        </Link>
        <Link to="/add">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Report Missing Person
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
      >
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Report</h3>
          <p className="text-muted-foreground">
            Quickly submit details about a missing person
          </p>
        </div>
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Search</h3>
          <p className="text-muted-foreground">
            Browse and search through missing person reports
          </p>
        </div>
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Connect</h3>
          <p className="text-muted-foreground">
            Help reunite families with their loved ones
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
