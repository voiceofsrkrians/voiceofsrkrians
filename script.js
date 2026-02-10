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
// 3. EMAIL COUNTER
//    Track the number of emails sent using localStorage
// -----------------------------------------------
// function getEmailCount() {
//   return parseInt(localStorage.getItem('emailCount') || '0', 10);
// }

// function incrementEmailCount() {
//   const count = getEmailCount() + 1;
//   localStorage.setItem('emailCount', count.toString());
//   updateEmailCounterDisplay();
// }

// function updateEmailCounterDisplay() {
//   const counterElement = document.getElementById('emailCounter');
//   if (counterElement) {
//     counterElement.textContent = getEmailCount();
//   }
// }

// Initialize counter on page load
document.addEventListener('DOMContentLoaded', () => {
  updateEmailCounterDisplay();
});

// -----------------------------------------------
// 4. SEND EMAIL (via mailto)
//    Opens the user's default email client with
//    subject, body, and recipient pre-filled.
// -----------------------------------------------
function sendEmail(target, type = 'official') {
  // Read form values
  const name = document.getElementById("studentName").value.trim();
  const branch = document.getElementById("studentBranch").value.trim();
  const year = document.getElementById("studentYear").value;

  const subject = document.getElementById("emailSubject").value.trim();
  let body = document.getElementById("emailBody").value.trim();

  // Append student details to body if provided
  const details = [];
  if (name) details.push(`Name: ${name}`);
  if (branch) details.push(`Branch: ${branch}`);
  if (year) details.push(`Year: ${year}`);

  if (details.length > 0) {
    body += "\n\n--- Student Details ---\n" + details.join("\n");
  }

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

  // Increment email counter
  incrementEmailCount();

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
  document.getElementById("studentName").value = "";
  document.getElementById("studentBranch").value = "";
  document.getElementById("studentYear").value = "";
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
