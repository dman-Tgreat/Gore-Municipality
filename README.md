# Gore Woreda Municipality Portal

A modern, responsive multi-page web application frontend designed for the Gore Woreda Administration portal. Built with Next.js using the file-system App Router and styled with Tailwind CSS following an appealing, clean red-and-white visual theme.

## 🚀 Features

- **Modular Architecture:** UI is fully decoupled into distinct, reusable React structural components (`Header`, `Hero`, `StatsGrid`, `Services`).
- **File-System Routing:** Implements Next.js App Router for automatic routing mapping (`/`, `/services`, `/news`, `/contact`).
- **Dynamic UX:** - Dynamic responsive hero carousel with custom automated background slide timers (`useState`, `useEffect`).
  - Single-page anchor navigation offsets with `scroll-behavior: smooth`.
  - Live active-route navigation indicator using Next.js `usePathname` hooks.
- **Localized Profile Content:** Showcases authentic historical and economic demographic statistics of Gore (Illubabor Zone, Oromia, Ethiopia), highlighting the Gummaro Tea Estate, local apiculture, and regional population data.
- **Internationalization Placeholder UI:** Incorporates a state-driven language dropdown utility for English, Afaan Oromoo, and Amharic.

## 📁 Directory Structure

