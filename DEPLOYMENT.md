# Deployment Guide for Render

This guide will help you deploy the LinkedIn Backend API to Render.

## Prerequisites

- A [Render](https://render.com) account (free tier available)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Options

### Option 1: Using Render Blueprint (Recommended)

The easiest way to deploy is using the included `render.yaml` blueprint file.

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub/GitLab repository
   - Select this repository
   - Render will automatically detect the `render.yaml` file

3. **Deploy**
   - Review the configuration
   - Click "Apply"
   - Render will create:
     - A PostgreSQL database
     - A web service for your API
     - All necessary environment variables

4. **Update JWT Secrets (Important!)**
   - After deployment, go to your web service settings
   - Navigate to "Environment" tab
   - Update the auto-generated `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` with strong, unique values
   - Or keep the generated ones (they're secure by default)

### Option 2: Manual Deployment

If you prefer to set up services manually:

#### Step 1: Create PostgreSQL Database

1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `linkedin-db`
   - **Database**: `linkedin_db`
   - **User**: `linkedin_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free
3. Click "Create Database"
4. Note down the connection details (Internal Database URL)

#### Step 2: Create Web Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `linkedin-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Set Environment Variables

Add these environment variables in the "Environment" tab:

```
NODE_ENV=production
PORT=10000
DB_HOST=<your-db-host-from-step-1>
DB_PORT=5432
DB_USERNAME=<your-db-username-from-step-1>
DB_PASSWORD=<your-db-password-from-step-1>
DB_NAME=linkedin_db
JWT_ACCESS_SECRET=<generate-a-secure-random-string>
JWT_REFRESH_SECRET=<generate-a-different-secure-random-string>
```

**Important**: For JWT secrets, use strong random strings. You can generate them using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Step 4: Deploy

Click "Create Web Service" and Render will build and deploy your application.

## Post-Deployment

### Verify Deployment

Once deployed, your API will be available at:
```
https://linkedin-backend.onrender.com
```

Test it:
```bash
curl https://your-service-name.onrender.com/
```

You should see:
```json
{
  "message": "LinkedIn Backend API",
  "documentation": "https://your-service-name.onrender.com/api-docs"
}
```

### Access API Documentation

Swagger documentation will be available at:
```
https://your-service-name.onrender.com/api-docs
```

### CORS Configuration

If you need to update CORS settings for your frontend:

1. Edit `src/index.ts`
2. Update the CORS configuration:
   ```typescript
   app.use(cors({
     origin: ['https://your-frontend-domain.com', 'http://localhost:5173'],
     credentials: true
   }));
   ```
3. Commit and push changes
4. Render will automatically redeploy

## Database Management

### Run Migrations

If you add migrations in the future:

1. Connect to your Render PostgreSQL database using the connection string
2. Run migrations locally against the production database (not recommended)
3. Or add a migration command to your build script

### Seed Data

To seed your production database:

1. Add a seed script to `package.json`:
   ```json
   "seed:prod": "node dist/scripts/seed.js"
   ```
2. Run it via Render Shell:
   - Go to your web service
   - Click "Shell" tab
   - Run: `npm run seed:prod`

## Monitoring

- **Logs**: Available in the Render Dashboard under "Logs" tab
- **Metrics**: View in "Metrics" tab (CPU, Memory, Request stats)
- **Health Checks**: Render automatically monitors the `/` endpoint

## Scaling

### Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month of runtime

### Upgrading

To upgrade to a paid plan for better performance:
1. Go to service settings
2. Click "Change Plan"
3. Select a paid tier (starts at $7/month)

Benefits of paid plans:
- No spin-down
- More CPU/RAM
- Custom domains
- Better support

## Troubleshooting

### Build Fails

- Check build logs in Render Dashboard
- Ensure all dependencies are in `package.json` (not just `devDependencies` that are needed for build)
- Verify TypeScript compiles locally: `npm run build`

### Database Connection Issues

- Verify environment variables are set correctly
- Check that database is in the same region as web service
- Ensure `DB_HOST` uses the internal connection string (not external)

### Application Crashes

- Check logs for error messages
- Verify all required environment variables are set
- Test locally with production-like environment variables

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `DB_HOST` | Database hostname | `dpg-xxxxx-a` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database user | `linkedin_user` |
| `DB_PASSWORD` | Database password | `xxx` |
| `DB_NAME` | Database name | `linkedin_db` |
| `JWT_ACCESS_SECRET` | JWT access token secret | Random string (64+ chars) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Random string (64+ chars) |

## Security Notes

- Never commit `.env` file (it's in `.gitignore`)
- Use strong, unique JWT secrets in production
- Keep database credentials secure
- Enable HTTPS only in production (Render provides this automatically)
- Regularly rotate JWT secrets and database passwords

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- Check application logs in Render Dashboard
