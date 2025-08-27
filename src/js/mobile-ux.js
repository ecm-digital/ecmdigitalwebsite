// Client Dashboard Redirects
document.addEventListener('DOMContentLoaded', function() {
    // Handle client dashboard links
    const clientDashboardLinks = document.querySelectorAll('a[href^="/client-dashboard/"], a[href^="/panel-klienta/"], a[href^="/login"]');
    clientDashboardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            let newHref = href;

            // TEMPORARY: Use local development server for testing
            // TODO: Replace with production Vercel URL when ready
            if (href.startsWith('/client-dashboard/')) {
                newHref = href.replace('/client-dashboard/', 'http://localhost:3002/');
            } else if (href.startsWith('/panel-klienta/')) {
                newHref = href.replace('/panel-klienta/', 'http://localhost:3002/');
            } else if (href.startsWith('/login')) {
                newHref = href.replace('/login', 'http://localhost:3002/auth/login');
            }

            window.location.href = newHref;
        });
    });
});
