// Compatibility shim for a legacy Vercel/v0 build hook.
// The project no longer requires v0 build-time injection, but the Vercel
// project configuration may still invoke this path. Keep the hook side-effect
// free so `next build` can proceed safely until the project setting is removed.
export {};
