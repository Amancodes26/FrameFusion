# FrameFusion: AI-Powered Image Generation Platform

## Table of Contents
- [Overview](#overview)
- [Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Integration](#api-integration)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

## Overview

FrameFusion is a cutting-edge AI-powered image generation platform that combines state-of-the-art artificial intelligence with an intuitive user interface. It allows users to transform text descriptions into stunning visual content, making professional-grade image generation accessible to everyone.

## Key Features

### 1. AI-Powered Image Generation 🎨
- **Multiple AI Models**
  - Flux (Default general-purpose model)
  - Flux-realism (Photorealistic outputs)
  - Any-dark (Dark artistic style)
  - Flux-anime (Anime/manga style)
  - Flux-3D (3D rendered graphics)
  - Turbo (Fast generation)

### 2. Content Safety 🛡️
- **Advanced NSFW Detection**
  - Comprehensive content filtering
  - Pattern matching system
  - Multi-language support
  - Real-time validation

### 3. User Experience 🎯
- **Modern Interface**
  - Clean, responsive design
  - Toast notifications
  - Loading states
  - Image preview
- **Gallery Features**
  - Personal image collection
  - Generation history
  - Image metadata

## Tech Stack

### Frontend
- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - Shadcn UI components
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Authentication**: NextAuth.js with Google Provider

### Backend
- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Image Processing**: Sharp
- **Payment Integration**: Razorpay
- **Security**: 
  - Content safety checks
  - Rate limiting
  - Input validation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/framefusion
cd framefusion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create `.env` file with:
```env
DATABASE_URL=your_postgresql_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. Initialize database:
```bash
npx prisma generate
npx prisma db push
```

5. Start development server:
```bash
npm run dev
```

## API Integration

### Pollinations AI
The platform integrates with Pollinations AI for image generation with features like:
- Multiple model support
- Customizable image dimensions
- Seed-based generation
- No watermark option

### Razorpay
Integrated for secure payment processing with:
- Order creation
- Payment verification
- Subscription management
- Secure checkout

## Usage Guide

### Image Generation
1. Navigate to Create page
2. Enter your image description
3. Select desired AI model
4. Click Generate
5. View and save your creation

### Account Management
1. Sign in with Google
2. View your generation history
3. Manage subscription
4. Access premium features

### Subscription Plans
1. Basic (Free)
   - Limited generations
   - Standard models
2. Pro
   - Unlimited generations
   - All models access
   - Priority processing

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with 🎨 by Amancodes26

Support this project by giving it a ⭐