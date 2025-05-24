import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Search, Plus, Menu } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Missing Person Finder</span>
          </Link>
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-4">
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
        {/* Mobile menu */}
        {menuOpen && (
          <div className="flex flex-col space-y-2 mt-2 lg:hidden">
            <Link to="/find" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Find
              </Button>
            </Link>
            <Link to="/add" onClick={() => setMenuOpen(false)}>
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Report Missing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
