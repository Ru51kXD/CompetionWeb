# CompetitionWeb Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Routes](#api-routes)
6. [Components](#components)
7. [Authentication](#authentication)
8. [Features](#features)
9. [Development Guide](#development-guide)
10. [Deployment](#deployment)

## Project Overview

CompetitionWeb is a modern web platform designed for organizing and managing various types of competitions, including sports, intellectual, and creative events. The platform provides a comprehensive solution for both organizers and participants.

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation Libraries**: 
  - Framer Motion
  - GSAP
- **Icons**: React Icons

### Backend
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: Next.js built-in authentication

## Project Structure

```
CompetitionWeb/
├── app/                    # Next.js App Router directory
│   ├── components/        # Reusable UI components
│   ├── competitions/      # Competition-related pages
│   ├── teams/            # Team management pages
│   ├── profile/          # User profile pages
│   ├── dashboard/        # User dashboard
│   ├── admin/            # Admin panel
│   ├── login/            # Authentication pages
│   ├── register/         # Registration pages
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   └── globals.css       # Global styles
├── prisma/               # Database configuration
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Database seed data
├── public/              # Static assets
└── [config files]       # Various configuration files
```

## Database Schema

### Models

#### User
- `id`: Int (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String
- `role`: Role (USER, ADMIN, ORGANIZER)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations:
  - `teams`: Team[] (Team Members)
  - `ownTeams`: Team[] (Team Owner)
  - `entries`: Entry[]

#### Competition
- `id`: Int (Primary Key)
- `title`: String
- `description`: String
- `type`: CompType (SPORTS, INTELLECTUAL, CREATIVE)
- `startDate`: DateTime
- `endDate`: DateTime
- `location`: String (Optional)
- `rules`: String (Optional)
- `image`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations:
  - `entries`: Entry[]

#### Team
- `id`: Int (Primary Key)
- `name`: String
- `description`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `ownerId`: Int (Foreign Key)
- Relations:
  - `owner`: User (Team Owner)
  - `members`: User[] (Team Members)
  - `entries`: Entry[]

#### Entry
- `id`: Int (Primary Key)
- `competitionId`: Int (Foreign Key)
- `userId`: Int (Foreign Key, Optional)
- `teamId`: Int (Foreign Key, Optional)
- `status`: EntryStatus (PENDING, APPROVED, REJECTED, COMPLETED)
- `score`: Float (Optional)
- `feedback`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations:
  - `competition`: Competition
  - `user`: User (Optional)
  - `team`: Team (Optional)

### Enums

#### Role
- USER
- ADMIN
- ORGANIZER

#### CompType
- SPORTS
- INTELLECTUAL
- CREATIVE

#### EntryStatus
- PENDING
- APPROVED
- REJECTED
- COMPLETED

## Features

### User Management
- User registration and authentication
- Role-based access control
- User profiles
- Team management

### Competition Management
- Create and manage competitions
- Different competition types support
- Competition rules and guidelines
- Location and scheduling

### Team Management
- Create and manage teams
- Team member management
- Team participation in competitions

### Entry System
- Individual and team entries
- Entry status tracking
- Score management
- Feedback system

## Development Guide

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- Git

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file with the following variables:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment

### Production Build
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

### Database Migration
For production deployment:
```bash
npx prisma migrate deploy
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License 