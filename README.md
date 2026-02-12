# SRCVP Labs LLP Website (Dynamic Frontend)

This project is a **feature-rich dynamic frontend** designed for static hosting (GitHub → Hostinger).

## Features
- Data-driven homepage sections rendered from JSON
- Dynamic products grid with search, filter, and sorting
- Dynamic blog hub with search + post rendering by slug
- Testimonials carousel and interactive FAQ accordion
- Lead capture + newsletter forms (demo mode ready to wire)
- Theme toggle (dark/light)
- Responsive navigation and animated background

## Project Structure
- `index.html` — main landing page
- `blog.html` — blog listing + single post view
- `styles.css` — complete UI styling
- `script.js` — dynamic rendering and interactions
- `data/site.json` — products/services/pricing/testimonials/faq content
- `data/blogs.json` — blog content source

## Run Locally
```bash
python3 -m http.server 4173
```
Visit `http://127.0.0.1:4173`.

## Manage Blogs
1. Open `data/blogs.json`.
2. Add a new object with `slug`, `title`, `excerpt`, `date`, `category`, `content`.
3. Save and push to GitHub.
4. Deploy on Hostinger via Git pull.

## Deploy on Hostinger from GitHub
1. Push branch to GitHub.
2. In Hostinger hPanel, open **Websites → Manage → Git**.
3. Connect repository + branch.
4. Set publish path to repo root (`index.html` location).
5. Deploy.

## Production Hardening (recommended)
- Connect forms to Formspree / Apps Script / backend API
- Add analytics (GA4/Plausible)
- Add sitemap.xml + robots.txt + OpenGraph tags
- Compress assets and enable CDN/cache headers
