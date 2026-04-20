/* ============================================================
   Andy Seely Portfolio — Global JavaScript
   Handles: dropdown nav, mobile menu, active link detection
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Dropdown navigation ── */
  const dropdownTriggers = document.querySelectorAll("[data-dropdown]");

  dropdownTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.closest("li");
      const isOpen = li.classList.contains("open");

      // Close all other dropdowns
      document
        .querySelectorAll("li.open")
        .forEach((el) => el.classList.remove("open"));

      if (!isOpen) li.classList.add("open");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document
      .querySelectorAll("li.open")
      .forEach((el) => el.classList.remove("open"));
  });

  /* ── Mobile menu toggle ── */
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.textContent = isOpen ? "✕" : "☰";
      toggle.setAttribute("aria-expanded", isOpen);
    });
  }

  /* ── Mark active link based on current URL ── */
  const currentPath = window.location.pathname;

  // Strip any hardcoded active classes first
  document
    .querySelectorAll(".navbar__nav a, .navbar__nav button, .sub-nav a")
    .forEach((el) => {
      el.classList.remove("active");
    });

  document.querySelectorAll(".navbar__nav a, .sub-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const normalizedHref = href.replace("../", "").replace("./", "");
    // Use a stricter check: path must end with the full normalized href,
    // preceded by either the start of the string or a "/"
    const pattern = new RegExp(
      `(^|/)${normalizedHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    );
    if (pattern.test(currentPath)) {
      link.classList.add("active");
      // If the link is inside a dropdown, also highlight the parent button
      const parentLi = link.closest(".navbar__nav > li");
      if (parentLi) {
        const trigger = parentLi.querySelector(
          ":scope > button[data-dropdown]",
        );
        if (trigger) trigger.classList.add("active");
      }
    }
  });

  // Highlight the parent dropdown button for any sub-page not directly listed
  // Maps folder names to their dropdown data-dropdown attribute value
  const sectionMap = {
    hillsborough: "schools",
    umgc: "schools",
    schiller: "schools",
    consulting: "consulting",
    ieee: "ieee",
    "ieee-cs": "ieee",
    personal: "personal",
  };
  const folder = currentPath.split("/").filter(Boolean).slice(-2, -1)[0];
  if (folder && sectionMap[folder]) {
    const btn = document.querySelector(
      `.navbar__nav button[data-dropdown="${sectionMap[folder]}"]`,
    );
    if (btn) btn.classList.add("active");
  }

  /* ── Sub-nav smooth scroll to sections ── */
  document.querySelectorAll('.sub-nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        const offset = 64 + 48; // navbar + subnav height
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ── Intersection observer for sub-nav active states ── */
  const sections = document.querySelectorAll("section[id]");
  const subLinks = document.querySelectorAll('.sub-nav a[href^="#"]');

  if (sections.length && subLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            subLinks.forEach((l) => l.classList.remove("active"));
            const active = document.querySelector(
              `.sub-nav a[href="#${entry.target.id}"]`,
            );
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── Fade-in animation on scroll ── */
  const fadeEls = document.querySelectorAll(
    ".card, .timeline-item, .content-block",
  );
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    fadeObserver.observe(el);
  });
});

// Each role maps to one avatar color class and one badge class.
// To change a role's color, edit the avatarClass value here.
// Available avatar classes: av-teal  av-blue  av-purple  av-coral  av-amber  av-green
// ===============================
// ROLE CONFIGS (PER CLUB)
// ===============================
const ROLE_CONFIGS = {
  ieee: {
    President: { avatarClass: "av-coral", badgeClass: "b-president" },
    Officer: { avatarClass: "av-coral", badgeClass: "b-officer" },
    Treasurer: { avatarClass: "av-amber", badgeClass: "b-treasurer" },
    Member: { avatarClass: "av-blue", badgeClass: "b-member" },
    Assistant: { avatarClass: "av-green", badgeClass: "b-assistant" },
  },
  //  Hillsborough page
  codingClub: {
    Lead: { avatarClass: "av-coral", badgeClass: "b-lead" },
    Developer: { avatarClass: "av-amber", badgeClass: "b-dev" },
    Designer: { avatarClass: "av-blue", badgeClass: "b-designer" },
    President: { avatarClass: "av-coral", badgeClass: "b-president" },
    Analytics: { avatarClass: "av-blue", badgeClass: "b-analytics" },
  },

  umgcIEEE: {
    Chair: { avatarClass: "av-coral", badgeClass: "b-chair" },
    ViceChair: { avatarClass: "av-amber", badgeClass: "b-vice" },
    Member: { avatarClass: "av-blue", badgeClass: "b-member" },
  },
};

// ===============================
// ROSTER Roles DATA (EDIT HERE ONLY)
// ===============================
const ROSTERS = {
  "ieee-roles": {
    config: "ieee",
    members: [
      { name: "Maria Garcia", role: "President" },
      { name: "Sam Lee", role: "Treasurer" },
      { name: "Jordan Smith", role: "Member" },
      { name: "Chad Blincoe", role: "Assistant" },
    ],
  },
  // hillsborough coding club
  "coding-roster": {
    config: "codingClub",
    members: [
      { name: "Alex Dev", role: "Lead" },
      { name: "Chris Code", role: "Developer" },
      { name: "Taylor UI", role: "Designer" },
      { name: "Taylor UI", role: "President" },
      { name: "Chad Blincoe", role: "Analytics" },
    ],
  },

  "umgc-ieee": {
    config: "umgcIEEE",
    members: [
      { name: "Riley Tech", role: "chair" },
      { name: "Jordan Net", role: "ViceChair" },
      { name: "Casey Byte", role: "Member" },
    ],
  },
};

const DEFAULT_ROLE = { avatarClass: "av-blue", badgeClass: "b-member" };

// ===============================
// INIT
// ===============================
document.querySelectorAll(".roster-container").forEach((container) => {
  const rosterId = container.dataset.rosterId;
  const roster = ROSTERS[rosterId];

  if (!roster) return;

  const ROLE_CONFIG = ROLE_CONFIGS[roster.config];
  const members = roster.members;

  const grid = container.querySelector(".card-grid");

  render(grid, members, ROLE_CONFIG);
});

// ===============================
// HELPERS
// ===============================
function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

function render(grid, members, ROLE_CONFIG) {
  if (!grid) return;

  if (!members.length) {
    grid.innerHTML = '<p class="empty">No members yet.</p>';
    return;
  }

  grid.innerHTML = members
    .map((m) => {
      const cfg = ROLE_CONFIG[m.role] || DEFAULT_ROLE;

      return `
      <div class="card">
        <div class="avatar ${cfg.avatarClass}">
          ${initials(m.name)}
        </div>
        <div>
          <div class="name">${m.name}</div>
          <div class="badge ${cfg.badgeClass}">
            ${m.role}
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}
