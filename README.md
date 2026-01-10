# Maintenance Mode Controller

Cloudflare Worker for managing maintenance mode across multiple websites individually.

## Features

- ✅ Control each domain independently (one at a time or all together)
- ✅ Whitelist IPs for testing (see real site while others see maintenance)
- ✅ Automatic asset pass-through (CSS, JS, images, fonts)
- ✅ Works with all frameworks (Next.js, Vite, static HTML)
- ✅ 30-second toggle time
- ✅ No code changes or rebuilds required

## Managed Domains

- rocketcitydefensesolutions.com (LLC Marketing)
- kubefix.dev (KubeFix)
- pipelineforge.dev (PipelineForge)
- getpguard.com (PipelineGuard)

## Quick Start

### Option 1: Deploy via Cloudflare Dashboard (Easiest)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Click **Create Worker**
3. Name it: `maintenance-controller`
4. Copy the contents of `worker.js` and paste into the editor
5. Click **Save and Deploy**

### Option 2: Deploy via Wrangler CLI

```bash
# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Deploy to production
npm run deploy
```

### Add Routes to Domains

For each domain in Cloudflare:

1. Go to domain → Workers Routes → **Add Route**
2. Add these routes:

```
*rocketcitydefensesolutions.com/* → maintenance-controller
*kubefix.dev/* → maintenance-controller
*pipelineforge.dev/* → maintenance-controller
*getpguard.com/* → maintenance-controller
```

Or via CLI:

```bash
wrangler route add "*rocketcitydefensesolutions.com/*" maintenance-controller
wrangler route add "*kubefix.dev/*" maintenance-controller
wrangler route add "*pipelineforge.dev/*" maintenance-controller
wrangler route add "*getpguard.com/*" maintenance-controller
```

## Usage

### Enable Maintenance for One Site

Edit `worker.js` lines 8-11:

```javascript
MAINTENANCE: {
  'rocketcitydefensesolutions.com': false,
  'kubefix.dev': true,  // ← Enable only KubeFix
  'pipelineforge.dev': false,
  'getpguard.com': false,
},
```

Then:
- **Dashboard**: Click "Save and Deploy"
- **CLI**: Run `npm run deploy`

### Enable Maintenance for All Sites

```javascript
MAINTENANCE: {
  'rocketcitydefensesolutions.com': true,
  'kubefix.dev': true,
  'pipelineforge.dev': true,
  'getpguard.com': true,
},
```

### Whitelist Your IP (Testing)

Add your IP to bypass maintenance:

```javascript
WHITELIST_IPS: [
  '1.2.3.4',  // Your IP address
],
```

**Find your IP**: https://whatismyipaddress.com

### Disable Maintenance

Change `true` back to `false` for any domain, then deploy.

## How It Works

1. **Request arrives** → Worker intercepts at CDN edge
2. **Check domain** → Is maintenance enabled for THIS domain?
3. **If NO** → Pass request through normally
4. **If YES** → Check if IP is whitelisted
5. **If whitelisted** → Pass through
6. **If not whitelisted** → Redirect to `/maintenance/index.html`

## Maintenance Pages

Each site already has a branded maintenance page at:
- `/maintenance/index.html`

The worker automatically serves the correct page for each domain.

## Testing

1. Enable maintenance for one site
2. Add your IP to whitelist
3. Visit the site:
   - **You see**: Normal site (whitelisted)
   - **Others see**: Maintenance page
4. Test from phone (different IP) to verify maintenance page shows

## Troubleshooting

### Maintenance not showing?

- Verify worker route is added in Cloudflare Dashboard
- Check route pattern: `*domain.com/*` (wildcard before domain)
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- Wait 30-60 seconds for global propagation

### Site still redirecting after disabling?

- Verify `false` is set in worker code
- Clear browser cache
- Check for browser redirect cache (try incognito)

### Assets not loading on maintenance page?

- Maintenance page uses Tailwind CDN (no assets needed)
- Email form uses `mailto:` (no backend needed)

## Development

```bash
# Test locally
npm run dev

# View live logs
npm run tail

# Format code
npx prettier --write worker.js
```

## Environment Variables (Optional)

Instead of editing code, use Cloudflare environment variables:

1. Dashboard → Workers → `maintenance-controller` → Settings → Variables
2. Add variable: `MAINTENANCE_MODE_KUBEFIX` = `true`
3. Update worker code to read from env vars

## License

MIT © 2026 Rocket City Defense Solutions

## Support

Questions? Contact: domains@rocketcitydefensesolutions.com
