/**
 * Shared Claude API utility — routes all calls through the
 * Netlify serverless function so the API key is never exposed
 * in the browser.
 *
 * Usage:
 *   import { callClaude, CLAUDE_MODEL_FAST, CLAUDE_MODEL_SMART } from '../services/claudeApi';
 *
 *   // Fast + cheap — for chatbot, factual Q&A
 *   const text = await callClaude({ system, messages });
 *
 *   // Smart + accurate — for song suggestions, creative tasks
 *   const text = await callClaude({ system, messages, model: CLAUDE_MODEL_SMART });
 */

const CLAUDE_ENDPOINT = '/.netlify/functions/claude';

export const CLAUDE_MODEL_FAST  = 'claude-haiku-4-5-20251001'; // chatbot — fast, cheap
export const CLAUDE_MODEL_SMART = 'claude-sonnet-4-5';          // song suggester — accurate

/**
 * @param {object} options
 * @param {string|object} [options.system]              - System prompt (string or cache-control object)
 * @param {Array}          options.messages             - Conversation messages [{ role, content }]
 * @param {number}        [options.maxTokens=1000]
 * @param {string}        [options.model=CLAUDE_MODEL_FAST] - Override model if needed
 * @returns {Promise<string>} - The assistant's text response
 */
export async function callClaude({ system, messages, maxTokens = 1000, model = CLAUDE_MODEL_FAST }) {
  const body = {
    model,
    max_tokens: maxTokens,
    messages,
  };

  if (system) {
    body.system = typeof system === 'string'
      ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }]
      : system;
  }

  const res = await fetch(CLAUDE_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const statusMessages = {
      400: 'Something went wrong with your message. Please try rephrasing it.',
      401: 'Authentication error. Please contact us on WhatsApp at +919916697933.',
      429: 'Too many requests! Please wait a moment and try again.',
      500: 'Something went wrong on our end. Please try again shortly.',
      503: 'Service temporarily unavailable. Please try again in a moment.',
      529: "We're a little overwhelmed right now. Please try again in a moment!",
    };
    throw new Error(statusMessages[res.status] || `Something went wrong. (${res.status})`);
  }

  const data = await res.json();
  const textBlock = (data.content || []).find(b => b.type === 'text');
  return textBlock?.text || '';
}