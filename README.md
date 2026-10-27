# notanotherevent.com

Static site + one Vercel serverless function (`/api/contact`). No build step.

## Go live
1. Put this folder in a GitHub repo and import it in Vercel (Framework: Other).
2. In Resend (resend.com, free): create an API key. Verify notanotherevent.com to send from your own domain.
3. Vercel > Settings > Environment Variables:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` (your inbox; comma-separate for several)
   - `FROM_EMAIL` e.g. `Not Another Event <hello@notanotherevent.com>`
4. Vercel > Domains: add notanotherevent.com.
5. Redeploy once after adding the variables.

## Update content
Edit `site-data.js` (projects, testimonials, social links, chat IDs). Push to GitHub and Vercel redeploys.
- Project screenshots: `/assets/projects/name.png`, then set `image`.
- Real numbers in the stats strip: set `data-count` in `index.html` (section stays hidden while all are 0).

## Project screenshots
Save images in `assets/projects/` (e.g. `10titles.png`, 16:11 ratio works best) and set `image: "/assets/projects/10titles.png"` in `site-data.js`.

## Live chat (free)
Create an account at tawk.to, copy the property and widget IDs into `site-data.js`. Install the Tawk.to app so teammates can reply from their phones.

## SEO / AEO
Meta tags, Open Graph, JSON-LD (Organization, WebSite, FAQPage), `sitemap.xml`, `robots.txt` and `llms.txt` are included. Add Review schema only once real testimonials are in. Submit the sitemap in Google Search Console.
