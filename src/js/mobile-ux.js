// Client Dashboard Redirects
document.addEventListener('DOMContentLoaded', function() {
    // Handle client dashboard links
    const clientDashboardLinks = document.querySelectorAll('a[href^="/client-dashboard/"], a[href^="/panel-klienta/"], a[href^="/login"]');
    clientDashboardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            let newHref = href;

            // Use local panel directory for client dashboard
            if (href.startsWith('/client-dashboard/')) {
                newHref = href.replace('/client-dashboard/', '/panel/');
            } else if (href.startsWith('/panel-klienta/')) {
                newHref = href.replace('/panel-klienta/', '/panel/');
            } else if (href.startsWith('/login')) {
                newHref = href.replace('/login', '/panel/auth/login.html');
            }

            window.location.href = newHref;
        });
    });
});
