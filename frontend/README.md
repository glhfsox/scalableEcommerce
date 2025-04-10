# eCommerce Frontend

This is the frontend for our scalable eCommerce application.

## Deployment on Vercel

### Prerequisites
- A Vercel account (https://vercel.com)
- Git repository with your code

### Steps to Deploy

1. **Push your code to a Git repository**
   - GitHub, GitLab, or Bitbucket

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Sign up or log in
   - Click "New Project"
   - Import your repository
   - Select the "frontend" directory as the root directory

3. **Configure environment variables**
   - Add the following environment variable:
     - `REACT_APP_API_URL`: Your backend API URL

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your site will be live at a vercel.app domain

### Custom Domain Setup

1. Go to your project in Vercel dashboard
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to set up DNS

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env.local` file with your environment variables:
   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

3. Start development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ``` 