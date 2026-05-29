# Esperanza 2k26 - Setup &amp; Architecture Guide

This guide will help you set up the project locally and understand how everything works.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or cloud instance like MongoDB Atlas)

### 1. Install Dependencies
```bash
cd Esperanza_2k25
npm install
```

### 2. Environment Variables Setup
Create a `.env.local` file in the root of `Esperanza_2k25` directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
# OR for MongoDB Atlas: mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net
DB_NAME=esperanza2k26

# NextAuth Configuration
AUTH_SECRET=your_random_auth_secret_here
# Generate one using: openssl rand -base64 32

# NextAuth URL (for development)
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start MongoDB
- **Local MongoDB**: Make sure MongoDB service is running on your machine
- **MongoDB Atlas**: Ensure your IP is whitelisted in Atlas

### 4. Seed Events (Optional)
```bash
npm run seed:events
# Use --force to overwrite existing events: npm run seed:events:force
```

### 5. Run the Development Server
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

---

## 🏗️ Project Architecture

### Tech Stack
- **Framework**: Next.js 15 (Full-stack)
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: NextAuth v5 (Auth.js) with Credentials Provider
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui + Radix UI
- **Alerts**: Custom SweetAlert2 configuration with themed styling

### Directory Structure
```
Esperanza_2k25/
├── src/
│   ├── actions/              # Server Actions (backend logic)
│   │   ├── signup.action.ts  # User registration
│   │   ├── login.action.ts   # User login
│   │   ├── logout.action.ts  # User logout
│   │   ├── eventRegister.action.ts
│   │   ├── contact.action.ts
│   │   ├── fetch.action.ts
│   │   ├── team.action.ts    # Team management (create/join/remove)
│   │   └── profile.action.ts # Profile updates &amp; event unregistration
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   └── auth/[...nextauth]/route.ts  # NextAuth endpoint
│   │   ├── login/            # Login/Signup page
│   │   ├── profile/          # User profile
│   │   ├── events/           # Events pages
│   │   └── ...
│   ├── components/           # React components
│   │   ├── Events/
│   │   │   ├── TeamManager.tsx
│   │   │   ├── RegisterButton.tsx
│   │   │   └── RegistrationToggle.tsx
│   │   ├── Profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── ProfilePhotoUpload.tsx (with fire animation!)
│   │   │   └── LogOutButton.tsx
│   │   └── Shared/
│   ├── models/               # Mongoose models
│   │   ├── user.model.ts
│   │   ├── events.model.ts
│   │   └── team.model.ts
│   ├── utils/
│   │   ├── db/connect.ts     # MongoDB connection
│   │   ├── swal.ts           # Custom SweetAlert2 configuration
│   │   └── cloudinary.ts     # Cloudinary integration for profile photos
│   ├── interfaces/           # TypeScript interfaces
│   └── auth.ts               # NextAuth configuration
```

---

## 🔐 Authentication Flow

### 1. Sign Up Process
1. User fills out the signup form (`LoginSignUpForm.tsx`) with:
   - Email
   - Full Name
   - Year (1st/2nd/3rd/4th)
   - Department (CE/CSE/ECE/EE/ME)
   - Roll Number
   - Phone Number
   - Password

2. Form submission triggers `signUp` server action (`src/actions/signup.action.ts`)

3. The server action:
   - Connects to MongoDB via `connectDB()`
   - Creates a new user using `User.create()`
   - Password is automatically hashed by Mongoose pre-save hook (bcryptjs with 10 rounds)
   - Returns success/failure response

4. **Note**: There's currently NO email verification implemented. The `isVerified` field in user model defaults to `false` but isn't used yet.

### 2. Login Process (Credentials Only)
1. User enters email and password in login form
2. Form triggers `login` server action (`src/actions/login.action.ts`)
3. The action calls `signIn("credentials", ...)` from NextAuth
4. NextAuth's `authorize` function (`src/auth.ts`) does:
   - Connects to MongoDB
   - Finds user by email
   - Compares password using bcryptjs `compare()`
   - Returns user object if successful
5. NextAuth creates a session and redirects to home page

