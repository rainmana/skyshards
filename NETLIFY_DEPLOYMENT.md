# Netlify Deployment Guide

## Fixed Issues

### 1. Environment Variables
- **Problem**: Pages were trying to prerender and failing when Supabase env vars weren't available
- **Solution**: 
  - Made all pages dynamic (`export const dynamic = 'force-dynamic'`)
  - Added graceful fallbacks in Supabase client creation
  - Pages now render at request time instead of build time

### 2. Middleware Edge Runtime
- **Problem**: Middleware was using Node-only Supabase APIs incompatible with Edge Runtime
- **Solution**: 
  - Added graceful error handling in middleware
  - Middleware now skips auth checks if env vars are missing (allows build to complete)
  - Auth checks happen at runtime when env vars are available

### 3. Node Version
- **Problem**: Using Node 18 which is deprecated for supabase-js
- **Solution**: 
  - Updated to Node 20 in `netlify.toml`
  - Added `.nvmrc` file with Node 20
  - Added `engines` field to `package.json`

## Required Environment Variables in Netlify

Make sure these are set in Netlify's environment variables (Site settings → Build & deploy → Environment):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Important**: These must be set as "Build-time" environment variables so they're available during the build process.

## Build Configuration

The project is configured with:
- `netlify.toml` - Netlify build settings
- `@netlify/plugin-nextjs` - Next.js plugin for Netlify
- All pages marked as dynamic to prevent prerendering issues

## Verification

After deployment, verify:
1. ✅ Build completes successfully
2. ✅ Pages load correctly
3. ✅ Authentication works
4. ✅ Supabase queries execute properly

If you see any issues, check:
- Environment variables are set correctly in Netlify
- Node version is 20 (check build logs)
- No Edge Runtime errors in middleware

