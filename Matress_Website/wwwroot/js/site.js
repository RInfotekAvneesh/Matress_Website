// Velora Living – site interactions
(function () {
    "use strict";

    const WA_NUMBER = "971545721826";
    const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

    // Modals live inside animated cards; move them to <body> so `transform` on parents can't break positioning.
    document.querySelectorAll(".modal").forEach((m) => document.body.appendChild(m));

    /* ---------- Navbar: solid on scroll ---------- */
    const nav = document.getElementById("mainNav");
    const backTop = document.querySelector(".back-to-top");
    const onScroll = () => {
        const y = window.scrollY;
        nav && nav.classList.toggle("scrolled", y > 60);
        backTop && backTop.classList.toggle("show", y > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backTop && backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // Close mobile menu after a link is tapped
    document.querySelectorAll("#navMenu .nav-link").forEach((link) =>
        link.addEventListener("click", () => {
            const menu = document.getElementById("navMenu");
            if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
        })
    );

    /* ---------- Scroll reveal ---------- */
    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                // small stagger for siblings in the same row
                const siblings = Array.from(e.target.parentElement.children).filter((c) => c.classList.contains("reveal"));
                e.target.style.transitionDelay = `${Math.min(siblings.indexOf(e.target), 5) * 90}ms`;
                e.target.classList.add("in");
                io.unobserve(e.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add("in"));
    }

    /* ---------- Counters ---------- */
    const counters = document.querySelectorAll(".counter");
    if (counters.length && "IntersectionObserver" in window) {
        const co = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target, target = +el.dataset.target, suffix = el.dataset.suffix || "";
                const start = performance.now(), dur = 1600;
                const tick = (t) => {
                    const p = Math.min((t - start) / dur, 1);
                    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                co.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach((c) => co.observe(c));
    }

    /* ---------- Product modal: photo gallery ---------- */
    document.querySelectorAll(".modal-gallery").forEach((gal) => {
        const main = gal.querySelector(".gallery-main");
        gal.querySelectorAll(".gallery-thumbs button").forEach((btn) =>
            btn.addEventListener("click", () => {
                main.src = btn.querySelector("img").src;
                gal.querySelectorAll(".gallery-thumbs button").forEach((b) => b.classList.toggle("active", b === btn));
            })
        );
    });

    /* ---------- Product modal: size -> WhatsApp link ---------- */
    document.querySelectorAll(".modal").forEach((modal) => {
        const select = modal.querySelector(".size-select");
        const link = modal.querySelector(".wa-size-link");
        if (!select || !link) return;
        const update = () => {
            link.href = waLink(`Hello Velora Living, I'm interested in the ${link.dataset.product} mattress, size ${select.value}. Please share the price and availability.`);
        };
        select.addEventListener("change", update);
        update();
    });

    /* ---------- Collection: filter, search, sort ---------- */
    const grid = document.getElementById("productGrid");
    if (grid) {
        const cols = Array.from(grid.querySelectorAll(".product-col"));
        const original = cols.slice();
        const pills = document.querySelectorAll(".collection-toolbar [data-filter]");
        const search = document.getElementById("productSearch");
        const sort = document.getElementById("productSort");
        const count = document.getElementById("resultCount");
        const empty = document.getElementById("noResults");
        let filter = "all";

        const apply = () => {
            const q = (search.value || "").trim().toLowerCase();
            let shown = 0;
            cols.forEach((col) => {
                const card = col.querySelector(".product-card");
                const okCat = filter === "all" || card.dataset.category === filter;
                const okText = !q || card.textContent.toLowerCase().includes(q);
                const show = okCat && okText;
                col.classList.toggle("hide", !show);
                if (show) { shown++; col.classList.add("in"); }
            });
            count.textContent = shown;
            empty.classList.toggle("d-none", shown > 0);
        };

        const doSort = () => {
            const key = sort.value;
            const card = (c) => c.querySelector(".product-card").dataset;
            let ordered = original.slice();
            if (key === "soft") ordered.sort((a, b) => card(a).firm - card(b).firm);
            if (key === "firm") ordered.sort((a, b) => card(b).firm - card(a).firm);
            if (key === "name") ordered.sort((a, b) => card(a).name.localeCompare(card(b).name));
            ordered.forEach((c) => grid.appendChild(c));
        };

        const setFilter = (f) => {
            filter = f;
            pills.forEach((p) => p.classList.toggle("active", p.dataset.filter === f));
            apply();
        };

        pills.forEach((p) => p.addEventListener("click", () => {
            setFilter(p.dataset.filter);
            history.replaceState(null, "", p.dataset.filter === "all" ? location.pathname : "#" + p.dataset.filter);
        }));
        search.addEventListener("input", apply);
        sort.addEventListener("change", doSort);

        // Deep link from footer, e.g. /Home/Collection#foam
        const hash = location.hash.replace("#", "");
        if (hash && document.querySelector(`[data-filter="${hash}"]`)) setFilter(hash);
    }

    /* ---------- FAQ: search + category ---------- */
    const faqAcc = document.getElementById("faqAccordion");
    if (faqAcc) {
        const items = Array.from(faqAcc.querySelectorAll(".faq-item"));
        const pills = document.querySelectorAll("[data-faq]");
        const search = document.getElementById("faqSearch");
        const empty = document.getElementById("faqEmpty");
        let group = "all";

        const apply = () => {
            const q = search.value.trim().toLowerCase();
            let shown = 0;
            items.forEach((it) => {
                const ok = (group === "all" || it.dataset.group === group) && (!q || it.textContent.toLowerCase().includes(q));
                it.classList.toggle("hide", !ok);
                if (ok) { shown++; it.classList.add("in"); }
            });
            empty.classList.toggle("d-none", shown > 0);
        };
        pills.forEach((p) => p.addEventListener("click", () => {
            group = p.dataset.faq;
            pills.forEach((x) => x.classList.toggle("active", x === p));
            apply();
        }));
        search.addEventListener("input", apply);
    }

    /* ---------- Mattress finder ---------- */
    const finder = document.getElementById("finderCard");
    if (finder) {
        const answers = {};
        const steps = finder.querySelectorAll(".finder-step");
        const bar = finder.querySelector(".finder-progress span");
        const show = (n) => {
            steps.forEach((s) => s.classList.toggle("active", +s.dataset.step === n));
            bar.style.width = `${Math.min(n, 3) / 3 * 100}%`;
        };
        const recommend = ({ pos, pain, hot }) => {
            if (pain === "yes" && pos !== "side") return ["Velora Medical Mattress", "Firm orthopedic support keeps your spine aligned and eases lower-back pressure."];
            if (pain === "yes") return ["Velora Euro Top Mattress", "A supportive core with a cushioned Euro top relieves pressure at the shoulders and hips, which suits side sleepers with aches."];
            if (hot === "yes") return ["Velora Pocket Spring Mattress", "Open pocket-spring construction lets air flow freely, helping you stay fresh through warm Dubai nights."];
            if (pos === "side") return ["Velora Pillow Top Mattress", "A plush pillow top cushions your shoulders and hips for hotel-style comfort."];
            if (pos === "stomach") return ["Velora Medical Mattress", "A firmer surface stops your hips sinking and keeps your back neutral."];
            return ["Velora Pocket Spring Mattress", "Medium-firm pocket springs give balanced support and comfort for back sleepers and couples."];
        };
        finder.querySelectorAll(".finder-options button").forEach((btn) =>
            btn.addEventListener("click", () => {
                answers[btn.dataset.key] = btn.dataset.val;
                const step = +btn.closest(".finder-step").dataset.step;
                if (step < 3) return show(step + 1);
                const [name, why] = recommend(answers);
                document.getElementById("finderName").textContent = name;
                document.getElementById("finderWhy").textContent = why;
                document.getElementById("finderWa").href = waLink(`Hello Velora Living, the Mattress Finder recommended the ${name}. Can you share sizes and price?`);
                show(4);
            })
        );
        document.getElementById("finderReset").addEventListener("click", () => show(1));
    }

    /* ---------- Contact form -> WhatsApp / Email ---------- */
    const form = document.getElementById("contactForm");
    if (form) {
        let via = "whatsapp";
        form.querySelectorAll("[data-via]").forEach((b) => b.addEventListener("click", () => (via = b.dataset.via)));
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            form.classList.add("was-validated");
            if (!form.checkValidity()) return;
            const v = (id) => document.getElementById(id).value.trim();
            const body = `Name: ${v("cName")}\nPhone: ${v("cPhone")}\nEmail: ${v("cEmail") || "-"}\nInterested in: ${v("cInterest")}\n\n${v("cMessage")}`;
            if (via === "email") {
                location.href = `mailto:veloraliving2026@gmail.com?subject=${encodeURIComponent("Website Enquiry – " + v("cInterest"))}&body=${encodeURIComponent(body)}`;
            } else {
                window.open(waLink("Hello Velora Living!\n\n" + body), "_blank", "noopener");
            }
            document.getElementById("formSuccess").classList.remove("d-none");
            form.reset();
            form.classList.remove("was-validated");
        });
    }
})();
