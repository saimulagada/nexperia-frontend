// middleware.js

// middleware.js

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req) {
  // Get the token from the cookies
  const token = req.cookies.get('accessToken'); // Make sure you're storing the token as a cookie during login

  // If there's no token, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL('/api/Login', req.url)); // Redirect to login page
  }

  // Allow the request to proceed if the user is logged in
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/*', '/', '/api/sendEmail', '/api/TemplateEditor', '/api/AIsuggestions','/api/CampaignMetrics'], // Add paths that require authentication here
};








