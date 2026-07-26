# PostPilot Studio

PostPilot Studio is a static, mobile-friendly social content web app backed by Supabase. It analyzes public website content, creates problem–solution posts, stores brand settings and posts, provides a drag-and-drop Fabric.js design canvas, saves design previews to private Storage, and manages a content queue.

## Live architecture

- **Frontend:** HTML, CSS, JavaScript
- **Designer:** Fabric.js
- **Backend:** Supabase Postgres, Auth, Storage and Edge Functions
- **Deployment target:** GitHub Pages
- **Project ref:** `dnpdhjhpnguzhmnimklm`

## Features

- Email/password authentication
- User-owned brand kits with RLS
- Public website reading through an authenticated Edge Function
- Problem–Solution, PAS, AIDA, Before–After and Educational copy frameworks
- Instagram, Facebook, LinkedIn and X formatting
- Editable generated posts with hashtags
- Six database-driven design templates
- Drag, resize, rotate and layer text, images and shapes
- Square, portrait, landscape and story canvases
- High-resolution PNG downloads
- Private Supabase Storage for logos and previews
- Saved post library and scheduling queue

## Repository files

- `index.html` — application UI
- `styles.css` — responsive interface
- `config.js` — public Supabase URL and publishable key
- `app.js` — auth, database, generator and designer logic
- `supabase/migrations/...sql` — database and RLS foundation
- `supabase/functions/generate-posts/index.ts` — website analysis and post generation

## Required Supabase dashboard setting

After GitHub Pages is enabled, add this URL to **Authentication → URL Configuration → Redirect URLs**:

```text
https://liwworgsinc.github.io/social/
```

Set the Site URL to the same address if this is the production domain.

## Security

The browser uses a Supabase publishable key, which is designed for public clients. Every user table has Row Level Security. Do not add a secret or service-role key to this repository.

The `brand-assets` bucket is private. Files must be stored inside a folder named with the authenticated user's UUID.

## Current publishing scope

The content queue stores approved schedule records, but it does not yet publish to Meta, LinkedIn or X. Automatic publishing requires OAuth approval and platform-specific tokens stored only on the server.

## Local preview

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.
