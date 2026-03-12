from __future__ import annotations

import json
import os
from pathlib import Path

import discord
from discord.ext import commands


BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN", "").strip()
if not BOT_TOKEN:
    raise SystemExit("Missing DISCORD_BOT_TOKEN environment variable.")


MIN_COMMUNITY_MEMBERS = 25
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "communities.json"


intents = discord.Intents.default()
intents.guilds = True

bot = commands.Bot(command_prefix="!", intents=intents)


async def build_invite(guild: discord.Guild) -> str | None:
    me = guild.me
    if me is None:
        return None

    for channel in guild.text_channels:
        permissions = channel.permissions_for(me)
        if not permissions.view_channel or not permissions.create_instant_invite:
            continue

        try:
            invite = await channel.create_invite(
                max_age=0,
                max_uses=0,
                unique=False,
                reason="Export communities for website",
            )
        except discord.HTTPException:
            continue

        return invite.url

    return None


@bot.event
async def on_ready() -> None:
    print(f"Logged in as {bot.user}")

    communities = []
    skipped = []

    for guild in sorted(bot.guilds, key=lambda item: item.member_count or 0, reverse=True):
        if not guild.icon or (guild.member_count or 0) < MIN_COMMUNITY_MEMBERS:
            skipped.append(guild.name)
            continue

        invite_url = await build_invite(guild)
        if not invite_url:
            skipped.append(guild.name)
            continue

        communities.append(
            {
                "id": str(guild.id),
                "name": guild.name,
                "members": guild.member_count or 0,
                "icon": str(guild.icon.url),
                "invite": invite_url,
            }
        )

    with OUTPUT_PATH.open("w", encoding="utf-8") as file:
        json.dump(communities, file, indent=2, ensure_ascii=False)

    print(f"Exported {len(communities)} communities to {OUTPUT_PATH}")
    if skipped:
        print(f"Skipped {len(skipped)} guilds without usable invites.")

    await bot.close()


bot.run(BOT_TOKEN)
