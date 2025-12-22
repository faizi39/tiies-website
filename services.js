const fallbackData = {
    "basic-computer": {
        text: "Master digital basics: typing, file management, internet safety, email, MS Word, Excel, and PowerPoint. Ideal for students, job seekers, and beginners.",
        link: "basic-computer.html"
    },
    "skills-programme": {
        text: "Choose focused tracks like Graphic Design, Web Development, Digital Marketing, Video Editing, and Office Productivity with real projects.",
        link: "skills-development.html"
    },
    "earn-online": {
        text: "Learn practical strategies to monetize your skills via freelancing platforms, e-commerce, affiliate marketing, and content creation.",
        link: "earn-online.html"
    },
    "freelancing": {
        text: "Build a professional profile, write winning proposals, price your services, manage clients, and deliver with confidence.",
        link: "freelancing.html"
    },
    "start-business": {
        text: "Validate an idea, register your venture, build a brand, set up digital presence, and plan sustainable growth with mentorship.",
        link: "start-business.html"
    }
};

let servicesData = {};

async function fetchServices() {
    try {
        const res = await fetch("api/services.php", { headers: { "Accept": "application/json" } });
        if (!res.ok) throw new Error("Network response was not ok");
        const payload = await res.json();
        const map = {};
        if (payload && Array.isArray(payload.services)) {
            payload.services.forEach(item => {
                if (item && item.key) {
                    map[item.key] = { text: item.text, link: item.link, title: item.title };
                }
            });
        }
        return Object.keys(map).length ? map : fallbackData;
    } catch (e) {
        return fallbackData;
    }
}

const panel = document.getElementById("detailsPanel");
const panelContent = document.querySelector(".panel-content");
const title = document.getElementById("panelTitle");
const text = document.getElementById("panelText");
const ctaBtn = document.getElementById("panelCtaBtn");
const closeIcon = document.getElementById("closePanel");
const closeButton = document.getElementById("closeBtn");
const form = document.getElementById("serviceRequestForm");
const formStatus = document.getElementById("formStatus");
let currentServiceKey = null;

async function initServices() {
    servicesData = await fetchServices();

    document.querySelectorAll(".service-box").forEach(box => {
        box.addEventListener("click", () => {
            const key = box.dataset.service;
            const data = servicesData[key] || fallbackData[key];
            const titleText = data.title || box.querySelector("h3").textContent;
            title.textContent = titleText;
            text.textContent = data.text;
            ctaBtn.setAttribute("href", data.link);
            currentServiceKey = key;
            panel.style.display = "flex";
            if (formStatus) formStatus.textContent = "";
        });
    });
}

initServices();

closeIcon.addEventListener("click", closePanel);
if (closeButton) closeButton.addEventListener("click", closePanel);

panel.addEventListener("click", closePanel);

panelContent.addEventListener("click", function (e) {
    e.stopPropagation();
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closePanel();
    }
});

function closePanel() {
    panel.style.display = "none";
}

async function submitRequest(e) {
    e.preventDefault();
    if (!form) return;
    const name = form.querySelector('#reqName')?.value.trim();
    const email = form.querySelector('#reqEmail')?.value.trim();
    const phone = form.querySelector('#reqPhone')?.value.trim();
    const message = form.querySelector('#reqMessage')?.value.trim();

    if (!currentServiceKey) {
        formStatus.textContent = "Please select a program first.";
        return;
    }
    if (!name || !email) {
        formStatus.textContent = "Name and email are required.";
        return;
    }
    formStatus.textContent = "Sending...";
    try {
        const res = await fetch("api/services.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                service_key: currentServiceKey,
                name,
                email,
                phone,
                message
            })
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload.success) {
            formStatus.textContent = payload.error || "Something went wrong.";
            return;
        }
        formStatus.textContent = "Request sent! We'll contact you soon.";
        form.reset();
    } catch (err) {
        formStatus.textContent = "Network error. Please try again.";
    }
}

if (form) {
    form.addEventListener('submit', submitRequest);
}
