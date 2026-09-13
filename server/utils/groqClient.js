import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GROQ_API_KEY;
let groq = null;

if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.trim().length > 0) {
  try {
    groq = new Groq({ apiKey });
    console.log('✅ Groq SDK initialized with provided API key.');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Groq SDK:', err.message);
  }
} else {
  console.log('ℹ️ No GROQ_API_KEY detected in .env. Running with built-in realistic mock/fallback engine for demo reliability.');
}

export const getGroqClient = () => groq;

export const generateWithGroq = async ({ systemPrompt, userPrompt, jsonMode = false, fallbackFn }) => {
  if (groq) {
    try {
      const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: model,
        temperature: 0.7,
        max_tokens: 2048,
        response_format: jsonMode ? { type: 'json_object' } : undefined
      });

      const responseContent = completion.choices[0]?.message?.content || '';
      if (jsonMode) {
        try {
          return JSON.parse(responseContent);
        } catch (parseErr) {
          console.warn('Groq response was not clean JSON, attempting extraction...', parseErr.message);
          const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          throw parseErr;
        }
      }
      return responseContent;
    } catch (apiError) {
      console.error('⚠️ Groq API Error (falling back to smart generator):', apiError.message);
      if (fallbackFn) {
        return fallbackFn();
      }
      throw apiError;
    }
  }

  // If no Groq API key is configured or offline
  if (fallbackFn) {
    return fallbackFn();
  }

  throw new Error('GROQ_API_KEY is not configured and no fallback generator was provided.');
};
