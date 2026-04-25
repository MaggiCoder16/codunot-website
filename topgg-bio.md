# 🤖 Codunot AI — The Ultimate Comprehensive Guide

Welcome to the absolute, exhaustive documentation for **Codunot AI**. This guide covers every slash command, parameter, configuration option, hidden trick, and feature currently available.

---

## 🔗 Official Links & Resources
*   **Website:** [https://codunot.app](https://codunot.app)
*   **Support Server:** [https://discord.gg/GVuFk5gxtW](https://discord.gg/GVuFk5gxtW)
*   **Top.gg Vote Page:** [https://top.gg/bot/1435987186502733878/vote](https://top.gg/bot/1435987186502733878/vote)
*   **Premium Upgrades:** [https://codunot.app/premium/](https://codunot.app/premium/)
*   **Terms of Service:** [https://codunot.app/terms](https://codunot.app/terms)
*   **Privacy Policy:** [https://codunot.app/privacy/](https://codunot.app/privacy/)

---

## 🧠 1. AI Personas, Modes & Models

Codunot is not a static bot; it has multiple personalities and underlying AI brains.

### 🎭 Personality Modes
Changes how the bot responds. Can be triggered via Slash or Prefix (`!`).

| Command | Name | Description / Behavior |
| :--- | :--- | :--- |
| `/funmode` | Fun Mode (Default) | Playful, witty, Gen-Z vibe. Uses emojis and matches user energy. |
| `/seriousmode` | Serious Mode | Clean, fact-based, professional. Best for coding, homework, and research. |
| `/roastmode` | Roast Mode | Savage, high-energy burns. Will roast you or whoever you mention. |
| `/teachmerizz online` | Rizz Coach (Online) | Social coaching for DMs, texting, and dating apps. Send screenshots of chats. |
| `/teachmerizz irl` | Rizz Coach (IRL) | **(Premium, Gold, and Enterprise only)** Social coaching for real-life approaches and reading body language. |
| `/chessmode` | Chess Mode | Play a live game of Chess. You are White, Bot is Black. Use algebraic notation (e.g., `e4`). |

### 🧠 Model Switching
Swap the actual LLM powering the bot. Changes are saved per-channel/DM.
*   **`/models`** — Lists all currently available AI models.
*   **`/model`** — Changes the active model. Wipes the channel's short-term memory (max 10-15 messages) for a fresh start.
    *   **Parameters:** `model` (Choices: *Llama 4 Scout 17B (Default, required for Vision), GPT-OSS-120B, CoduChat V1 (`groq/compound-mini`), CoduChat V2 (`groq/compound`), Allam 2 7B, Qwen3 32B, Llama 3.3 70B, Llama 3.1 8B*).

---

## 💬 2. General Chat, Tools & Roleplay

### Everyday Tools
*   **Natural Chat:** Mention the bot `@Codunot AI [message]` in servers, or type normally in DMs.
*   **File Reading:** Upload `.txt`, `.pdf`, or `.docx` files. The bot will read them and answer your questions.
*   **Reply Context:** If you reply to a message and ping Codunot, it reads the original message for context.
*   **`/helpc`** — Interactive GUI Help Panel explaining modules and tiers.
*   **`/shard`** — Shows current Server Shard ID, Total Shards, and server member count.
*   **`/browse`** — Fetches, parses, and summarizes the readable text of any webpage.
*   **`/test_code`** — Opens a modal to paste Python code. Runs it in an isolated sandbox and returns stdout/errors.
*   **`/image_search`** — Searches Wikimedia Commons and Openverse for open-source images.
*   **`/customise_bot_profile`** — **(Gold and Enterprise only)** Allows server owners to dynamically change the bot's nickname and avatar globally.

### Action & Roleplay Commands
*   **`/hug`**, **`/kiss`**, **`/kick`**, **`/slap`**, **`/wish_goodmorning`**
*   **`/bet`** — Bet heads/tails and flip a virtual coin.
*   **`/meme`** — Sends a random relatable/funny meme.

---

## 🎨 3. AI Media & Vision (Vote Required)

These commands consume your attachment quota.

*   **`/generate_image`** — Generate an image from a prompt.
*   **`/edit_image`** — Edit uploaded images using instructions.
*   **`/analyse_image`** — Ask questions about an image.
*   **`/merge_image`** — Blend 2 to 4 images together.
*   **`/generate_video`** — Generate a cinematic AI video.
*   **`/transcribe`** — Transcribe supported video URLs (up to 30 minutes).
*   **`/generate_tts`** — Generate an `.mp3` voiceover with language and voice selection.

---

## 🎵 4. Advanced Music System

Powered by redundant Lavalink nodes and tier-based bitrate.

### Playback & Queue
*   **`/play`**, **`/stop`**, **`/skip`**, **`/queue`**, **`/history`**, **`/nowplaying`**, **`/volume`**, **`/remove`**, **`/shuffle`**, **`/loop`**, **`/autoplay`**, **`/lyrics`**, **`/bitrate`**

### Audio Filters *(Vote Required)*
*   **`/bassboost`**, **`/nightcore`**, **`/slow`**, **`/eightd`**, **`/treble`**, **`/lofi`**, **`/vaporwave`**, **`/resetfilters`**

### Server Playlists
*   **`/playlistcreate`** — Create and save playlists.
*   **`/playlist`** — Open playlist browser (play/add/delete).

---

## 🛡️ 5. Moderation, AutoMod & Security

### Standard Mod Commands
*   **`/warn`**, **`/warns`**, **`/clearwarns`**, **`/modkick`**, **`/ban`**, **`/unban`**, **`/mute`**, **`/unmute`**, **`/clear`**, **`/clear_all`**, **`/lock`**, **`/unlock`**, **`/slowmode`**, **`/userinfo`**, **`/case`**

### Advanced Mod Commands (Premium+)
*   **`/tempban`**, **`/massban`**, **`/modstats`**, **`/note add/view/clear`**, **`/shadowban add/remove/list`**, **`/sticky set/clear/list`**, **`/adaptive-slowmode`**

### AutoMod Setup
*   **`/setup-moderation`** — Interactive setup wizard.
*   **`/automod`** — Quick enable/disable toggle.
*   **Enterprise AI AutoMod** — Context-aware moderation logic.

---

## 🎟️ 6. Ticketing & Server Config

*   **`/configure server`**, **`/configure channels`**
*   **`/ticketing-setup`** for staff role, panel channel, logging channel, categories, and requirements prompt.
*   In-ticket features include Close Ticket, Priority Queue, Show Queue, and Claim Ticket (tier-dependent).

---

## 💎 7. Tiers & Limits

*   **Basic (Free):** 50 chat messages/day, limited attachments and lower bitrate.
*   **Premium:** Unlimited chat, higher quotas, and advanced moderation/ticketing.
*   **Gold:** Includes Premium + more moderation controls + customization.
*   **Enterprise:** Highest limits, AI AutoMod, and custom requirements.

---

## 🗳️ 8. Top.gg Voting Unlocks

Voting unlocks media/music features for 12 hours:
* `/generate_image`, `/edit_image`, `/merge_image`, `/analyse_image`, `/generate_video`, `/generate_tts`, `/transcribe`, `/play`, and audio filters.

---

*End of Documentation.*
