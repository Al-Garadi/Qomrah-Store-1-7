# Custom Gaming VPN — Roadmap site

This is a static single-page roadmap site for a WireGuard-first gaming VPN project — the 'Custom Gaming VPN for PUBG Mobile' roadmap.

What's included
- `index.html` — the roadmap content and structure.
- `styles.css` — styling with a modern dark theme and a light theme option.
- `script.js` — interactivity: table of contents, smooth scrolling, active section highlighting, and a persisted theme toggle.

Local preview (PowerShell / any shell)

1. Quick preview (open directly)
   - In Windows Explorer, double-click `index.html` to open it in your default browser.

2. Run a simple local static server (Python)

```powershell
# From the project folder
python -m http.server 8000
# Open your browser at http://localhost:8000
```

3. Alternative: using Node (serve)

```powershell
npm install --global serve
serve . -p 8000
# Open http://localhost:8000
```

Notes and next steps
- The site is responsive and includes a floating TOC on larger screens, an accessible skip link, and a light/dark theme persisted via localStorage.
- If you want, I can add: a small contact form, a downloadable design system, or convert this into a simple build (Vite/Parcel) with deploy scripts.
  
GitHub Pages automatic deploy (added)
------------------------------------

I added a GitHub Actions workflow (.github/workflows/deploy-pages.yml) that will publish the site to GitHub Pages automatically whenever you push to the `main` branch.

How it works (high level):
- The workflow copies `index.html`, `styles.css`, `script.js`, README.md and any `assets/` folder into an `out/` directory.
- The `out/` directory is uploaded and deployed with the official Pages actions.

What you need to do on GitHub
1. Push your changes to the `main` branch (the workflow runs on push).
2. Ensure GitHub Pages is enabled in the repository settings (the Deployments/Pages area is usually configured automatically when Actions deploys the site).

Alternative: Netlify or Vercel
--------------------------------
If you prefer Netlify or Vercel, this repo is now pre-configured for both services.

Vercel
------
- There's a `vercel.json` in the repository so Vercel will treat this as a static site and reserve `/api/*` routes for serverless functions.
- To deploy: sign in to vercel.com, import the repository, and deploy. Vercel will provide automatic previews for branches.

Netlify
-------
- A `netlify.toml` file declares `out` as the publish directory and `netlify/functions` as the functions folder.
- To deploy: sign in to netlify.com, "New site from Git", choose the repo and authorize. Netlify will build and publish from `main` unless configured otherwise.

Contact form (serverless)
-------------------------
There's a simple contact form in the site that POSTs to `/api/contact`.

- Vercel: the API function lives at `api/contact.js` and will be available at `/api/contact` after deployment.
- Netlify: the function lives at `netlify/functions/contact.js` and will be available at `/.netlify/functions/contact` (Netlify rewrites handle this). Note that `netlify.toml` already points functions to `netlify/functions`.

The serverless functions provided are scaffolds which validate the input and return a JSON acknowledgement. Replace the console logging with a real integration (email, database, or analytics) when you're ready.