### User Model Schema (`src/models/user.model.ts`)
```typescript
{
  name: String (required),
  year: String (enum: "1st", "2nd", "3rd", "4th"),
  department: String (enum: "CE", "CSE", "ECE", "EE", "ME"),
  rollNumber: String,
  profilePhoto: String (Cloudinary URL),
  bio: String (default: ""),
  credentials: {
    email: String (required, unique),
    password: String (hashed, select: false),
    phoneNumber: String (unique)
  },
  isVerified: Boolean (default: false),
  registeredEvents: [ObjectId] (ref: "Events")
}
```

### Team Management
- **Create Team**: Users can create a team for any event
- **Join Team**: Users can join existing teams using a unique team key
- **Team Keys**: Auto-generated unique identifiers like "ABCD-1234"
- **Leader Transfer**: If team leader leaves, leadership transfers to first member
- **Team Deletion**: Empty teams are automatically deleted
- **Populated Data**: Teams always return with fully populated leader and members

---

## 📡 Server Actions vs API Routes

### Server Actions (Used for most operations)
- Located in `src/actions/`
- Directly callable from client components with `"use server"`
- Used for: signup, login, logout, event registration, contact form, team management, profile updates

### API Routes
- Located in `src/app/api/`
- RESTful endpoints
- Currently used for:
  - NextAuth (`/api/auth/[...nextauth]`)

---

## 🔧 Key Files Explained

### `src/auth.ts`
- NextAuth configuration
- Configures **only** Credentials provider (social logins removed)
- Defines `authorize` function for credentials login
- Sets custom sign-in page to `/login`

### `src/utils/db/connect.ts`
- MongoDB connection manager
- Uses Mongoose
- Reuses existing connection if available
- Uses `MONGO_URI` and `DB_NAME` from environment variables

### `src/utils/swal.ts`
- Custom SweetAlert2 configuration
- Themed with Esperanza's red/black gradient
- Used for all alerts and confirmations across the app

### `src/models/user.model.ts`
- Mongoose schema for User
- Pre-save hook to hash passwords automatically
- Password field has `select: false` to not return it in queries by default
- Includes profilePhoto field for Cloudinary integration

### `src/models/team.model.ts`
- Mongoose schema for Teams
- Stores team key, name, event, leader, and members
- Used for team management functionality

### `src/components/Login/LoginSignUpForm.tsx`
- Client component with login and signup tabs
- Uses React state for form management
- Calls server actions on form submission
- Uses custom Swal for user feedback
- **No social login buttons** (removed for simplicity)

### `src/components/Events/TeamManager.tsx`
- Full-featured team management UI
- Create/join teams
- View team members and leader
- Remove members (leader only)
- Copy team key functionality

### `src/components/Profile/ProfilePhotoUpload.tsx`
- Profile photo upload with Cloudinary integration
- **Fire red and black animated effect** around the profile image
- Uses custom Swal for feedback
- Supports images up to 5MB

---

## 🚧 Current Limitations &amp; Future Improvements

### What's Missing
1. **Email Verification**: `isVerified` field exists but no implementation
2. **Password Reset**: No password reset functionality
3. **Email Service**: Nodemailer not integrated yet
4. **Error Handling**: Basic error handling, could be improved

### How to Add Email Verification (Future)
1. Install Nodemailer: `npm install nodemailer @types/nodemailer`
2. Add `MAIL_USER` and `MAIL_PASS` to `.env.local`
3. Generate verification token on signup
4. Store token and expiry in user model
5. Send verification email via Nodemailer
6. Create verification endpoint to confirm email

---

## 📝 Available Scripts

```bash
npm run dev           # Start dev server with Turbopack
npm run build         # Build for production
npm start             # Start production server
npm run lint          # Run ESLint
npm run seed:admin
npm run seed:events   # Seed initial events into DB
npm run seed:events:force  # Seed events and overwrite existing
```

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB service is running locally
- Check `MONGO_URI` and `DB_NAME` in `.env.local`
- For Atlas, ensure IP is whitelisted and credentials are correct

### NextAuth Issues
- Make sure `AUTH_SECRET` is set (generate with `openssl rand -base64 32`)
- Check `NEXTAUTH_URL` is correct

### Event Registration/Unregistration Issues
- If you can't re-register after unregistering, make sure the user was properly removed from both:
  - `user.registeredEvents` array
  - `event.participants` array

### Team Management Issues
- If members aren't showing up until reload, ensure the team action returns fully populated team data with leader and members

### Port Already in Use
- Change port: `npm run dev -- -p 3001`

---
Made with ❤️ for Esperanza 2k26
