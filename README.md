# Life OS — Mohamad's Personal Command Center

A world-class life management system hosted free on GitHub Pages, with data synced globally via a private GitHub Gist. Open it from any device, anywhere in the world — your data follows you.

**Live URL (after setup):** `https://mohamad-elcharif.github.io/life-os`

---

## 🚀 One-Time Setup (takes ~5 minutes)

### Step 1 — Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: **`life-os`** (must match exactly)
3. Set to **Public** *(GitHub Pages requires public on free plan)*
4. Check **"Add a README file"**
5. Click **Create repository**

---

### Step 2 — Upload the App File

1. In your new repo, click **"uploading an existing file"** (or drag & drop)
2. Upload the **`index.html`** file from this folder
3. Commit message: `Initial deploy`
4. Click **Commit changes**

---

### Step 3 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: **`main`** / Folder: **`/ (root)`**
4. Click **Save**
5. Wait ~60 seconds — your site is live at `https://mohamad-elcharif.github.io/life-os`

---

### Step 4 — Create a Personal Access Token (for data sync)

This token lets the app save your data to a private GitHub Gist — like a tiny private database that lives in your GitHub account.

1. Go to [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Note: **"Life OS sync token"**
3. Expiration: **No expiration** (or 1 year if you prefer)
4. Scopes: tick **`gist`** only — nothing else needed
5. Click **Generate token**
6. **Copy the token** (starts with `ghp_`) — you won't see it again

---

### Step 5 — First Launch

1. Open `https://mohamad-elcharif.github.io/life-os` in any browser
2. Paste your token into the setup screen
3. Click **Connect & Launch**
4. Done — your data is now stored in a private Gist and syncs automatically

**The token is stored only in that browser's `localStorage`.** It is never sent anywhere except `api.github.com`. On a new device, you'll paste the token once again and it reconnects to the same Gist instantly.

---

## 📱 Using on Phone / Other Devices

1. Open the URL on your phone
2. Paste your PAT token when prompted (do this once per browser)
3. On iOS Safari: tap **Share → Add to Home Screen** for a native app feel
4. On Android Chrome: tap **⋮ → Add to Home Screen**

---

## 🔄 How Sync Works

| Event | Action |
|-------|--------|
| You add/edit/delete anything | App waits 2.5s, then pushes to Gist |
| You click "↻ Sync" | Full pull + push |
| Every 60 seconds | Auto-pull (catches changes from other devices) |
| You open the app | Immediate pull from Gist |

The sync dot in the sidebar tells you the status:
- 🟡 Syncing...
- 🟢 Synced (shows last sync time)
- 🔴 Error (check your token)

---

## 🗂 What's Tracked

| Section | What you can log |
|---------|-----------------|
| **Tasks** | Text, area, priority, bucket (Today/Upcoming/Backlog), due date, notes |
| **Habits** | Daily check-ins, streaks, 28-day heatmap, analytics |
| **Focus** | Pomodoro timer (25/50/90min), session logging, daily total |
| **Health** | Steps, sleep, water, calories, energy, weight, notes |
| **Journal** | Mood, energy score, free-write, gratitude |
| **Goals** | Title, area, target date, success metric, your why, progress % |
| **Projects** | Name, status, description, next action, progress, due date |
| **Finance** | Income, expenses, savings, investments, spending breakdown |

Everything has a **✎ Edit** button and a **🗑 Delete** button via the edit modal.

---

## 💾 Your Data

Your data lives as a **private JSON file** inside a private GitHub Gist at:
`https://gist.github.com/mohamad-elcharif`

You can view it directly there anytime. It's plain JSON — you own it completely. To export: go to your Gist → copy the `life-os.json` file content.

---

## 🔧 Updating the App

When a new version of `index.html` is available:
1. Go to your repo on GitHub
2. Click on `index.html` → click the ✏️ pencil edit icon
3. Delete everything and paste the new content
4. Click **Commit changes**
5. Wait ~30s and refresh — done. Your data is untouched (it's in the Gist, not the HTML).

---

## 🛡 Security Notes

- Your PAT is stored in `localStorage` of the browser — not in the HTML, not on any server
- The Gist is **private** — not visible to anyone else
- The PAT only has `gist` scope — it cannot access your code, profile, or anything else
- To revoke access: delete the token at [github.com/settings/tokens](https://github.com/settings/tokens)

---

## ❓ Troubleshooting

**"Sync failed" / red dot**
- Check your token is correct (Settings → paste it again)
- Ensure the token has `gist` scope
- Token may have expired — generate a new one

**Data not showing on another device**
- Paste your PAT on that device first
- Click "↻ Sync" to force a pull

**Want to reset everything**
- Settings → "Reset Everything" (clears localStorage only)
- Your Gist data is untouched — re-connecting will pull it back

---

*Built for Mohamad · Hosted on GitHub Pages · Data on GitHub Gist · Zero monthly cost*
