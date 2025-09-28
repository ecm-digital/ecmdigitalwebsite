// Client Dashboard Redirects
document.addEventListener('DOMContentLoaded', function() {
    // Handle client dashboard links - redirect to advanced client dashboard
    const clientDashboardLinks = document.querySelectorAll('a[href^="/client-dashboard/"]');
    clientDashboardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to advanced client dashboard on port 3002
            window.location.href = 'http://localhost:3002';
        });
    });
});
