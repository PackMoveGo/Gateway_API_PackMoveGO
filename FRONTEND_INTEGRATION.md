# 🎉 PackMoveGO Frontend Integration Guide

## ✅ BACKEND STATUS: FULLY WORKING!

Your backend API is now live and functional at `https://api.packmovego.com`

## 🔧 Frontend Setup for Vercel

### 1. Environment Variables for Vercel

Add these to your Vercel project settings:

```bash
# In Vercel Dashboard → Your Project → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://api.packmovego.com
NEXT_PUBLIC_API_KEY=pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6
```

### 2. API Client Setup

Create an API client in your frontend:

```javascript
// lib/api.js or utils/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
};
```

### 3. Example Usage in Components

```javascript
// components/Services.jsx
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await apiClient.get('/v0/services');
        setServices(data.services);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) return <div>Loading services...</div>;

  return (
    <div>
      <h2>Our Services</h2>
      {services.map(service => (
        <div key={service.id}>
          <h3>{service.icon} {service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. Available API Endpoints

Your backend provides these working endpoints:

```javascript
// Content endpoints (all working)
await apiClient.get('/v0/services');      // Moving services
await apiClient.get('/v0/testimonials');  // Customer reviews  
await apiClient.get('/v0/blog');          // Blog posts
await apiClient.get('/v0/about');         // About content
await apiClient.get('/v0/nav');           // Navigation data
await apiClient.get('/v0/contact');       // Contact info
await apiClient.get('/v0/referral');      // Referral program
await apiClient.get('/v0/reviews');       // Reviews
await apiClient.get('/v0/locations');     // Service locations
await apiClient.get('/v0/supplies');      // Moving supplies

// Enhanced services API
await apiClient.get('/api/v1/services');                    // All services with analytics
await apiClient.get('/api/v1/services/house-mover');        // Specific service
await apiClient.post('/api/v1/services/house-mover/quote', quoteData); // Get quote
await apiClient.get('/api/v1/services/analytics');          // Analytics data
```

### 5. Real API Test (Run This Now!)

Test your backend directly from browser console:

```javascript
// Open browser console on any page and run:
fetch('https://api.packmovego.com/v0/services', {
  headers: {
    'x-api-key': 'pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6'
  }
})
.then(response => response.json())
.then(data => {
  console.log('✅ Backend working!', data);
  console.log('📊 Found', data.services.length, 'services');
})
.catch(error => console.error('❌ Error:', error));
```

### 6. Error Handling

```javascript
// Enhanced API client with better error handling
export const apiClient = {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  },
  
  get: (endpoint) => apiClient.request(endpoint),
  post: (endpoint, data) => apiClient.request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};
```

### 7. Next.js App Router Setup

```javascript
// app/services/page.jsx (App Router)
import { apiClient } from '@/lib/api';

async function getServices() {
  return await apiClient.get('/v0/services');
}

export default async function ServicesPage() {
  const data = await getServices();
  
  return (
    <div>
      <h1>Moving Services</h1>
      {data.services.map(service => (
        <div key={service.id} className="service-card">
          <h2>{service.icon} {service.title}</h2>
          <p>{service.description}</p>
          <p><strong>Price:</strong> {service.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### 8. TypeScript Support

```typescript
// types/api.ts
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

export interface ApiResponse<T> {
  services?: T[];
  testimonials?: T[];
  // ... other response types
}

// lib/api.ts
import type { Service, ApiResponse } from '@/types/api';

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // ... implementation
  }
};
```

## 🚀 Deploy Your Frontend

1. **Add environment variables to Vercel**
2. **Deploy your frontend with the API integration**
3. **Test the live connection**

## ✅ Verification Checklist

- [ ] Added environment variables to Vercel
- [ ] Updated frontend code to use API client
- [ ] Tested API calls in browser console
- [ ] Deployed frontend to Vercel
- [ ] Verified frontend-backend connection works live

## 🎯 Your Backend Features

✅ **Multi-Authentication**: API key, IP whitelist, domain-based  
✅ **CORS Configured**: Works with Vercel frontend  
✅ **Rate Limiting**: 50 requests per 15 minutes  
✅ **Error Handling**: Comprehensive error responses  
✅ **Health Monitoring**: Built-in health checks  
✅ **Security Headers**: Full security configuration  

**Your backend is now production-ready and waiting for your frontend!** 🎉 