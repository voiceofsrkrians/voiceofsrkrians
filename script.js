/* ============================================
   Voice of SRKRIANS — JavaScript
   Handles: Email sending, copy, toast, scroll
   animations, and mobile navigation.
   ============================================ */

// -----------------------------------------------
// 1. RECIPIENT EMAIL ADDRESSES
//    Update these if the official addresses change.
// -----------------------------------------------
const RECIPIENTS = {
  aicte: "chairman@aicte-india.org",
  apsche: "commissionerche@gmail.com",
  india_portal: "indiaportal@gov.in",
  narendra_modi: "narendramodi1234@gmail.com",
  e_samadhan: "e-samadhan@ugc.gov.in",
  pgrs: "pgrs-helpdesk@ap.gov.in",
};

// Influencers email addresses
const INFLUENCERS = {
  hitesh_choudhary: "team@hiteshchoudhary.com",
  dhruv_rathee: "contact@dhruvrathee.com",
  psd_talks: "events@psdtalk.com",
  vr_raja: "contact@vrraja.com",
  aye_jude: "info@ayejude.com",
  personal_brand: "kranthiworld32@gmail.com",
  sunny_yadav: "bayyasunnyyadav390@gmail.com",
};

// -----------------------------------------------
// 2. DEFAULT EMAIL TEMPLATE
//    Stored so we can reset the form if needed.
// -----------------------------------------------
const DEFAULT_SUBJECT =
  "Inquiry Regarding Retrospective Fee Revision — Request for Guidance";

const DEFAULT_BODY = `Respected Sir/Madam,

I am writing to seek guidance on a matter concerning students at SRKR Engineering College.

A retrospective fee revision has been implemented for currently enrolled students without prior notice. This has created financial challenges for students and their families, particularly those from economically modest backgrounds.

We respectfully seek clarification on whether this process aligns with the guidelines established by AICTE and APSCHE, which typically require:
- Due process and transparency in fee revisions
- Approval by the Fee Regulatory Committee
- Protection for students admitted under a previously established fee structure

We humbly request your esteemed office to:
1. Review the fee revision process followed by the institution
2. Provide guidance on compliance with AICTE / APSCHE regulations
3. Advise on appropriate measures to address student concerns

We approach this matter with respect and in accordance with all applicable laws and regulations.

Thank you for your time and consideration.

Respectfully,
A Student of SRKR Engineering College`;

// -----------------------------------------------
// 3. DYNAMICALLY POPULATE DROPDOWNS
//    Inject recipient and influencer options from JS objects
// -----------------------------------------------
function populateOfficialDropdown() {
  const select = document.getElementById("officialSelect");
  if (!select) return;

  // Clear existing options except the first placeholder
  while (select.options.length > 1) {
    select.remove(1);
  }

  // Map display names for officials
  const officialNames = {
    aicte: "AICTE Chairman",
    apsche: "APSCHE Commissioner",
    india_portal: "India Portal",
    narendra_modi: "PM Office",
    e_samadhan: "E-Samadhan UGC",
    pgrs: "PGRS AP Helpdesk",
  };

  // Add options from RECIPIENTS object
  Object.entries(RECIPIENTS).forEach(([key, email]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${officialNames[key]} (${email})`;
    select.appendChild(option);
  });
}

function populateInfluencerDropdown() {
  const select = document.getElementById("influencerSelect");
  if (!select) return;

  // Clear existing options except the first placeholder
  while (select.options.length > 1) {
    select.remove(1);
  }

  // Map display names for influencers
  const influencerNames = {
    hitesh_choudhary: "Hitesh Choudhary",
    dhruv_rathee: "Dhruv Rathee",
    psd_talks: "PSD Talks",
    vr_raja: "VR Raja",
    aye_jude: "Aye Jude",
    personal_brand: "Kranthi World",
    sunny_yadav: "Sunny Yadav",
  };

  // Add options from INFLUENCERS object
  Object.entries(INFLUENCERS).forEach(([key, email]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${influencerNames[key]} (${email})`;
    select.appendChild(option);
  });
}

function populateRecipientCards() {
  const container = document.querySelector(".recipient-cards");
  if (!container) return;

  // Clear existing cards
  container.innerHTML = "";

  // Map display names for officials
  const officialNames = {
    aicte: "AICTE",
    apsche: "APSCHE",
    india_portal: "India Portal",
    narendra_modi: "PM Office",
    e_samadhan: "E-Samadhan UGC",
    pgrs: "PGRS AP Helpdesk",
  };

  // Create cards from RECIPIENTS object
  Object.entries(RECIPIENTS).forEach(([key, email]) => {
    const card = document.createElement("div");
    card.className = "recipient-card";
    card.innerHTML = `<strong>${officialNames[key]}</strong><span>${email}</span>`;
    container.appendChild(card);
  });
}

