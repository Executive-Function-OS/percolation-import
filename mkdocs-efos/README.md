# Executive Function OS – MkDocs Site

This is the complete MkDocs + Material for MkDocs site for the Executive Function OS research platform.

## Features

- Full migration of all original content
- Modern Material theme with dark/light mode
- KaTeX support for all equations (percolation math, fragmentation scores, etc.)
- Admonitions, cards, grids for better readability
- Privacy-first architecture preserved

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Start the development server
mkdocs serve
```

Then open `http://127.0.0.1:8000` in your browser.

## Deploy to Vercel

Since you use Vercel, deploying this MkDocs site alongside your existing project is straightforward. You have two main options:

**Option 1: Deploy as a separate Vercel Project (Recommended for a subdomain like `docs.executivefunctionos.com`)**
1. Go to your Vercel Dashboard and click **Add New... > Project**.
2. Import the `percolation-import` repository.
3. In the project configuration:
   - **Root Directory**: Click Edit and select `mkdocs-efos`.
   - **Framework Preset**: Other
   - **Build Command**: `pip install -r requirements.txt && mkdocs build`
   - **Output Directory**: `site`
4. Click **Deploy**.

**Option 2: Deploy under your existing Next.js app (e.g., `executivefunctionos.com/docs`)**
You can configure Next.js to serve the MkDocs generated site. This requires modifying your build pipeline to run MkDocs, then copying the `site` folder into the Next.js `public/docs` folder before building Next.js. Let me know if you prefer this approach and I can set it up for you!

## Next Steps

- Replace placeholder images in `docs/assets/` with actual diagrams (Type 1–4, Observer-Operator schema, etc.)
- Add your Google Analytics ID to `mkdocs.yml` if desired
- Implement the interactive widget placeholder on the Demo page
- Set up a GitHub repository and enable GitHub Pages

## Content Preservation

All original content from https://demo.executivefunctionos.com/ has been preserved:

- System typologies (Solvable, Complex Navigable, Corrupted, Paradox)
- Observer-Operator dynamics
- DBSCAN + percolation pipeline
- Percolation mathematics ($$p_c$$, Fragmentation Score)
- N=1 proof-of-concept results
- Privacy-first architecture
- Anni Eriksson’s bio and author voice
