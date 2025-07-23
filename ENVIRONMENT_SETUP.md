# 🔧 Environment Setup Guide

## 🚨 **CRITICAL: Create .env.local File Immediately**

**This will fix the NextAuth URL warnings and "exports is not defined" errors!**

Create a file named `.env.local` in your `100Gaj/` directory with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/100gaj

# NextAuth Configuration (REQUIRED - fixes NextAuth URL warning)
NEXTAUTH_SECRET=a-very-long-secret-key-for-nextauth-minimum-32-characters-here-replace-this
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key  
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Development Mode
NODE_ENV=development

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay Payment Gateway (REQUIRED for equity platform)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

## 📋 **Step-by-Step Setup:**

### 1. **Create .env.local File**
```bash
# In the 100Gaj directory
touch .env.local

# Or on Windows Command Prompt:
echo. > .env.local
```

### 2. **Generate NextAuth Secret**
```bash
# Generate a secure secret (32+ characters)
openssl rand -base64 32

# Or use this temporary one for development:
# NEXTAUTH_SECRET=development-secret-key-change-in-production-32chars
```

### 3. **MongoDB Setup (Choose One)**

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb/brew/mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
mongod

# Use this in .env.local:
MONGODB_URI=mongodb://localhost:27017/100gaj
```

#### Option B: MongoDB Atlas (Cloud)
```bash
# 1. Go to https://www.mongodb.com/atlas
# 2. Create free account
# 3. Create cluster
# 4. Get connection string
# 5. Use this format in .env.local:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/100gaj
```

### 4. **Cloudinary Setup (Optional but Recommended)**
```bash
# 1. Go to https://cloudinary.com
# 2. Create free account
# 3. Get your Cloud Name, API Key, and API Secret from dashboard
# 4. Add to .env.local
```

## 🔧 **Fix Common Issues:**

### Issue 1: "exports is not defined" Error
**Solution:** Create the .env.local file with proper NextAuth configuration above.

### Issue 2: NextAuth URL Warning
**Solution:** Ensure `NEXTAUTH_URL=http://localhost:3000` is in .env.local

### Issue 3: /sell Route 404 Errors
**Solution:** After creating .env.local, clean and rebuild:
```bash
rm -rf .next
npm run dev
```

### Issue 4: Build Warnings
**Solution:** These are now mostly non-critical warnings. To reduce them:
```bash
# For development (faster builds):
npm run build:fast

# For production (full checks):
npm run build
```

## 🚀 **Testing Your Setup:**

1. **Create .env.local** with the template above
2. **Clean build cache:**
   ```bash
   rm -rf .next && rm -rf node_modules/.cache
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
4. **Check for improvements:**
   - No more NextAuth URL warnings
   - Reduced "exports is not defined" errors
   - /sell route should work properly

## 🔒 **Security Notes:**

- **Never commit .env.local to git** (it's already in .gitignore)
- **Use strong secrets in production** 
- **Change default values** before deploying
- **Use environment-specific URLs** (localhost for dev, domain for prod)

## 📞 **Still Having Issues?**

1. Ensure .env.local file is in the root 100Gaj directory
2. Restart your development server after creating .env.local
3. Check that file permissions allow reading .env.local
4. Verify there are no syntax errors in the .env.local file

---

**After creating .env.local, you should see:**
- ✅ No NextAuth URL warnings
- ✅ Reduced compilation errors  
- ✅ /sell route working properly
- ✅ Better overall stability 