// Initialize dropdowns on page load
document.addEventListener('DOMContentLoaded', () => {
  populateOfficialDropdown();
  populateInfluencerDropdown();
  populateRecipientCards();
});

// -----------------------------------------------
// 4. SEND EMAIL (via mailto)
//    Opens the user's default email client with
//    subject, body, and recipient pre-filled.
// -----------------------------------------------
function sendEmail(target, type = 'official') {
  // Read form values
  const subject = document.getElementById("emailSubject").value.trim();
  let body = document.getElementById("emailBody").value.trim();

  // Determine recipient(s)
  let to = "";
  let label = "";
  
  if (target === "all-officials") {
    to = Object.values(RECIPIENTS).join(",");
    label = "All Officials";
  } else if (target === "all-influencers") {
    to = Object.values(INFLUENCERS).join(",");
    label = "All Influencers";
  } else if (target === "selected-official") {
    const select = document.getElementById("officialSelect");
    const selectedKey = select.value;
    if (!selectedKey) {
      showToast("⚠️ Please select an official first.", "error");
      return;
    }
    to = RECIPIENTS[selectedKey];
    label = select.options[select.selectedIndex].text;
  } else if (target === "selected-influencer") {
    const select = document.getElementById("influencerSelect");
    const selectedKey = select.value;
    if (!selectedKey) {
      showToast("⚠️ Please select an influencer first.", "error");
      return;
    }
    to = INFLUENCERS[selectedKey];
    label = select.options[select.selectedIndex].text;
  } else if (type === 'influencer') {
    to = INFLUENCERS[target] || "";
    label = target.toUpperCase();
  } else {
    to = RECIPIENTS[target] || "";
    label = target.toUpperCase();
  }

  if (!to) {
    showToast("❌ Unknown recipient. Please try again.", "error");
    return;
  }

  // Build the mailto URL
  const mailtoURL =
    `mailto:${to}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  // Open the user's email client
  window.open(mailtoURL, "_blank");

  // Show success feedback
  showToast(`✅ Email client opened for ${label}!`);
}

// -----------------------------------------------
// 5. COPY EMAIL BODY TO CLIPBOARD
// -----------------------------------------------
function copyEmail() {
  const body = document.getElementById("emailBody").value;
  copyToClipboard(body, "📋 Email body copied to clipboard!");
}

// -----------------------------------------------
// 6. COPY SUBJECT TO CLIPBOARD
// -----------------------------------------------
function copySubject() {
  const subject = document.getElementById("emailSubject").value;
  copyToClipboard(subject, "📋 Subject copied to clipboard!");
}

// -----------------------------------------------
// 7. GENERIC CLIPBOARD HELPER
//    Uses the modern Clipboard API with a fallback.
// -----------------------------------------------
function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(successMsg))
      .catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

/**
 * Fallback copy method for older browsers or
 * insecure contexts (e.g. HTTP).
 */
function fallbackCopy(text, successMsg) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    showToast(successMsg);
  } catch {
    showToast("❌ Copy failed. Please copy manually.", "error");
  }

  document.body.removeChild(textarea);
}

// -----------------------------------------------
// 8. RESET FORM TO DEFAULTS
// -----------------------------------------------
function resetForm() {
  document.getElementById("emailSubject").value = DEFAULT_SUBJECT;
  document.getElementById("emailBody").value = DEFAULT_BODY;

  showToast("🔄 Form reset to default template.");
}

// -----------------------------------------------
// 9. TOAST NOTIFICATION
//    Shows a small message at the bottom of the
//    screen and auto-hides after 3 seconds.
// -----------------------------------------------
let toastTimer = null;

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  // Optional: style differently for errors
  toast.style.background = type === "error" ? "#ef4444" : "#1e293b";

  // Show
  toast.classList.add("show");

  // Clear previous timer if still active
  if (toastTimer) clearTimeout(toastTimer);

  // Hide after 3s
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// -----------------------------------------------
// 10. NAVBAR — Scroll shadow & active link
// -----------------------------------------------
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  // Add shadow when scrolled
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// -----------------------------------------------
// 11. MOBILE HAMBURGER MENU TOGGLE
// -----------------------------------------------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu when a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// -----------------------------------------------
// 12. SCROLL-TRIGGERED ANIMATIONS
//     Uses IntersectionObserver to add .visible
//     class when elements scroll into view.
// -----------------------------------------------
const observerOptions = {
  threshold: 0.15, // trigger when 15% visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // animate only once
    }
  });
}, observerOptions);

// Observe all elements marked for animation
document.querySelectorAll(".animate-on-scroll").forEach((el) => {
  observer.observe(el);
});
