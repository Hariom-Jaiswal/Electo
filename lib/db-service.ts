/**
 * Firestore Database Service.
 * Handles persistence for chat sessions and user-specific election data.
 */
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type FieldValue,
} from 'firebase/firestore';
import type { Message } from './types';
import { logger } from './logger';

/** Represents a persisted chat session in Firestore. */
export interface ChatSession {
  /** The Firebase Auth UID of the owner. */
  userId: string;
  /** Array of message objects from the conversation history. */
  messages: Message[];
  /** Firestore server timestamp of creation. */
  createdAt: FieldValue;
  /** Firestore server timestamp of last update. */
  updatedAt: FieldValue;
}

/**
 * Persists a new chat session to Firestore.
 * @param userId - The unique identifier of the user.
 * @param messages - The message history to save.
 * @returns The generated document ID or null on failure.
 */
export const saveChatSession = async (
  userId: string,
  messages: Message[]
): Promise<string | null> => {
  try {
    const sessionsRef = collection(db, 'sessions');
    const docRef = await addDoc(sessionsRef, {
      userId,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(), // Firestore doesn't support Date objects in nested arrays natively
      })),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    logger.info('Chat session saved to Firestore', { sessionId: docRef.id, userId });
    return docRef.id;
  } catch (error) {
    logger.error('Error saving session to Firestore', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
    });
    return null;
  }
};

interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface PersistedSession extends Omit<ChatSession, 'messages'> {
  id: string;
  messages: StoredMessage[];
}

/**
 * Retrieves all chat sessions for a specific user, ordered by most recent.
 * @param userId - The unique identifier of the user.
 * @returns An array of session objects including their document IDs.
 */
export const getUserSessions = async (userId: string): Promise<PersistedSession[]> => {
  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error('Error fetching sessions from Firestore', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
    });
    return [];
  }
};
