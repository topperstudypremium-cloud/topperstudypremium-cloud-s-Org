import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  async summarizeYoutubeVideo(videoUrl: string, youtubeApiKey: string) {
    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) throw new Error("Invalid YouTube URL");

      // 1. Fetch Video Details from YouTube API
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${youtubeApiKey}`
      );
      const videoData = await videoResponse.json();

      if (!videoData.items || videoData.items.length === 0) {
        throw new Error("Video not found");
      }

      const snippet = videoData.items[0].snippet;
      const title = snippet.title;
      const description = snippet.description;

      // 2. Use Gemini to Summarize
      const result = await (ai as any).models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: [{
          role: "user",
          parts: [{
            text: `
              You are an expert educational content summarizer. 
              I want you to summarize a YouTube video based on its title and description.
              
              Video Title: ${title}
              Video Description: ${description}
              
              Please provide:
              1. A concise overview of the video.
              2. Key takeaways (bullet points).
              3. A detailed transcript-style flow of what the video likely covers (based on the description).
              4. Study notes for students.
              
              Format the output nicely in Markdown.
            `
          }]
        }]
      });

      const text = result.text || "";

      return {
        title,
        summary: text,
        videoId,
        thumbnail: snippet.thumbnails.high.url
      };
    } catch (error) {
      console.error("Gemini Service Error:", error);
      throw error;
    }
  },

  async getMotivation(appContext: string, timeSpent: string) {
    try {
      const result = await (ai as any).models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          role: "user",
          parts: [{
            text: `You are a strict but motivating productivity coach. 
            The user is distracted on "${appContext}" and has spent ${timeSpent} on it today.
            Give them a 1-sentence powerful, witty, and grounded motivation in Hindi (Hinglish) to get back to work. 
            Keep it sharp like: "Bhai, reel dekhne se ghar nahi chalega. Wapas kaam pe jao!"`
          }]
        }]
      });
      return result.text || "Wapas kaam pe jao!";
    } catch (error) {
      console.error("Motivation Error:", error);
      return "Focus mode active. get back to work!";
    }
  },

  async analyzeUnlockReason(reason: string) {
    try {
      const result = await (ai as any).models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          role: "user",
          parts: [{
            text: `Analyze if this reason for unlocking a blocked app is valid or just an excuse: "${reason}".
            Respond in JSON format: { "valid": boolean, "response": "string explaining why" }.
            Be strict. Only allow very critical work-related reasons.`
          }]
        }],
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(result.text || '{"valid": false, "response": "No valid reason provided"}');
    } catch (error) {
      return { valid: false, response: "AI engine busy. Focus!" };
    }
  },

  async analyzeAcademicDocuments(subject: string, syllabusNames: string[], paperNames: string[]) {
    try {
      const result = await (ai as any).models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          role: "user",
          parts: [{
            text: `You are an expert academic counselor and AI study bot.
            Data Provided:
            - Subject: ${subject}
            - Syllabus Files: ${syllabusNames.join(', ')}
            - Previous Paper Files: ${paperNames.join(', ')}

            Analyze these files conceptually. 
            1. Identify 5 Most Important Topics (High Weightage).
            2. Suggest a 7-day study plan for this subject.
            3. Common trap questions in this subject's papers.
            4. Expert tips to score 90%+.

            FORMAT YOUR OUTPUT IN BEAUTIFUL MARKDOWN. 
            Use Hinglish for a friendly tone if helpful.`
          }]
        }]
      });
      return result.text || "Unable to analyze documents at this time.";
    } catch (error) {
      console.error("Academic Analysis Error:", error);
      throw error;
    }
  }
};

function extractVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
