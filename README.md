# Esperanza 2k26 - Official Website

<p align="center">
  <img src="https://coresg-normal.trae.ai/api/v1/text-to-image?prompt=Esperanza%202k26%20official%20website%20logo%20red%20and%20black%20gradient%20event%20management&image_size=square_hd" alt="Esperanza Logo" width="200"/>
</p>

<p align="center">
  <i>The official website for CGEC's annual technical extravaganza</i>
</p>

---

## Table of Contents

1. Overview
2. Tech Stack
3. Features
4. Quick Start
5. Contributing
6. License
7. Contact

---

## Overview

This repository contains the source code for Esperanza 2k26, the annual technical festival of Coochbehar Government Engineering College. The website serves as a complete platform for event management, registrations, schedules, and real-time updates.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose ODM |
| Authentication | NextAuth v5 (Auth.js) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Form Handling | React Hook Form + Zod |
| Alerts | SweetAlert2 (Custom Themed) |
| Hosting | Vercel-Ready |

---

## Features

- User Management: Sign up, login, and profile management
- Event System: Browse technical and cultural events with detailed information
- Registration: Individual and team-based event registrations
- Team Management: Create, join, and manage teams for events
- Responsive Design: Works seamlessly across all devices
- Admin Panel: Complete admin dashboard for managing events, users, etc.
- Cloudinary Integration: Profile photo uploads with animated UI

---

## Quick Start

For detailed setup instructions, check SETUP_GUIDE.md.

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### Installation Steps

1. Clone & Navigate:
   ```bash
   git clone <repo-url>
   cd Esperanza_2k25
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create `.env.local` in root:
   ```env
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=esperanza2k26
   AUTH_SECRET=your_auth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

---

## Contributing

We welcome contributions! Here's how you can help:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See LICENSE for more information.

---

## Contact

- Email: your-email@example.com
- GitHub Issues: Create Issue

---

<p align="center">Made with ❤ for CGEC Esperanza</p>
