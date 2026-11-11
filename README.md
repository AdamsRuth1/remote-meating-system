# RAMS — Remote Army Meeting System

An ultra-modern, high-security command portal built for the **Nigerian Army** to join, schedule, and orchestrate encrypted **Google Meet** video conferences.

---

## ⚡ Features
- **Faithful Tactical UI**: Designed to match the high-command military aesthetic (Nigerian Army crest, dark camouflage hues, tactical radar motifs).
- **One-Click Instant Meet**: Immediate deployment into Google Meet sessions (`https://meet.google.com/new`).
- **Join with Code**: Modal dialog to input and connect directly to room codes.
- **Audio & Video Pre-Flight Toggles**: Interactive preview controls for camera, microphone, screen share, and options.
- **Responsive Layout**: Designed for command monitors, laptops, and field tablets.

---

## 🚀 Pushing to GitHub

To push this repository to your GitHub account:

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `rams-army-meeting-system`).
2. Run the following commands in this directory:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main
git push -u origin main
```

---

## 🌐 Hosting on Vercel

### Method 1: Automatic via GitHub (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import your `rams-army-meeting-system` repository.
3. Framework preset will automatically detect **Vite**.
4. Click **Deploy**. Your site will be live on an official `.vercel.app` URL within seconds!

### Method 2: Deploying via Vercel CLI
If you prefer deploying directly from the command line:

```bash
npx vercel
```
- Authenticate via browser or token when prompted.
- Accept default project settings.
- Run `npx vercel --prod` to deploy to production.
