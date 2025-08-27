// Client Dashboard Redirects
document.addEventListener('DOMContentLoaded', function() {
    // Handle client dashboard links
    const clientDashboardLinks = document.querySelectorAll('a[href^="/client-dashboard/"], a[href^="/panel-klienta/"], a[href^="/login"]');
    clientDashboardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            let newHref = href;
            
            if (href.startsWith('/client-dashboard/')) {
                newHref = href.replace('/client-dashboard/', 'https://panel.ecm-digital.com/');
            } else if (href.startsWith('/panel-klienta/')) {
                newHref = href.replace('/panel-klienta/', 'https://panel.ecm-digital.com/');
            } else if (href.startsWith('/login')) {
                newHref = href.replace('/login', 'https://panel.ecm-digital.com/auth/login');
            }
            
            window.location.href = newHref;
        });
    });
});
