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
  document.querySelectorAll(".navbar__nav a, .sub-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      currentPath.endsWith(href.replace("../", "").replace("./", ""))
    ) {
      link.classList.add("active");
    }
  });

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
// ── CONFIG ──────────────────────────────────────────────
const PIN = "1234"; // Change this to your own PIN
// ────────────────────────────────────────────────────────

const COLORS = ["av-blue", "av-teal", "av-purple", "av-coral", "av-amber"];
const BADGE_CLASS = {
  President: "b-president",
  Officer: "b-officer",
  Member: "b-member",
  Treasurer: "b-treasurer",
  Secretary: "b-secretary",
};

let members = [];
let unlocked = false;
let rosterId = "club_members"; // Default key for backward compatibility

// Get roster ID from data attribute if it exists
const rosterContainer = document.querySelector(".roster-container");
if (rosterContainer && rosterContainer.dataset.rosterId) {
  rosterId = rosterContainer.dataset.rosterId;
}

// Load members from localStorage (persists between visits)
function load() {
  const saved = localStorage.getItem(rosterId);
  if (saved) {
    members = JSON.parse(saved);
  } else {
    // Default starter data — remove or edit these
    members = [
      { name: "Alex Johnson", role: "President" },
      { name: "Maria Garcia", role: "Treasurer" },
      { name: "Sam Lee", role: "Secretary" },
      { name: "Jordan Smith", role: "Member" },
    ];
  }
  render();
}

function save() {
  localStorage.setItem(rosterId, JSON.stringify(members));
}

// Generate initials from a name
function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

// Pick a consistent color based on the name
function colorFor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return COLORS[h % COLORS.length];
}

function render() {
  // Public card grid
  const grid = document.getElementById("card-grid");
  if (!members.length) {
    grid.innerHTML = '<p class="empty">No members yet.</p>';
  } else {
    grid.innerHTML = members
      .map(
        (m) => `
          <div class="card">
            <div class="avatar ${colorFor(m.name)}">${initials(m.name)}</div>
            <div>
              <div class="name">${m.name}</div>
              <div class="badge ${BADGE_CLASS[m.role] || "b-member"}">${m.role}</div>
            </div>
          </div>
        `,
      )
      .join("");
  }

  // Admin list (only when unlocked)
  if (unlocked) {
    const list = document.getElementById("admin-list");
    if (!members.length) {
      list.innerHTML = '<p class="empty">No members yet — add one above.</p>';
    } else {
      list.innerHTML = members
        .map(
          (m, i) => `
            <div class="member-row">
              <span>${m.name}<span class="role-tag">${m.role}</span></span>
              <button class="del-btn" onclick="removeMember(${i})">&#x2715;</button>
            </div>
          `,
        )
        .join("");
    }
  }
}

function checkPin() {
  const val = document.getElementById("pin-input").value;
  if (val === PIN) {
    unlocked = true;
    document.getElementById("pin-gate").style.display = "none";
    document.getElementById("admin-content").style.display = "block";
    document.getElementById("lock-btn").style.display = "inline-block";
    document.getElementById("pin-err").textContent = "";
    render();
  } else {
    document.getElementById("pin-err").textContent = "Incorrect PIN.";
  }
}

function toggleLock() {
  unlocked = false;
  document.getElementById("pin-gate").style.display = "block";
  document.getElementById("admin-content").style.display = "none";
  document.getElementById("lock-btn").style.display = "none";
  document.getElementById("pin-input").value = "";
  document.getElementById("pin-err").textContent = "";
}

function addMember() {
  const name = document.getElementById("new-name").value.trim();
  const role = document.getElementById("new-role").value;
  if (!name) return;
  members.push({ name, role });
  document.getElementById("new-name").value = "";
  save();
  render();
}

function removeMember(i) {
  members.splice(i, 1);
  save();
  render();
}

// Allow pressing Enter in the PIN field
document.getElementById("pin-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPin();
});

load();
