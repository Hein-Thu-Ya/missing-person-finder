
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Search, Plus } from "lucide-react";

function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Missing Person Finder</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/find">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Find
              </Button>
            </Link>
            <Link to="/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Report Missing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
