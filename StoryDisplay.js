import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function StoryDisplay({ story }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-3">
          {story.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-purple-900/50 text-purple-200 border-purple-500/30">
            {genreEmoji[story.genre]} {story.genre}
          </Badge>
          <Badge className="bg-purple-900/50 text-purple-200 border-purple-500/30">
            {difficultyEmoji[story.difficulty]} {story.difficulty}
          </Badge>
          {story.setting && (
            <Badge className="bg-purple-900/50 text-purple-200 border-purple-500/30">
              📍 {story.setting}
            </Badge>
          )}
        </div>
      </div>

      {story.characters && story.characters.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-purple-300 mb-2">Characters:</h4>
          <div className="flex flex-wrap gap-2">
            {story.characters.map((character, index) => (
              <span key={index} className="text-sm text-purple-200/70 bg-purple-900/30 px-2 py-1 rounded">
                {character}
              </span>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="h-[400px] rounded-lg bg-slate-900/30 p-4 border border-purple-500/20">
        <div className="prose prose-invert prose-purple max-w-none">
          {story.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-purple-100/90 leading-relaxed mb-4 text-sm">
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
