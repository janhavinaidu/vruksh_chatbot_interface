# Environment Setup Guide

## .env.local Configuration

Your `.env.local` file should contain:

```env
OPENALEX_EMAIL=your-email@example.com
```

### Important: Server-Side API Routes

To avoid CORS issues, all API calls now happen **server-side** through Next.js API routes. This means:
- No `NEXT_PUBLIC_` prefix needed
- Environment variables are secure (not exposed to browser)
- No CORS errors from PubMed or OpenAlex

## Example .env.local File

```env
# OpenAlex API Configuration
# Adding your email gets you into the "polite pool" with 100 req/sec instead of 10 req/sec
OPENALEX_EMAIL=naidu@example.com

# Optional: You can add other configuration here
# MAX_RESULTS=200
# FROM_YEAR=2020
```

## Verification

To verify your setup is working:

1. **Check the file exists**:
   - File location: `vruksh-chatbot-ui/.env.local`
   - The file should be in the same directory as `package.json`

2. **Restart the dev server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

3. **Test the integration**:
   - Open http://localhost:3000
   - Add a topic (e.g., "Cancer")
   - Click "Run Comparative Analysis"
   - Check browser console for any errors

## Common Issues

### Issue: "OPENALEX_EMAIL is undefined"
**Solution**: 
- Make sure the file is named exactly `.env.local` (not `.env` or `env.local`)
- Restart the dev server after creating/editing the file
- Variable should be `OPENALEX_EMAIL` (no NEXT_PUBLIC_ prefix)

### Issue: API calls are slow
**Solution**:
- Verify your email is correctly set in `.env.local`
- OpenAlex should respond faster with a valid email
- Try with just one topic first

### Issue: CORS errors
**Solution**:
- **CORS errors are now fixed!** All API calls happen server-side through `/api/analyze`
- If you still see CORS errors, make sure you're using the updated code
- The browser never directly calls PubMed or OpenAlex anymore

## Security Note

The `.env.local` file is already in `.gitignore`, so it won't be committed to Git. This is important for security, even though OpenAlex doesn't require sensitive credentials.

## No API Key Required!

Good news: Both APIs we're using are completely free and don't require API keys:

- **OpenAlex**: No API key needed (email is optional but recommended)
- **PubMed**: No API key needed for basic usage

This makes your chatbot easy to deploy and share!
