# Render Deployment Configuration

## Current Issue
Render is configured to run `node src/server.ts` directly, which causes TypeScript compilation errors.

## Solution Options

### Option 1: Update Render Dashboard Start Command
In your Render dashboard, change the start command from:
```
node src/server.ts
```
to:
```
node start-render.js
```

### Option 2: Use npm start
Change the start command to:
```
npm start
```

### Option 3: Use the compiled server directly
Change the start command to:
```
node dist/src/server.js
```

## Recommended Configuration

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
node start-render.js
```

## Environment Variables
Make sure to set all required environment variables in the Render dashboard:

- `NODE_ENV=production`
- `PORT=3000`
- `MONGODB_URI=your_mongodb_uri`
- `JWT_SECRET=your_jwt_secret`
- And all other required variables from `config/.env.example`

## Troubleshooting

If the deployment still fails:

1. Check the build logs for TypeScript compilation errors
2. Verify all environment variables are set
3. Ensure the build process completes successfully
4. Check that the compiled server exists at `dist/src/server.js` 