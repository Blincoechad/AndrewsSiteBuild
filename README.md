# Andy Seely Resource Hub Website

This repository contains the source for a multi-section personal and professional website for Andy Seely.

## What This Website Is Used For

The site serves as a central hub for:

- Professional profile and background
- Academic work across multiple schools
- IEEE and IEEE Computer Society involvement
- Consulting services and client-facing information
- Personal interest pages

It is designed as a static site (HTML, CSS, JavaScript) with shared navigation, reusable page structure, and section-specific themes.

## Core Features

- Multi-section navigation with dropdown menus (Schools, Consulting, IEEE)
- Dedicated content areas for:
  - Hillsborough College
  - UMGC
  - Schiller International University
  - IEEE and IEEE-CS
  - Consulting
  - Personal pages
- Shared responsive layout behavior (mobile menu, adaptive grids)
- Reusable roster cards rendered by JavaScript
- Avatar circles generated from member initials
- Role-based badge and avatar color styling

## Tech Stack

- HTML5 for page structure
- CSS for base styles and section-specific themes
- Vanilla JavaScript for interactions and roster rendering

## Project Structure (High Level)

- `index.html`, `about.html`: main landing and profile pages
- `hillsborough/`, `umgc/`, `ieee/`, `ieee-cs/`, `consulting/`, `personal/`, `schiller/`: section pages
- `css/`: global and section-specific stylesheets
- `js/main.js`: shared interactions and roster rendering logic
- `media/`: image assets

## How Roster Rendering Works

Roster cards are generated at runtime in `js/main.js`.

### Key Concepts

- `ROSTERS`: defines each roster's member list
- `ROLE_CONFIGS`: maps each role to:
  - `avatarClass` (circle color)
  - `badgeClass` (role-pill color)
- `.roster-container[data-roster-id="..."]` in HTML links a page section to one roster definition
- `initials(name)` automatically converts a member name into a 1-2 letter avatar label

## How To Change the Roster

Edit roster data in `js/main.js` under the section:

`// ROSTER Roles DATA (EDIT HERE ONLY)`

### 1) Find the roster you want to update

Examples currently used:

- `"ieee-roles"`
- `"coding-roster"`
- `"umgc-ieee"`

### 2) Update members

Each member follows this shape:

```js
{ name: "Full Name", role: "RoleName" }
```

Add, remove, or reorder items inside the `members` array.

### 3) Make sure role names exist in the roster's config

Each roster has a `config` value (such as `ieee`, `codingClub`, `umgcIEEE`).
That config must contain the role in `ROLE_CONFIGS`, or the fallback style is used.

## How To Change Badge and Avatar Colors

Color behavior is controlled in two places:

1. `js/main.js` role mapping
2. Section CSS class definitions

### Step A: Map role to class names in JavaScript

In `ROLE_CONFIGS` (inside `js/main.js`), each role maps to class names:

```js
President: { avatarClass: "av-president", badgeClass: "b-president" }
```

You can either:

- Reuse existing classes, or
- Point a role to new classes you create

### Step B: Edit or create class styles in CSS

Define the class colors in the stylesheet used by that page section:

- `css/ieee.css` for IEEE pages
- `css/ieee-cs.css` for IEEE-CS pages
- `css/hillsborough.css` for Hillsborough coding roster pages
- `css/umgc.css` for UMGC roster pages

Typical class patterns:

- Avatar circle classes: `.av-name of postion or role`
- Badge pill classes: `.b-name of position or role`

Example:

```css
.av-president {
  background: rgba(201, 149, 111, 0.25);
  color: #dbb08e;
}

.b-president {
  background: rgba(36, 132, 157, 0.2);
  color: rgb(151, 186, 238);
  border: 1px solid rgba(36, 132, 157, 0.35);
}
```

## Notes

- Social links and contact details are currently hard-coded in page HTML.
- Some project TODO items also exist in `.env` and if anything private needs to be added
  it can go in the `.env` files as well.
- This README is focused on current structure and roster/theme maintenance.
