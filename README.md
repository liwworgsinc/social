# LIW Worgs Social Advertising Studio

A private-use, no-login web app created specifically for **LIW Worgs Inc.** to advertise its services.

## What changed

This is no longer a generic content platform. It opens directly into the LIW advertising workflow and does not include signup, login, customer accounts, or brand onboarding.

## LIW services included

- Business advertising
- Website and digital solutions
- Print and graphic design
- Real estate sales and rentals
- Property management
- Income-tax services
- Credit solutions
- Business funding guidance
- Eyeglasses repair / Just Eyes

## Main features

- Select an LIW service
- Choose the campaign goal, platform, and tone
- Generate three different caption options
- Edit and copy the final caption
- Automatically create a service-specific AI image prompt
- Generate a new advertising image through Supabase + OpenAI
- Upload a photo instead
- Create an original LIW branded graphic background without an AI API
- Eight professional design templates
- Square, portrait, story, and landscape sizes
- Drag and resize design elements
- Add editable badges and text
- Download high-resolution PNG posts
- Generate a seven-day campaign
- Save up to 15 finished posts in browser storage

## Files

```text
index.html
styles.css
app.js
config.js
.nojekyll
README.md
supabase/functions/liw-generate-image/index.ts
```

## Upload to GitHub Pages

Upload the files in this folder to the root of:

```text
https://github.com/liwworgsinc/social/
```

Then open the repository settings and enable GitHub Pages from the `main` branch and root folder.

The expected website address is:

```text
https://liwworgsinc.github.io/social/
```

## AI image generation setup

The `liw-generate-image` Supabase Edge Function has already been deployed to project:

```text
dnpdhjhpnguzhmnimklm
```

The function keeps the OpenAI API key on the server. The key is never placed in `config.js` or browser JavaScript.

To activate the **Generate AI image** button:

1. Open the Supabase project.
2. Go to **Edge Functions → Secrets**.
3. Add a secret named:

```text
OPENAI_API_KEY
```

4. Paste a valid OpenAI API key as the value.
5. Reload the web app.

The function uses the current OpenAI Image API with the `gpt-image-2` model.

Without that secret, the rest of the application still works. When AI generation is unavailable, the app automatically uses an original LIW branded graphic background or an uploaded photo.

## Security note

The user requested no login. The image endpoint therefore uses all of the following lightweight controls:

- A studio request key
- Approved website origins
- A daily per-client generation limit
- A server-side OpenAI API key

Do not share the studio URL broadly. A login-free public website cannot provide the same level of access control as real authentication.

## Local testing

Run a local server from this folder:

```bash
python -m http.server 8765
```

Open:

```text
http://localhost:8765
```

The deployed image function currently permits local testing from port `8765`.
