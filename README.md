# Golden Aura Cosmetics

Golden Aura Cosmetics is a responsive, static website for an intention-led self-care brand. It is built with HTML, CSS and vanilla JavaScript and can be hosted on GitHub Pages or another static web host.

## Pages

- `index.html` — home page, FAQs and email newsletter prompt.
- `about.html` — brand story, purpose and values.
- `products/services.html` — searchable, sortable product ranges and image lightbox.
- `enquiry.html` — validated custom-order form and price/availability estimate.
- `contact.html` — contact details, embedded Google Map and validated email form.

Legacy links to `shop page.html` and `custom-page.html` redirect to the current shop and enquiry pages.

## Features

- Responsive layouts, keyboard-visible focus states, and reduced-motion support.
- Interactive FAQ disclosures, live product search/sorting, and an accessible image lightbox.
- Product and pricing content loaded from JSON files.
- Client-side form validation with field-level error messages.
- Custom-order estimates include range pricing, quantity discounts, packaging fees and availability bands.
- Contact and newsletter forms validate input and prepare an email in the visitor's default email application.
- Google Maps embed for the Sandton City location.
- Page titles, descriptions, canonical links, `robots.txt` and `sitemap.xml`.

## Run locally

Use a local web server so the product and pricing JSON files can be fetched. In VS Code, start Live Server from the project root and open `index.html`. Opening the files directly with a `file://` URL may block those requests.

The contact and newsletter forms use `mailto:` because this project has no application server or email API. Sending requires an email application configured on the visitor's device. The forms do not store or transmit submitted data to this repository.

## SEO and deployment

The canonical URLs and sitemap currently use the GitHub Pages project-site address:

`https://emgpsd.github.io/wede5020-2026-part-3-st10526409/`

If the site is deployed at another address, update canonical links in the HTML pages and the sitemap and `Sitemap` line in `robots.txt` before launch. The repository must have GitHub Pages enabled for this URL to serve the site. Off-page SEO (earning backlinks and promoting social profiles) requires external activity and cannot be completed by editing this repository alone.

## Changelog

### 2026-11-09 — Part 3 feedback and functionality

- Added this README with clear project, page, feature, local-run, deployment and changelog sections.
- Replaced the enquiry-page redirect with a real, accessible custom-order form. Added client-side field and range validation, JSON-backed prices, bulk discounts, packaging fees and availability feedback.
- Moved the malformed pricing data out of JavaScript and into valid `data/pricing.json`.
- Added `data/products.json` and a product browser that dynamically loads range cards, filters by search terms, sorts by name or price, and reports empty/error states.
- Added an accessible dialog lightbox for larger product images and native disclosure controls for the home-page FAQs.
- Added a contact-message type field, email validation and a mailto message composer; connected the newsletter form to the same validation flow.
- Replaced broken local logo image references and placeholder social links, corrected homepage copy, and consolidated the shop under the cleaner `products/services.html` URL while keeping legacy links working.
- Added page-specific SEO descriptions and canonical links, plus a crawler policy and XML sitemap.
- Added responsive styling for the product browser, lightbox, enquiry result and mobile form controls.

## Security and privacy

User-provided text is inserted into generated product and estimate content as text, not executable HTML. No account credentials or API keys are required. The contact and newsletter forms use the visitor's email client rather than sending personal information to an unconfigured third-party service.
