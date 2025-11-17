import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scroll, Book, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: "Story Generator", path: createPageUrl("StoryGenerator"), icon: Sparkles },
    { name: "Story Library", path: createPageUrl("StoryLibrary"), icon: Book },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      <style>{`
        :root {
          --primary-purple: #a855f7;
          --primary-gold: #f59e0b;
          --dark-bg: #0f0a1e;
          --card-bg: rgba(30, 20, 50, 0.6);
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }
        
        .fantasy-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          transition: all 0.3s ease;
        }
        
        .fantasy-card:hover {
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-purple-900/30 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to={createPageUrl("StoryGenerator")} className="flex items-center gap-3 group">
              <div className="relative">
                <Scroll className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors float-animation" />
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 glow-text">
                  TaleWeaver
                </h1>
                <p className="text-xs text-purple-300/70">AI Storytelling for D&D</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-purple-900/50 text-purple-300 border border-purple-500/50"
                        : "text-purple-200/70 hover:text-purple-300 hover:bg-purple-900/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-purple-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-purple-900/50 text-purple-300 border border-purple-500/50"
                        : "text-purple-200/70 hover:text-purple-300 hover:bg-purple-900/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Mystical Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 bg-slate-950/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-purple-300/50 text-sm">
            <p>© 2024 TaleWeaver - Crafting Adventures with AI Magic</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
