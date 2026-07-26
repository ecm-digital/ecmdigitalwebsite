/**
 * The Vercel project for this app has its Root Directory set to
 * `agency-management-panel/`, while the actual Next.js app lives in
 * `frontend/`. This config only tells Vercel's Next.js builder where
 * to find the build output produced by `cd frontend && npm run build`.
 */
module.exports = {
  distDir: 'frontend/.next',
};
