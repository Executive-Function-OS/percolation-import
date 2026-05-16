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

## Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

This builds the site and pushes it to the `gh-pages` branch of your repository.

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
