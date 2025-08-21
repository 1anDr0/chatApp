// src/utils/sanitize.js

// 👉 Maxlängd på ett meddelande (enkelt skydd mot superlånga texter)
const MAX_LEN = 1000;

/**
 * stripTags
 * ----------------------------
 * Tar bort ALLA HTML-taggar, t.ex. <b>, <img>, <script> osv.
 * Varför? Vi vill bara spara vanlig text, inte HTML/kod.
 */
const stripTags = (text) => text.replace(/<[^>]*>/g, "");

/**
 * collapseWhitespace
 * ----------------------------
 * Gör om flera mellanslag/radbyten till ETT mellanslag,
 * och tar bort mellanslag i början/slutet.
 */
const collapseWhitespace = (text) => text.replace(/\s+/g, " ").trim();

/**
 * cutToMax
 * ----------------------------
 * Korta ner texten till MAX_LEN tecken (så ingen kan skicka superlånga meddelanden).
 */
const cutToMax = (text, max = MAX_LEN) => text.slice(0, max);

/**
 * sanitizeMessage
 * ----------------------------
 * Huvud-funktionen du importerar i Chat:
 * - Tar bort HTML-taggar
 * - Rensar onödiga mellanrum
 * - Klipper till rimlig längd
 *
 * Användning:
 *   import { sanitizeMessage } from "../utils/sanitize";
 *   const clean = sanitizeMessage(userInput);
 */
export const sanitizeMessage = (input) => {
  if (!input) return "";
  const noTags = stripTags(String(input));
  const compact = collapseWhitespace(noTags);
  const safe = cutToMax(compact);
  return safe;
};
