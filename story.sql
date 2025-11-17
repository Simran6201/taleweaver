{
  "name": "Story",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the story"
    },
    "content": {
      "type": "string",
      "description": "The generated story content"
    },
    "genre": {
      "type": "string",
      "enum": [
        "fantasy",
        "sci-fi",
        "horror",
        "mystery",
        "adventure"
      ],
      "default": "fantasy",
      "description": "Story genre"
    },
    "setting": {
      "type": "string",
      "description": "Story setting (e.g., Medieval Castle, Dark Forest)"
    },
    "characters": {
      "type": "array",
      "description": "Main characters in the story",
      "items": {
        "type": "string"
      }
    },
    "difficulty": {
      "type": "string",
      "enum": [
        "easy",
        "medium",
        "hard",
        "legendary"
      ],
      "default": "medium",
      "description": "Quest difficulty level"
    },
    "audio_url": {
      "type": "string",
      "description": "URL to the text-to-speech audio file"
    },
    "tags": {
      "type": "array",
      "description": "Story tags",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "title",
    "content"
  ]
}
