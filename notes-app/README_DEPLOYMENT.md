# Deployment Options for NoteFlow

## Option 1: Firebase Hosting (Recommended for Static SPAs)

Firebase Hosting is better suited for React SPAs like this app:

```bash
# Build and deploy to Firebase Hosting
npm run deploy:hosting
```

## Option 2: Firebase App Hosting (For Backend Apps)

If you want to use App Hosting, you need the files I created:

### Required Files Added:
- `Procfile` - Process file for web server
- `app.yaml` - App Engine configuration  
- `project.toml` - Buildpack configuration
- `server.mjs` - Express server for serving the SPA
- `.nvmrc` - Node.js version specification

### Steps for App Hosting:
1. Commit and push all changes to GitHub
2. Set environment variables in Firebase App Hosting console
3. Create new rollout

## Environment Variables Needed:

Set these in Firebase App Hosting console:
```
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value  
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
VITE_FIREBASE_MEASUREMENT_ID=your_value
```

## Recommendation

For a React SPA with Firebase services, **Firebase Hosting** is the simpler and more appropriate choice. App Hosting is better for apps that need server-side rendering or backend APIs.