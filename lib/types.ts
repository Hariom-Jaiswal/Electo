/**
 * Shared TypeScript interfaces used across both the client and server.
 * Centralizing types here prevents duplication and ensures consistency.
 */

/** A single message in the chat conversation. */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/** The shape Gemini expects for chat history entries. */
export interface GeminiHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}
