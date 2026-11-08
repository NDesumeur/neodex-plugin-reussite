# Réussite (Solitaire)

Classic solitaire (Klondike): sort the 52 cards into the four foundations, from Ace to King, by moving cards between seven columns. Draw one or three cards at a time, undo without limit, and beat your best time.

*Version française : [README.md](README.md)*

## Setup

- Seven **columns** of 1 to 7 cards; only the last card of each is face up.
- The **stock** (top left) holds the rest of the cards.
- Four **foundations** (top right), empty at the start.

## Rules

- **Columns**: a card goes on a card one value higher and of the other colour (a red 7 on a black 8). A properly ordered run of cards can be moved at once. An empty column only accepts a **King**.
- When you move the last face-up card of a column, the one below turns over.
- **Foundations**: from Ace to King, in the same suit (hearts, diamonds, clubs, spades).
- **Stock**: a click turns over one card, or three with the **Draw 3 cards at a time** option (only the top one is playable). When the stock is empty, a click puts the turned cards back.
- You win when all four foundations are complete. As soon as every card is face up, the game finishes by itself.

## Controls

- **Drag** a card (or a run) to where it goes.
- **Click** a card: it moves by itself to the best possible place (a foundation first, otherwise a column).
- **Undo**: takes back the last move, as many times as you like.
- **New game**: a new deal. After a win, a click starts one.

Time and number of moves are shown at the bottom of the screen.

## Statistics

Games won out of games played, and best time.

## Data and sync

Your wins, best time and draw choice are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Réussite → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
