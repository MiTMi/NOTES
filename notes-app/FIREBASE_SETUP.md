# Firebase Integration Setup Guide

## Prerequisites
- Firebase project created in the Firebase Console
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase Authentication, Firestore, and Storage enabled in your project

## Step 1: Get Firebase Configuration

1. Go to your Firebase Console
2. Navigate to Project Settings (gear icon)
3. Scroll down to "Your apps" section
4. Click on the web app or create a new web app
5. Copy the Firebase configuration object

## Step 2: Environment Variables

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Fill in your Firebase configuration values in `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 3: Initialize Firebase CLI

1. Login to Firebase CLI:
```bash
firebase login
```

2. Initialize Firebase in your project (if not already done):
```bash
firebase init
```
Select:
- Firestore
- Hosting
- Storage

3. Set your Firebase project:
```bash
firebase use your_project_id
```

## Step 4: Deploy Firestore Rules and Indexes

```bash
npm run deploy:firestore
```

## Step 5: Deploy Storage Rules

```bash
npm run deploy:storage
```

## Step 6: Enable Authentication Methods

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable:
   - Email/Password
   - Google (optional, for Google Sign-in)

## Step 7: Test Locally

```bash
npm run dev
```

## Step 8: Deploy to Firebase Hosting

```bash
npm run deploy
```

## Features Included

### Authentication
- Email/Password sign up and sign in
- Google OAuth sign in
- Protected routes
- User session management

### Firestore Database
- Real-time note synchronization
- User-specific note isolation
- Automatic data migration from localStorage
- Security rules preventing unauthorized access

### Data Migration
- Automatic migration of existing localStorage notes to Firestore
- One-time migration per user
- Preserves note content, titles, and pin status

### Security
- Firestore security rules ensure users can only access their own notes
- Storage rules for user-specific file uploads
- Environment variables for secure configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Build and deploy everything
- `npm run deploy:hosting` - Deploy only hosting
- `npm run deploy:firestore` - Deploy only Firestore rules/indexes
- `npm run deploy:storage` - Deploy only Storage rules

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure your `.env` file is in the root directory and variables start with `VITE_`

2. **Firestore permission denied**: Ensure your Firestore rules are deployed and user is authenticated

3. **Build fails**: Check that all environment variables are set correctly

4. **Google Sign-in not working**: Ensure Google provider is enabled in Firebase Console and proper domain is added to authorized domains

### Development vs Production

- Development: Uses local environment variables from `.env`
- Production: Set environment variables in your hosting platform or Firebase Hosting

## Next Steps

1. Set up your `.env` file with your Firebase configuration
2. Deploy Firestore and Storage rules
3. Test authentication and note creation
4. Deploy to Firebase Hosting

Your notes app is now fully integrated with Firebase! 🎉