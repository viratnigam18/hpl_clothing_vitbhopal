# 📦 add_later — Components & Sections to Add Later

This folder stores UI sections and components that have been temporarily removed from the website but are ready to be re-integrated when needed.

---

## Contents

### `ChooseYourTeam_section.jsx`
The **"Choose Your Team"** interactive section that was previously on the Home page.

**Features:**
- 3D rotating team badge carousel (7 HPL teams)
- Live 3D jersey viewer on the right (color updates per team)
- Team dot indicators + animated team name
- Navigation arrows

**To re-add:** Paste the JSX block from this file back into `src/pages/Home.jsx` between the Hero section and the Countdown Banner. Also restore these imports and state variables (see comments inside the file).

---

## Other sections to add later

| Section / Feature | Status | Notes |
|---|---|---|
| Google Form payment link | ⏳ Pending | Replace `GOOGLE_FORM_URL` in `src/pages/Cart.jsx` with your actual form URL |
| Team photos / product images | ⏳ Pending | Add to `public/images/` as needed |
