const servicesData = {
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

const panel = document.getElementById("detailsPanel");
const panelContent = document.querySelector(".panel-content");
const title = document.getElementById("panelTitle");
const text = document.getElementById("panelText");
const ctaBtn = document.getElementById("panelCtaBtn");
const closeIcon = document.getElementById("closePanel");
const closeButton = document.getElementById("closeBtn");

document.querySelectorAll(".service-box").forEach(box => {
    box.addEventListener("click", () => {
        const key = box.dataset.service;
        const data = servicesData[key];
        title.textContent = box.querySelector("h3").textContent;
        text.textContent = data.text;
        ctaBtn.setAttribute("href", data.link);
        panel.style.display = "flex";
    });
});

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
