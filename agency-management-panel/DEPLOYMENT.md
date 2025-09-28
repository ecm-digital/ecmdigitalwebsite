# Agency Management Panel Deployment Guide

This document explains how to deploy the agency management panel and integrate it with the main ECM Digital website.

## Deployment Process

### 1. Build the Application

```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel

Using Vercel CLI:
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to production
vercel --prod
```

Or deploy using the deploy script:
```bash
cd frontend
./deploy.sh
```

### 3. Update Vercel Routing (if needed)

The main website's `vercel.json` file already includes routing for the agency management panel:
```json
{
  "source": "/agency-management-panel",
  "destination": "https://agency-management-panel.vercel.app"
},
{
  "source": "/agency-management-panel/:path*",
  "destination": "https://agency-management-panel.vercel.app/:path*"
}
```

If you deploy to a different URL, update these routes accordingly.

## Integration with Main Website

### Navigation Links

The main website includes links to the agency management panel in two places:

1. **Navigation Dropdown** - In the "Moje Konto" menu:
   ```html
   <a class="dropdown-item" href="/agency-management-panel/" target="_blank">
     <i class="fas fa-cogs me-2"></i>Panel Zarządzania
     <small class="text-muted d-block">Administracja i zarządzanie agencją</small>
   </a>
   ```

2. **Direct Access Page** - The `agency-management-panel.html` file:
   - Provides information about the panel
   - Automatically redirects to the live application after 3 seconds
   - Includes direct link to access the panel

### URL Structure

- **Main Website**: https://www.ecm-digital.com/
- **Agency Panel**: https://agency-management-panel.vercel.app/
- **Direct Access**: https://www.ecm-digital.com/agency-management-panel/
- **Direct Access (HTML)**: https://www.ecm-digital.com/agency-management-panel.html

## Updating the Deployment

When making updates to the agency management panel:

1. Make code changes in `frontend/` directory
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Deploy with `vercel --prod`
5. Update version information in `package.json` if needed

## Monitoring and Maintenance

### Health Checks

The application includes basic health checking through:
- Vercel's built-in monitoring
- Error tracking via console logs
- Performance monitoring

### Updates

Regular updates should include:
- Dependency updates: `npm update`
- Security patches
- Feature enhancements
- Bug fixes

## Troubleshooting

### Common Issues

1. **Routing Problems**
   - Check `vercel.json` routing configuration
   - Verify the destination URL is correct
   - Ensure the agency panel is deployed and accessible

2. **Build Failures**
   - Check for TypeScript/JavaScript errors
   - Verify all dependencies are installed
   - Ensure environment variables are set correctly

3. **Performance Issues**
   - Check Vercel analytics
   - Optimize images and assets
   - Review bundle size with `npm run build`

### Contact

For deployment issues, contact the development team or check the main project documentation.