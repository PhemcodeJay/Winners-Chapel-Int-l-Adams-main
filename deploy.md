The project is fully configured for deployment to Render. The deployment configuration has been verified:

**render.yaml** (already configured):
- Service name: wcia-church-management
- Build command: `npm install && npm run build`
- Start command: `node ./dist/index.cjs`
- Environment variables: DATABASE_URL, SESSION_SECRET, CHURCH_NAME, SMTP_FROM
- PostgreSQL database: wcia-db (free tier, oregon region)
- Health check: /api/user
- Auto-deploy: enabled

**Build process** (script/build.ts):
- Builds client with Vite → dist/public
- Bundles server with esbuild → dist/index.cjs
- Includes all necessary server dependencies

**To deploy:**
1. Push this code to a GitHub/GitLab repository
2. Go to https://dashboard.render.com → "New" → "Web Service"
3. Connect your repository
4. Render will auto-detect render.yaml and deploy
5. Set the required environment variables in Render dashboard if needed (SESSION_SECRET, SMTP_FROM, CHURCH_NAME)
6. The PostgreSQL database will be automatically provisioned

The app will be available at `https://wcia-church-management.onrender.com`