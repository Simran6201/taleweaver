import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2, VolumeX, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

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

export default function StoryModal({ story, onClose }) {
  const [audioActive, setAudioActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(story.content);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Daniel') || 
        voice.name.includes('Male') ||
        voice.lang.startsWith('en')
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
      setAudioActive(true);
      
      utterance.onend = () => {
        setAudioActive(false);
      };
    } else {
      toast.error("Text-to-speech is not supported in your browser");
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setAudioActive(false);
    }
  };

  const deleteStory = async () => {
    setIsDeleting(true);
    try {
      await base44.entities.Story.delete(story.id);
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast.success("Story deleted");
      onClose();
    } catch (error) {
      toast.error("Failed to delete story");
      console.error(error);
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-950 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
            {story.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <Badge variant="outline" className="text-purple-400/70 border-purple-500/30">
              📅 {format(new Date(story.created_date), "MMM d, yyyy")}
            </Badge>
          </div>

          {story.characters && story.characters.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-purple-300 mb-2">Characters:</h4>
              <div className="flex flex-wrap gap-2">
                {story.characters.map((character, index) => (
                  <span key={index} className="text-sm text-purple-200/70 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
                    {character}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="h-[400px] rounded-lg bg-slate-900/30 p-6 border border-purple-500/20">
            <div className="prose prose-invert prose-purple max-w-none">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-purple-100/90 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
            <div className="flex gap-2">
              {audioActive ? (
                <Button
                  onClick={stopAudio}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-900/30"
                >
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop Audio
                </Button>
              ) : (
                <Button
                  onClick={playAudio}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-900/30"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Play Audio
                </Button>
              )}
            </div>

            <Button
              onClick={deleteStory}
              disabled={isDeleting}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-900/30"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Story
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
