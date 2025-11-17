import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Save, Volume2, VolumeX, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import StoryDisplay from "../components/story/StoryDisplay";
import AudioPlayer from "../components/story/AudioPlayer";

export default function StoryGenerator() {
  const [formData, setFormData] = useState({
    genre: "fantasy",
    setting: "",
    characters: "",
    difficulty: "medium",
    additionalPrompt: "",
  });
  
  const [generatedStory, setGeneratedStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateStory = async () => {
    if (!formData.setting) {
      toast.error("Please provide a setting for your story");
      return;
    }

    setIsGenerating(true);
    setGeneratedStory(null);
    setAudioUrl(null);

    try {
      const characterList = formData.characters
        ? formData.characters.split(",").map(c => c.trim())
        : [];

      const prompt = `You are a master Dungeon Master creating an epic D&D storyline.

Genre: ${formData.genre}
Setting: ${formData.setting}
Characters: ${characterList.length > 0 ? characterList.join(", ") : "Create interesting characters"}
Difficulty: ${formData.difficulty}
Additional context: ${formData.additionalPrompt || "None"}

Create a compelling, immersive storyline that includes:
1. A vivid description of the setting
2. Introduction of key characters with their motivations
3. A clear quest or challenge appropriate for the difficulty level
4. Plot twists and dramatic moments
5. Potential outcomes and story branches

Make it engaging, atmospheric, and ready for a D&D campaign. Write in a dramatic, narrative style that a DM would use. Length: 600-800 words.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
      });

      // Generate a title
      const titlePrompt = `Based on this D&D story, create a short, epic title (3-6 words max):\n\n${result}`;
      const titleResult = await base44.integrations.Core.InvokeLLM({
        prompt: titlePrompt,
      });

      setGeneratedStory({
        title: titleResult.trim().replace(/['"]/g, ""),
        content: result,
        genre: formData.genre,
        setting: formData.setting,
        characters: characterList,
        difficulty: formData.difficulty,
      });

      toast.success("Story generated successfully!");
    } catch (error) {
      toast.error("Failed to generate story. Please try again.");
      console.error(error);
    }

    setIsGenerating(false);
  };

  const generateAudio = async () => {
    if (!generatedStory) return;

    setIsGeneratingAudio(true);
    
    try {
      // Use the browser's Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(generatedStory.content);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Find a suitable voice
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
        setAudioUrl("browser-tts-active");
        toast.success("Audio narration started!");
      } else {
        toast.error("Text-to-speech is not supported in your browser");
      }
    } catch (error) {
      toast.error("Failed to generate audio");
      console.error(error);
    }

    setIsGeneratingAudio(false);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setAudioUrl(null);
      toast.info("Audio stopped");
    }
  };

  const saveStory = async () => {
    if (!generatedStory) return;

    setIsSaving(true);

    try {
      await base44.entities.Story.create({
        ...generatedStory,
        tags: [formData.genre, formData.difficulty],
      });

      toast.success("Story saved to your library!");
    } catch (error) {
      toast.error("Failed to save story");
      console.error(error);
    }

    setIsSaving(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Wand2 className="w-16 h-16 text-purple-400 float-animation" />
              <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-30"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-amber-400 mb-4 glow-text">
            Weave Your Epic Tale
          </h1>
          <p className="text-purple-200/70 text-lg max-w-2xl mx-auto">
            Harness the power of AI to craft immersive D&D storylines. Set the stage, introduce your heroes, and let the magic unfold.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Story Parameters */}
          <Card className="fantasy-card p-6 border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Story Parameters
            </h2>

            <div className="space-y-5">
              <div>
                <Label htmlFor="genre" className="text-purple-200 mb-2 block">Genre</Label>
                <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                  <SelectTrigger className="bg-slate-900/50 border-purple-500/30 text-purple-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fantasy">⚔️ Fantasy</SelectItem>
                    <SelectItem value="sci-fi">🚀 Sci-Fi</SelectItem>
                    <SelectItem value="horror">👻 Horror</SelectItem>
                    <SelectItem value="mystery">🔍 Mystery</SelectItem>
                    <SelectItem value="adventure">🗺️ Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="setting" className="text-purple-200 mb-2 block">Setting *</Label>
                <Input
                  id="setting"
                  placeholder="e.g., Ancient dragon's lair, Haunted castle..."
                  value={formData.setting}
                  onChange={(e) => handleInputChange("setting", e.target.value)}
                  className="bg-slate-900/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/40"
                />
              </div>

              <div>
                <Label htmlFor="characters" className="text-purple-200 mb-2 block">Characters (comma separated)</Label>
                <Input
                  id="characters"
                  placeholder="e.g., Brave knight, Cunning rogue, Wise wizard..."
                  value={formData.characters}
                  onChange={(e) => handleInputChange("characters", e.target.value)}
                  className="bg-slate-900/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/40"
                />
              </div>

              <div>
                <Label htmlFor="difficulty" className="text-purple-200 mb-2 block">Quest Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                  <SelectTrigger className="bg-slate-900/50 border-purple-500/30 text-purple-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🌱 Easy</SelectItem>
                    <SelectItem value="medium">⚡ Medium</SelectItem>
                    <SelectItem value="hard">🔥 Hard</SelectItem>
                    <SelectItem value="legendary">💀 Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="additionalPrompt" className="text-purple-200 mb-2 block">Additional Details (optional)</Label>
                <Textarea
                  id="additionalPrompt"
                  placeholder="Any specific themes, plot points, or elements you'd like included..."
                  value={formData.additionalPrompt}
                  onChange={(e) => handleInputChange("additionalPrompt", e.target.value)}
                  className="bg-slate-900/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/40 min-h-24"
                />
              </div>

              <Button
                onClick={generateStory}
                disabled={isGenerating || !formData.setting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-6 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Weaving Your Tale...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Story
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Generated Story */}
          <Card className="fantasy-card p-6 border-purple-500/20">
            {generatedStory ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-purple-300">Your Epic Tale</h2>
                  <div className="flex gap-2">
                    {audioUrl ? (
                      <Button
                        onClick={stopAudio}
                        variant="outline"
                        size="icon"
                        className="border-purple-500/30 hover:bg-purple-900/30"
                      >
                        <VolumeX className="w-5 h-5 text-purple-400" />
                      </Button>
                    ) : (
                      <Button
                        onClick={generateAudio}
                        disabled={isGeneratingAudio}
                        variant="outline"
                        size="icon"
                        className="border-purple-500/30 hover:bg-purple-900/30"
                      >
                        {isGeneratingAudio ? (
                          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-purple-400" />
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={saveStory}
                      disabled={isSaving}
                      variant="outline"
                      size="icon"
                      className="border-purple-500/30 hover:bg-purple-900/30"
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5 text-purple-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <StoryDisplay story={generatedStory} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-24 h-24 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                  <Sparkles className="w-12 h-12 text-purple-400/50" />
                </div>
                <h3 className="text-xl font-semibold text-purple-300/70 mb-2">
                  Awaiting Your Command
                </h3>
                <p className="text-purple-400/50">
                  Fill in the parameters and generate your epic story
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
