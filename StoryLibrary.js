import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import StoryCard from "../components/story/StoryCard";
import StoryModal from "../components/story/StoryModal";

export default function StoryLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedStory, setSelectedStory] = useState(null);

  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: () => base44.entities.Story.list("-created_date"),
    initialData: [],
  });

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === "all" || story.genre === genreFilter;
    const matchesDifficulty = difficultyFilter === "all" || story.difficulty === difficultyFilter;
    
    return matchesSearch && matchesGenre && matchesDifficulty;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Book className="w-16 h-16 text-purple-400 float-animation" />
              <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-30"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-amber-400 mb-4 glow-text">
            Your Story Library
          </h1>
          <p className="text-purple-200/70 text-lg max-w-2xl mx-auto">
            Browse through your collection of epic tales and adventures
          </p>
        </div>

        {/* Filters */}
        <Card className="fantasy-card p-6 mb-8 border-purple-500/20">
          <div className="flex items-center gap-2 mb-4 text-purple-300 font-semibold">
            <Filter className="w-5 h-5" />
            <span>Filter & Search</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400/50" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/40"
              />
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="bg-slate-900/50 border-purple-500/30 text-purple-100">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="fantasy">⚔️ Fantasy</SelectItem>
                <SelectItem value="sci-fi">🚀 Sci-Fi</SelectItem>
                <SelectItem value="horror">👻 Horror</SelectItem>
                <SelectItem value="mystery">🔍 Mystery</SelectItem>
                <SelectItem value="adventure">🗺️ Adventure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="bg-slate-900/50 border-purple-500/30 text-purple-100">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">🌱 Easy</SelectItem>
                <SelectItem value="medium">⚡ Medium</SelectItem>
                <SelectItem value="hard">🔥 Hard</SelectItem>
                <SelectItem value="legendary">💀 Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="fantasy-card p-6 border-purple-500/20">
                <Skeleton className="h-6 w-3/4 mb-4 bg-purple-900/30" />
                <Skeleton className="h-4 w-full mb-2 bg-purple-900/20" />
                <Skeleton className="h-4 w-full mb-2 bg-purple-900/20" />
                <Skeleton className="h-4 w-2/3 mb-4 bg-purple-900/20" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 bg-purple-900/20" />
                  <Skeleton className="h-6 w-20 bg-purple-900/20" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onClick={() => setSelectedStory(story)}
              />
            ))}
          </div>
        ) : (
          <Card className="fantasy-card p-12 border-purple-500/20">
            <div className="text-center">
              <Book className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-300/70 mb-2">
                No Stories Found
              </h3>
              <p className="text-purple-400/50">
                {searchQuery || genreFilter !== "all" || difficultyFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start creating your first epic tale!"}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
}
