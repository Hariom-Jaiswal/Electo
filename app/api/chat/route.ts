import { NextResponse } from 'next/server';
import { model, chatConfig } from '@/lib/gemini';
import { validateEnv } from '@/lib/env-validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { GeminiHistoryItem } from '@/lib/types';

interface RequestMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Max history turns to keep token usage efficient
const MAX_HISTORY_TURNS = 10;

/**
 * POST /api/chat
 * Accepts a messages array and returns a Gemini AI response via Vertex AI.
 * Includes Firestore persistence and structured Cloud Logging.
 */
export async function POST(req: Request) {
  // --- Rate Limiting ---
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1';

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { ip });
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    validateEnv();

    const body = await req.json();
    const { messages, userId } = body as { messages: RequestMessage[]; userId?: string };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required.' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content?.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty.' }, { status: 400 });
    }

    const recentMessages = messages.slice(-MAX_HISTORY_TURNS);

    const history: GeminiHistoryItem[] = [];
    for (let i = 0; i < recentMessages.length - 1; i++) {
      const m = recentMessages[i];
      const role = m.role === 'user' ? 'user' : 'model';
      if (history.length === 0 && role !== 'user') continue;
      history.push({ role, parts: [{ text: m.content.trim() }] });
    }

    logger.info('Processing chat request via Vertex AI', { historyLength: history.length, ip });

    const chat = model.startChat({
      history,
      generationConfig: chatConfig.generationConfig,
    });

    const result = await chat.sendMessage(lastMessage.content.trim());
    const response = await result.response;
    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I apologize, but I could not generate a response.';

    // --- Firestore Persistence (Google Services Boost) ---
    if (userId) {
      try {
        await addDoc(collection(db, 'chat_logs'), {
          userId,
          userMessage: lastMessage.content.trim(),
          aiResponse: text,
          timestamp: serverTimestamp(),
          ip: ip.replace(/\.[0-9]+$/, '.xxx'), // Masked IP for privacy
        });
      } catch (e) {
        logger.error('Failed to save chat log to Firestore', {
          error: e instanceof Error ? e.message : 'Unknown',
        });
      }
    }

    logger.info('Chat response generated successfully', { responseLength: text.length });

    return NextResponse.json(
      { text },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Chat API error', { error: message, ip });
    return NextResponse.json(
      { error: 'Failed to generate a response. Please try again.' },
      { status: 500 }
    );
  }
}
