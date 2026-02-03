#!/usr/bin/env node

// Google OAuth Setup Verification Script
// Run this from the project root: node verify-oauth-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔍 DineEase Google OAuth Setup Verification\n');

const checks = [];
let allPassed = true;

// Check 1: Backend .env file
const backendEnvPath = path.join(__dirname, 'Backend', '.env');
if (fs.existsSync(backendEnvPath)) {
    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    const hasGoogleClientId = envContent.includes('GOOGLE_CLIENT_ID');
    const hasGoogleSecret = envContent.includes('GOOGLE_CLIENT_SECRET');
    const hasCallback = envContent.includes('GOOGLE_CALLBACK_URL');
    const hasFrontendUrl = envContent.includes('FRONTEND_URL');
    
    if (hasGoogleClientId && hasGoogleSecret && hasCallback && hasFrontendUrl) {
        checks.push('✅ Backend .env file has all Google OAuth variables');
    } else {
        checks.push('❌ Backend .env file missing Google OAuth variables');
        allPassed = false;
    }
} else {
    checks.push('❌ Backend .env file not found');
    allPassed = false;
}

// Check 2: Passport configuration
const passportPath = path.join(__dirname, 'Backend', 'config', 'passport.js');
if (fs.existsSync(passportPath)) {
    const passportContent = fs.readFileSync(passportPath, 'utf8');
    if (passportContent.includes('GoogleStrategy') && passportContent.includes('phoneNumber')) {
        checks.push('✅ Passport.js configured with Google OAuth strategy and phoneNumber fix');
    } else {
        checks.push('❌ Passport.js missing GoogleStrategy or phoneNumber field');
        allPassed = false;
    }
} else {
    checks.push('❌ Passport.js config file not found');
    allPassed = false;
}

// Check 3: Auth routes
const authRoutesPath = path.join(__dirname, 'Backend', 'routes', 'authRoutes.js');
if (fs.existsSync(authRoutesPath)) {
    const authContent = fs.readFileSync(authRoutesPath, 'utf8');
    if (authContent.includes('/google') && authContent.includes('/google/callback') && authContent.includes('jwt')) {
        checks.push('✅ Auth routes configured with Google OAuth endpoints and JWT');
    } else {
        checks.push('❌ Auth routes missing Google OAuth endpoints or JWT import');
        allPassed = false;
    }
} else {
    checks.push('❌ Auth routes file not found');
    allPassed = false;
}

// Check 4: Google callback component
const callbackPath = path.join(__dirname, 'frontend', 'src', 'pages', 'public', 'GoogleCallback.jsx');
if (fs.existsSync(callbackPath)) {
    checks.push('✅ Google OAuth callback component exists');
} else {
    checks.push('❌ Google OAuth callback component not found');
    allPassed = false;
}

// Check 5: Router configuration
const routerPath = path.join(__dirname, 'frontend', 'src', 'routes', 'router.jsx');
if (fs.existsSync(routerPath)) {
    const routerContent = fs.readFileSync(routerPath, 'utf8');
    if (routerContent.includes('GoogleCallback') && routerContent.includes('/auth/google/callback')) {
        checks.push('✅ Frontend router configured with Google OAuth callback route');
    } else {
        checks.push('❌ Frontend router missing Google OAuth callback route');
        allPassed = false;
    }
} else {
    checks.push('❌ Frontend router file not found');
    allPassed = false;
}

// Check 6: UserAuth component
const userAuthPath = path.join(__dirname, 'frontend', 'src', 'pages', 'public', 'UserAuth.jsx');
if (fs.existsSync(userAuthPath)) {
    const userAuthContent = fs.readFileSync(userAuthPath, 'utf8');
    if (userAuthContent.includes('handleGoogleAuth') && userAuthContent.includes('localhost:3000')) {
        checks.push('✅ UserAuth component has Google OAuth button with correct backend URL');
    } else {
        checks.push('❌ UserAuth component missing Google OAuth button or incorrect URL');
        allPassed = false;
    }
} else {
    checks.push('❌ UserAuth component not found');
    allPassed = false;
}

// Check 7: AuthContext
const authContextPath = path.join(__dirname, 'frontend', 'src', 'context', 'AuthContext.jsx');
if (fs.existsSync(authContextPath)) {
    const authContextContent = fs.readFileSync(authContextPath, 'utf8');
    if (authContextContent.includes('const login = ') && authContextContent.includes('localStorage.setItem')) {
        checks.push('✅ AuthContext has generic login method for OAuth');
    } else {
        checks.push('❌ AuthContext missing generic login method for OAuth');
        allPassed = false;
    }
} else {
    checks.push('❌ AuthContext file not found');
    allPassed = false;
}

// Check 8: Backend dependencies
const backendPackagePath = path.join(__dirname, 'Backend', 'package.json');
if (fs.existsSync(backendPackagePath)) {
    const packageContent = fs.readFileSync(backendPackagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    if (packageJson.dependencies.passport && packageJson.dependencies['passport-google-oauth20']) {
        checks.push('✅ Backend has required OAuth dependencies');
    } else {
        checks.push('❌ Backend missing OAuth dependencies');
        allPassed = false;
    }
} else {
    checks.push('❌ Backend package.json not found');
    allPassed = false;
}

// Print results
checks.forEach(check => console.log(check));

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('🎉 All Google OAuth setup checks PASSED!');
    console.log('\n📋 Next steps:');
    console.log('1. Update Backend/.env with your real Google OAuth credentials');
    console.log('2. Start backend server: cd Backend && npm run dev');
    console.log('3. Start frontend server: cd frontend && npm run dev');
    console.log('4. Test Google OAuth at http://localhost:5173/user/auth');
    console.log('\n📖 See GOOGLE_OAUTH_SETUP.md for detailed setup instructions');
} else {
    console.log('⚠️  Some Google OAuth setup checks FAILED!');
    console.log('Please review the failed checks above and fix the issues.');
    console.log('\n📖 See GOOGLE_OAUTH_SETUP.md for setup instructions');
}

console.log('\n🔗 OAuth Flow:');
console.log('Frontend Button → Backend (/api/auth/google) → Google OAuth → Backend (/api/auth/google/callback) → Frontend (/auth/google/callback) → Dashboard');