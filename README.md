# 🚀 ReferralFlow — A Smart Widget for Referral Outreach

**Built by Aditi Sahu**  
**Submission for the alfred_ Founding Intern Challenge**  
Challenge Prompt: “Build a widget for 1 customer that transforms their workflow.”

---

## 👋 Challenge Context (Why I Built This)

This take-home challenge asked me to:

- Identify a specific customer archetype
- Build a widget that transforms their daily workflow
- Demonstrate strategic product thinking, not just frontend skills

---

## 🧠 Customer Analysis & Strategic Thinking

### 🎯 Target Customer

**Who they are:**  
Early-career professionals (students, recent grads, or career switchers) applying to competitive tech jobs. These users are often reaching out for referrals on LinkedIn to get their foot in the door.

**What their workflow looks like:**
- Search for current employees at target companies
- Send connection requests and wait for acceptance
- Craft referral messages (often reused or improvised)
- Track responses using spreadsheets or memory
- Forget who replied, who ghosted, and who promised to refer
- Juggle job links, DMs, reminders, and follow-up tasks

**Information they constantly rely on:**
- Who they contacted  
- Whether they responded  
- Referral status  
- What message was sent  
- Which job they want a referral for

**What slows them down:**
- Manual tracking of outreach stages  
- Rewriting the same messages  
- Forgetting follow-up timing  
- Disorganized data across tools

**Tools they cobble together:**
- Google Sheets / Excel  
- LinkedIn DMs  
- Notion or Airtable  
- Reminders app / sticky notes

---

### 🧩 The Perfect Widget

**ReferralFlow** is a referral-specific outreach tracker built to model and support this exact workflow.

What it includes:

🧾 Add/edit/delete contacts with name, company, stage, status, tags, and contact details

🏷 Tagging system for prioritization (e.g., “SJSU Alum”, “Tech Lead”)

🎨 Color-coded badges for referral stage and status for visual clarity

🔍 Filtering by name, company, tag, referral status, and stage

✨ Framer Motion animations for responsive, delightful UI interactions

🔒 Encrypted localStorage to protect user data during browser-based use

💾 Local persistence (no backend required — privacy-first by default)

📱 Fully responsive UI with mobile-first design

🚀 Deployed live via Vercel for fast access and sharing

---

## ✅ Why ReferralFlow Works

ReferralFlow isn’t just a form — it’s a lightweight CRM that reflects **what users actually do** and helps them take action.

- 💡 **Interactive**: Users flow through stages, not just static lists  
- 👀 **Visual**: Color badges, tag chips, and filters clarify complex outreach  
- 🧠 **Behavior-aligned**: Tracks how users already manage referrals (DMs, tagging, reminders)  
- 🎯 **Action-oriented**: Encourages follow-ups and updates by design  
- 🤝 **Supportive**: Notifications, animations, and persistence make it intuitive and responsive  

> ReferralFlow doesn’t just store contacts. It helps users work through their referral strategy — visually, flexibly, and intentionally.

---

### 📉 What Alternatives Exist — and Why They Fall Short

| Tool                | Why it falls short |
|---------------------|--------------------|
| **Google Sheets**   | No status tags, stages, templates, or filtering |
| **Notion / Airtable** | Too generic, requires setup, no structure for referrals |
| **Huntr / Teal**    | Built for job applications, not referral pipelines |
| **LinkedIn DMs**    | Conversations are buried and hard to track |

---

✅ Why ReferralFlow Works
ReferralFlow isn’t just a tracker — it’s a tool that drives action and mirrors how job seekers really manage outreach.

💡 Interactive: Users move through stages, not just fill fields. Editing, filtering, and tagging are seamless.

👀 Visual: Color-coded badges, tag chips, and filters make referral progress clear at a glance.

🧠 Behavior-Aligned: Tracks exactly what users already do — message, follow up, tag contacts, and note outcomes.

🎯 Action-Oriented: Guides users toward their next step (e.g., follow up), instead of passively storing info.

🤝 Supportive: Notifications, animations, and localStorage make it feel responsive, intuitive, and forgiving.

ReferralFlow helps users work through their referral strategy — not just record it.

## 🔭 Strategic Vision

If ReferralFlow gained traction:

| Area                  | Expansion |
|-----------------------|-----------|
| 🔔 Follow-up reminders | “Ask for referral” nudges after X days |
| 📊 Metrics dashboard   | Show referral conversion % by tag or source |
| 💬 AI message assistant| Suggest outreach messages per tag or company |
| 📤 CSV export          | Help users create a personal outreach report |
| ☁️ Cloud sync          | For sharing, backup, or team-based usage |

> ReferralFlow could expand into a broader job-seeking toolkit — built for structure and confidence.

---

## 🛠 Technical Execution (60%)

### Framework & Tools
- ✅ React + TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion for UI polish
- ✅ Vite + localStorage
- ✅ Deployed via Vercel

### Features Checklist

| Feature Category            | Implementation |
|-----------------------------|----------------|
| Clean, production-quality code | ✅ Componentized, styled, persisted |
| At least one meaningful interaction | ✅ Referral pipeline + edit/update UX |
| Error and success handling   | ✅ Notification system with toasts |
| Responsive design            | ✅ Mobile-friendly and touch-optimized |
| Bonus polish (motion, design) | ✅ Framer Motion + accessible design |
| Live deployment              | ✅ [referralflow.vercel.app](https://referralflow.vercel.app) |

---

## 🌐 Live Demo

🔗 [https://referralflow.vercel.app](https://referralflow.vercel.app)

---

## 📂 GitHub Repo

🔗 [https://github.com/adisahume/referralflow](https://github.com/adisahume/referralflow)

---

## 📦 Local Installation

```bash
git clone https://github.com/adisahume/referralflow.git
cd referralflow
npm install
npm run dev
