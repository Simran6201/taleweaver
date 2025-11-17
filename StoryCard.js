import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

const difficultyEmoji = {
  easy: "🌱",
  medium: "⚡",
  hard: "🔥",
  legendary: "💀"
};

const genreEmoji = {
  fantasy: "⚔️",
  "sci-fi": "🚀",
  horror: "👻",
  mystery: "🔍",
  adventure: "🗺️"
};

export default function StoryCard({ story, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="fantasy-card p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-purple-500/20"
    >
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-3 line-clamp-2">
        {story.title}
      </h3>

      <p className="text-purple-200/70 text-sm mb-4 line-clamp-3">
        {story.content}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-purple-900/50 text-purple-200 border-purple-500/30 text-xs">
          {genreEmoji[story.genre]} {story.genre}
        </Badge>
        <Badge className="bg-purple-900/50 text-purple-200 border-purple-500/30 text-xs">
          {difficultyEmoji[story.difficulty]} {story.difficulty}
        </Badge>
      </div>

      {story.setting && (
        <div className="text-xs text-purple-300/60 mb-3">
          📍 {story.setting}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-purple-400/50">
        <Calendar className="w-3 h-3" />
        <span>{format(new Date(story.created_date), "MMM d, yyyy")}</span>
      </div>
    </Card>
  );
}
