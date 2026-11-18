(() => {
    "use strict";

    const endpoint = "https://metrics.visaphoto1tap.com/v1/store-click";
    const attributionSelector = "a[data-acquisition-store][data-acquisition-app]";
    const canonical = document.querySelector('link[rel="canonical"]');
    const page = canonical ? new URL(canonical.href) : window.location;
    const path = page.pathname;
    const params = new URLSearchParams(window.location.search);
    const qa = navigator.webdriver === true || params.getAll("acq_qa").includes("1");
    const optedOut = navigator.globalPrivacyControl === true
        || navigator.doNotTrack === "1" || window.doNotTrack === "1";
    const referrals = {
        "/": { source: "android_app", medium: "referral", campaign: "us_export_share" },
        "/guides/ds-160-photo-upload-failed.html": {
            source: "youtube", medium: "video", campaign: "us_ds160_file_checks",
        },
    };
    const sourcePath = (value) => value.replace(/^\/(?:zh-hans|zh-hant|es|ja|de|fr)(?=\/)/, "");
    const referral = referrals[sourcePath(path)];
    const tagged = window.location.origin === "https://us.visaphoto1tap.com"
        && referral && Object.entries(referral).every(([key, expected]) => {
            const values = params.getAll("utm_" + key);
            return values.length === 1 && values[0] === expected;
        });

    function sendEvent(store, app) {
        if (optedOut) return;

        const body = JSON.stringify({
            path,
            store,
            app,
            ...(tagged ? { campaign: referral.campaign } : {}),
            ...(qa ? { qa: true } : {}),
        });
        fetch(endpoint, {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            referrerPolicy: "no-referrer",
            keepalive: true,
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body,
        }).catch(() => {});
    }

    function recordStoreClick(event) {
        if (!event.isTrusted || event.defaultPrevented) return;
        if (event.type === "auxclick" ? event.button !== 1 : event.button !== 0) return;
        if (!(event.target instanceof Element)) return;

        const link = event.target.closest(attributionSelector);
        if (!link) return;
        const { acquisitionStore: store, acquisitionApp: app } = link.dataset;
        sendEvent(store, app);
    }

    if (tagged || qa || optedOut) {
        for (const link of document.querySelectorAll(attributionSelector)) {
            const destination = new URL(link.href);
            if (link.dataset.acquisitionStore === "app-store" && destination.origin === "https://apps.apple.com") {
                if (qa || optedOut) {
                    for (const key of ["pt", "ct", "mt"]) destination.searchParams.delete(key);
                } else {
                    destination.searchParams.set("ct", referral.campaign);
                }
            } else if (link.dataset.acquisitionStore === "google-play" && destination.origin === "https://play.google.com") {
                if (qa || optedOut) {
                    destination.searchParams.delete("referrer");
                } else {
                    const referrer = new URLSearchParams(destination.searchParams.get("referrer"));
                    for (const [key, value] of Object.entries(referral)) referrer.set("utm_" + key, value);
                    destination.searchParams.set("referrer", referrer);
                }
            } else {
                continue;
            }
            link.href = destination.href;
        }
    }

    if (tagged && !optedOut) {
        for (const link of document.querySelectorAll("#page-language a[hreflang]")) {
            const language = new URL(link.href);
            if (language.origin !== page.origin || sourcePath(language.pathname) !== sourcePath(path)) continue;
            for (const [key, value] of Object.entries(referral)) language.searchParams.set("utm_" + key, value);
            language.searchParams.set("acq_step", "language");
            if (qa) language.searchParams.set("acq_qa", "1");
            link.href = language.href;
        }
        if (params.get("acq_step") !== "language") {
            const recordLanding = () => sendEvent("landing", "us");
            if (document.prerendering) {
                document.addEventListener("prerenderingchange", recordLanding, { once: true });
            } else {
                recordLanding();
            }
        }
    }

    document.addEventListener("click", recordStoreClick);
    document.addEventListener("auxclick", recordStoreClick);
})();
