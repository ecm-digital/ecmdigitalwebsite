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
                newHref = href.replace('/client-dashboard/', 'https://client-dashboard-jl678m0h1-ecm-digitals-projects.vercel.app/');
            } else if (href.startsWith('/panel-klienta/')) {
                newHref = href.replace('/panel-klienta/', 'https://client-dashboard-jl678m0h1-ecm-digitals-projects.vercel.app/');
            } else if (href.startsWith('/login')) {
                newHref = href.replace('/login', 'https://client-dashboard-jl678m0h1-ecm-digitals-projects.vercel.app/auth/login');
            }
            
            window.location.href = newHref;
        });
    });
});
