// ============================================
// MAINTENANCE MODE CONTROLLER
// Control each website individually
// ============================================

const CONFIG = {
  // 🚨 TOGGLE EACH SITE INDIVIDUALLY
  MAINTENANCE: {
    'rocketcitydefensesolutions.com': true,  // LLC Marketing site
    'kubefix.dev': true,                     // KubeFix
    'pipelineforge.dev': true,               // PipelineForge
    'getpguard.com': true,                   // PipelineGuard
  },
  
  // Domains managed by this worker (only these will be checked)
  MANAGED_DOMAINS: [
    'rocketcitydefensesolutions.com',
    'kubefix.dev',
    'pipelineforge.dev',
    'getpguard.com'
  ],
  
  // Your IP address (optional - can test while in maintenance)
  WHITELIST_IPS: [
    // 'YOUR.IP.ADDRESS.HERE'  // Uncomment and add your IP to bypass maintenance
  ],
};

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname.replace('www.', ''); // Handle www subdomain
  
  // If this domain is not managed by this worker, pass through immediately
  // This allows other Cloudflare rules (like .org redirects) to work
  if (!CONFIG.MANAGED_DOMAINS.includes(hostname)) {
    return fetch(request);
  }
  
  // Check if maintenance is enabled for THIS specific domain
  const maintenanceEnabled = CONFIG.MAINTENANCE[hostname];
  
  // If maintenance is OFF for this domain, just pass through
  if (!maintenanceEnabled) {
    return fetch(request);
  }
  
  // Check if user is whitelisted
  const clientIP = request.headers.get('CF-Connecting-IP');
  if (CONFIG.WHITELIST_IPS.includes(clientIP)) {
    return fetch(request);
  }
  
  // Allow maintenance page itself and assets
  const allowedPaths = [
    '/maintenance/',
    '/css/',
    '/js/', 
    '/fonts/',
    '/favicon',
    '/_next/static/',  // Next.js assets
    '/_next/image/',   // Next.js images
    '/public/',
    '/assets/',        // Vite assets
  ];
  
  // Check if path is allowed or is an asset file
  if (allowedPaths.some(path => url.pathname.startsWith(path)) || 
      url.pathname.match(/\.(png|jpg|jpeg|svg|ico|woff|woff2|css|js|json)$/)) {
    return fetch(request);
  }
  
  // Redirect everyone else to maintenance page
  return Response.redirect(url.origin + '/maintenance/index.html', 302);
}

// ============================================
// USAGE INSTRUCTIONS
// ============================================
// 
// To enable maintenance for a site:
// 1. Change 'false' to 'true' for that domain above
// 2. Click "Save and Deploy"
// 3. Done! (30 seconds)
//
// To disable maintenance:
// 1. Change 'true' back to 'false'
// 2. Click "Save and Deploy"
// 3. Site is back online!
//
// Examples:
// - Put only KubeFix in maintenance:
//   'kubefix.dev': true, (all others false)
//
// - Put all sites in maintenance:
//   Change all to true
//
// - Test with your IP whitelisted:
//   Add your IP to WHITELIST_IPS array
//   You'll see the real site, everyone else sees maintenance
//
// ============================================
