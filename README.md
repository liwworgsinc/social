# LIW Marketing Studio V2

An internal, no-login marketing tool built specifically for LIW Worgs Inc.

## What changed

The old step-by-step interface was replaced with a compact studio layout. The post preview stays visible while the message, image and layout are changed.

## Post Studio

- Nine LIW Worgs Inc. services
- Service-specific copy, headlines, captions, hashtags and image prompts
- Six polished social-ad layouts:
  - Executive Split
  - Bold Poster
  - Editorial
  - Local Business
  - Premium
  - Offer Blast
- Square, portrait, story and landscape sizes
- AI image generation through the existing Supabase Edge Function
- Image upload
- Automatic LIW brand-art backgrounds
- High-resolution PNG download
- Browser-based saved-work library

## Email Studio

- Seven business outreach templates
- Three subject-line choices for every email
- Business name, contact name, email and industry personalization
- LIW service selection
- Offer or consultation field
- Professional, friendly and direct tones
- Contact CSV import
- Editable email body
- Copy subject or body
- Download a formatted HTML email
- Open in Gmail
- Open in the computer's default email app

Expected CSV headings:

```csv
Business Name,Contact Name,Email
Crown Beauty Salon,Ms. Johnson,owner@example.com
```

The app prepares one recipient at a time. It does not silently send bulk unsolicited messages.

## Campaign Builder

Creates seven service-focused campaign ideas and loads any selected idea into the Post Studio.

## Supabase image function

The app uses the already deployed function:

```text
liw-generate-image
```

To activate AI image generation, the Supabase project needs this Edge Function secret:

```text
OPENAI_API_KEY
```

The OpenAI key must never be placed inside `config.js` or `app.js`.

## Upload to GitHub Pages

Upload these files to the repository root:

```text
index.html
styles.css
app.js
config.js
.nojekyll
```

The expected public URL is:

```text
https://liwworgsinc.github.io/social/
```

## Local testing

The live image function only permits approved LIW origins and the local development origin on port 8765:

```bash
python -m http.server 8765
```
