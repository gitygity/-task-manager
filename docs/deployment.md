# Deployment Guide

## Build for Production

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build locally
npm run preview
```

---

## Deployment Platforms

### 🚀 Vercel (Recommended)

**Step 1:** Connect your GitHub repository to Vercel

**Step 2:** Configure build settings:
```bash
# Build Command
npm run build

# Output Directory
dist

# Node.js Version
18.x
```

**Step 3:** Set environment variables (if needed):
```env
VITE_API_URL=https://your-api.com
VITE_APP_ENV=production
```

**Step 4:** Deploy
- Automatic deployments on every push to main branch
- Preview deployments for pull requests

---

### 🌍 Netlify

**Step 1:** Connect repository to Netlify

**Step 2:** Build settings:
```bash
# Build command
npm run build

# Publish directory
dist
```

**Step 3:** Create `_redirects` file for client-side routing:
```
/*    /index.html   200
```

**Step 4:** Environment variables:
```env
VITE_API_URL=https://your-api.com
VITE_APP_ENV=production
```

---

### 📦 GitHub Pages

**Step 1:** Install gh-pages:
```bash
npm install --save-dev gh-pages
```

**Step 2:** Add deployment script to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**Step 3:** Configure Vite for GitHub Pages in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/task-manager/', // Repository name
  // ... other config
})
```

**Step 4:** Deploy:
```bash
npm run deploy
```

---

### 🐳 Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**Build and run:**
```bash
# Build image
docker build -t task-manager .

# Run container
docker run -p 80:80 task-manager
```

---

## Environment Variables

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=https://api.taskmanager.com
VITE_API_VERSION=v1

# Application Settings
VITE_APP_NAME="Task Manager"
VITE_APP_ENV=production

# Authentication
VITE_AUTH_DOMAIN=taskmanager.auth0.com
VITE_AUTH_CLIENT_ID=your_client_id

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
```

### Production Checklist

- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Error tracking setup (Sentry, LogRocket)
- [ ] Analytics configured
- [ ] Domain and SSL certificate setup
- [ ] CDN configuration (if needed)
- [ ] Monitoring and alerting setup
- [ ] Backup strategy defined

---

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-dialog']
        }
      }
    }
  }
})
```

### Caching Strategy

```nginx
# nginx.conf caching rules
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 0;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## Monitoring

### Recommended Tools

- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking and performance monitoring
- **LogRocket** - Session replay and debugging
- **Google Analytics** - User behavior tracking

### Health Check Endpoint

Create a simple health check for monitoring:

```typescript
// src/pages/HealthCheck.tsx
export default function HealthCheck() {
  return (
    <div>
      <h1>OK</h1>
      <p>Application is running</p>
      <p>Version: {import.meta.env.VITE_APP_VERSION}</p>
    </div>
  )
}
```

---

*This guide will be updated with specific deployment configurations as needed.* 