// HubSpot integration loader for ECM Digital static site
// - Reads portal and form IDs from /hubspot-config.json
// - Injects HubSpot tracking script
// - Optionally embeds a HubSpot form into #hubspot-form
// - Tracks CTA click events if HubSpot queue is available

(function () {
    // Debug flag to disable HubSpot injection: add ?nohs=1 to URL
    var search = typeof window !== 'undefined' ? window.location.search : '';
    if (search && /(^|[?&])nohs=1(&|$)/.test(search)) {
        console.warn('[HubSpot] Disabled by nohs=1 query param');
        return;
    }
    function log(...args) {
        if (window && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            console.log('[HubSpot]', ...args);
        }
    }

    function injectTrackingScript(portalId, region) {
        if (!portalId) {
            log('Missing portalId, skipping HubSpot tracking.');
            return Promise.resolve();
        }

        // Avoid double-injecting
        if (document.getElementById('hs-script-loader')) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            var script = document.createElement('script');
            script.id = 'hs-script-loader';
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            var cluster = region && region.trim() ? region.trim() : 'na1';
            // Use forms embed cluster when provided as eu1
            var host = cluster === 'eu1' ? 'js-eu1.hs-scripts.com' : 'js-na1.hs-scripts.com';
            script.src = 'https://' + host + '/' + portalId + '.js';
            script.onload = function () {
                log('HubSpot tracking loaded.');
                resolve();
            };
            script.onerror = function () {
                console.warn('[HubSpot] Tracking script failed to load.');
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    function loadFormsLibrary() {
        // Avoid double load
        if (window.hbspt && window.hbspt.forms) return Promise.resolve();
        if (document.getElementById('hs-forms-loader')) return Promise.resolve();

        return new Promise((resolve) => {
            var script = document.createElement('script');
            script.id = 'hs-forms-loader';
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.src = 'https://js.hsforms.net/forms/embed/v2.js';
            script.onload = function () {
                log('HubSpot forms library loaded.');
                resolve();
            };
            script.onerror = function () {
                console.warn('[HubSpot] Forms library failed to load.');
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    function createFormIfConfigured(cfg) {
        var portalId = cfg && cfg.portalId;
        var formId = cfg && cfg.formId;
        var targetId = (cfg && cfg.formTargetId) || 'hubspot-form';

        if (!portalId || !formId) {
            log('No portalId/formId provided. Skipping form embed.');
            return;
        }

        var target = document.getElementById(targetId);
        if (!target) {
            log('Form target #' + targetId + ' not found, skipping.');
            return;
        }

        if (!window.hbspt || !window.hbspt.forms || !window.hbspt.forms.create) {
            log('Forms library not ready yet.');
            return;
        }

        log('Embedding HubSpot form into #' + targetId);
        try {
            window.hbspt.forms.create({
                region: (cfg && cfg.region) || 'na1',
                portalId: String(portalId),
                formId: String(formId),
                target: '#' + targetId,
                onFormSubmit: function($form) {
                    // Track form submission in Google Analytics
                    if (window.analytics && window.analytics.trackContactConversion) {
                        window.analytics.trackContactConversion('hubspot_contact');
                    }
                    log('Form submitted, tracking conversion');
                }
            });
        } catch (e) {
            console.warn('[HubSpot] Failed to create form:', e);
        }
    }

    function setupCtaTracking() {
        // HubSpot analytics queue
        window._hsq = window._hsq || [];

        // Track clicks on key CTAs (email, phone, consultation button)
        var selectors = [
            'a[href^="mailto:"]',
            'a[href^="tel:"]',
            '#contact .btn',
            'a.btn.btn-cta',
        ];

        try {
            document.querySelectorAll(selectors.join(',')).forEach(function (el) {
                if (el.__hsTracked) return; // avoid duplicate handlers
                el.__hsTracked = true;

                el.addEventListener('click', function () {
                    var label = el.getAttribute('data-i18n') || el.textContent?.trim() || 'CTA Click';
                    var href = el.getAttribute('href') || '';
                    try {
                        // HubSpot tracking
                        window._hsq.push([
                            'trackEvent',
                            {
                                id: 'cta_click',
                                value: 1,
                                content: label,
                                href: href,
                                path: window.location.pathname,
                            },
                        ]);
                        
                        // Google Analytics 4 tracking
                        if (window.analytics && window.analytics.trackCTAClick) {
                            window.analytics.trackCTAClick(label, window.location.pathname);
                        }
                        
                        log('Tracked CTA click:', { label: label, href: href });
                    } catch (_) {
                        // no-op
                    }
                });
            });
        } catch (e) {
            // no-op
        }
    }

    function initWithConfig(cfg) {
        var portalId = cfg && cfg.portalId;
        var region = (cfg && cfg.region) || 'na1';
        var disableTracking = !!(cfg && cfg.disableTracking);

        var chain = Promise.resolve();
        if (!disableTracking) {
            chain = injectTrackingScript(portalId, region);
        }

        chain
        .then(loadFormsLibrary)
        .then(function () {
            createFormIfConfigured(cfg);
            if (!disableTracking) setupCtaTracking();
            // Ensure HS form is readable on dark background without touching page layout
            try {
                applyHubspotFormTheme();
                setTimeout(applyHubspotFormTheme, 300);
                setTimeout(applyHubspotFormTheme, 1200);
                enforcePageBackgroundIfNeeded();
                setTimeout(enforcePageBackgroundIfNeeded, 300);
                setTimeout(enforcePageBackgroundIfNeeded, 1200);
            } catch (_) {}
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchConfigAndInit);
    } else {
        fetchConfigAndInit();
    }

    function fetchConfigAndInit() {
        fetch('/hubspot-config.json', { cache: 'no-store' })
            .then(function (res) {
                if (!res.ok) throw new Error('Config fetch failed');
                return res.json();
            })
            .then(function (cfg) {
                log('Loaded HubSpot config:', cfg);
                initWithConfig(cfg || {});
            })
            .catch(function () {
                // Fallback: try to read from window.HUBSPOT_CONFIG if present
                var cfg = (window && window.HUBSPOT_CONFIG) || {};
                if (cfg && (cfg.portalId || cfg.formId)) {
                    log('Using window.HUBSPOT_CONFIG fallback');
                    initWithConfig(cfg);
                } else {
                    log('No HubSpot config found; tracking disabled.');
                }
            });
    }

    // Scope styles only to the HubSpot form container
    function applyHubspotFormTheme() {
        var target = document.getElementById('hubspot-form');
        if (!target) return;

        var styleId = 'hs-form-theme-override';
        var style = document.getElementById(styleId);
        var css = [
            '#hubspot-form .hs-form, #hubspot-form form { max-width: 760px; margin: 0 auto; }',
            '#hubspot-form .hs-form input, #hubspot-form .hs-form textarea, #hubspot-form .hs-form select { background: #ffffff !important; color: #000000 !important; border-radius: 10px; }',
            '#hubspot-form .hs-form label, #hubspot-form .hs-form legend { color: #cfcfe6 !important; }',
            '#hubspot-form .hs-form .hs-error-msgs label { color: #ff6b6b !important; }',
            '#hubspot-form .hs_submit .actions input[type="submit"] { background: var(--primary) !important; color: #fff !important; border-radius: 10px; font-weight: 600; padding: 0.75rem 1.25rem; }',
            '#hubspot-form .hs-form fieldset { border: none !important; }'
        ].join('\n');

        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.type = 'text/css';
            document.head.appendChild(style);
        }
        style.textContent = css;
    }

    // If some external CSS forces white background, re-assert our dark background
    function enforcePageBackgroundIfNeeded() {
        try {
            var styleId = 'dark-bg-fix';
            var style = document.getElementById(styleId);
            var css = 'html,body{background: var(--bg-primary) !important; color: var(--text-primary) !important;}';
            if (!style) {
                style = document.createElement('style');
                style.id = styleId;
                style.type = 'text/css';
                document.head.appendChild(style);
            }
            style.textContent = css;
            // keep last
            if (style !== document.head.lastElementChild) {
                document.head.appendChild(style);
            }
        } catch (_) { /* noop */ }
    }
})();


