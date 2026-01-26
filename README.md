<div align="center">
  <img src="apps/web/public/images/logo-256.webp" width="128px" />
  <p>
    <i>Step behind the scenes of the <a href="https://trenitardo.it" target="_blank">Trenitardo website</a>.</i>
  </p>
  <br />
  <img src="apps/web/public/images/trenitardo.webp">
</div>

Trenitardo is a data-driven platform designed to monitor, aggregate, and visualize punctuality statistics for the Valtellina railway network. It transforms fragmented transit data into actionable performance insights.

### Architecture & Tech Stack

This project is built as a Turborepo monorepo, ensuring high modularity and optimized build pipelines between the frontend and serverless backend.

- Frontend: Angular with Server-Side Rendering (SSR) for SEO optimization and near-instant First Contentful Paint.
- Backend: Firebase Functions (Node.js) handling API requests and business logic.
- Data Acquisition: Automated Scraping Engine via Firebase Functions to collect and normalize real-time railway data.

### Project Structure

```
.
├── apps
|   ├── web            # Angular SSR Application
│   └── functions      # Firebase Functions & Scrapers (Coming Soon)
├── packages
│   ├── eslint-config  # Shared ESLint config
│   └── types          # Shared TypeScript interfaces and DTOs
└── turbo.json         # Monorepo orchestration
```
