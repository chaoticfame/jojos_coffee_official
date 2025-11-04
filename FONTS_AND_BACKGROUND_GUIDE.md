# How to Use JoJo Cafe Fonts and Background in Another Project

This guide shows you how to extract and use the fonts and background patterns from the JoJo Cafe project in your other website projects.

## 1. Fonts Setup

### Step 1: Add Google Fonts to your HTML

Add this to the `<head>` section of your HTML file:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

### Step 2: CSS Variables (if using CSS)

Add these font variables to your CSS:

```css
:root {
  --font-sans: "Roboto", sans-serif;
  --font-display: "Cinzel Decorative", serif;
}

body {
  font-family: var(--font-sans);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}
```

### Step 3: Tailwind CSS (if using Tailwind)

In your `tailwind.config.js` or `tailwind.config.ts`:

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', 'sans-serif'],
        display: ['"Cinzel Decorative"', 'serif'],
      },
    },
  },
}
```

Then use in your components:
- `font-sans` for body text
- `font-display` for headings

---

## 2. Background Pattern - Diamond Pattern Component

### Option A: React Component (if using React)

Create a file `DiamondPattern.tsx`:

```tsx
export default function DiamondPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diamond-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Purple diamond */}
          <rect x="0" y="0" width="40" height="40" fill="#9B3D9B" transform="rotate(45 20 20)" />
          {/* Gold diamond */}
          <rect x="40" y="0" width="40" height="40" fill="#8B7355" transform="rotate(45 60 20)" />
          <rect x="0" y="40" width="40" height="40" fill="#8B7355" transform="rotate(45 20 60)" />
          {/* Purple diamond */}
          <rect x="40" y="40" width="40" height="40" fill="#9B3D9B" transform="rotate(45 60 60)" />
          
          {/* Skull icons in gold diamonds */}
          <g transform="translate(60, 20) scale(0.15)">
            <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
          </g>
          <g transform="translate(20, 60) scale(0.15)">
            <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
    </svg>
  );
}
```

Usage in your component:
```tsx
<div className="relative">
  <DiamondPattern />
  {/* Your content here */}
</div>
```

### Option B: Pure HTML/CSS (Vanilla JavaScript)

Add this SVG directly in your HTML:

```html
<div class="diamond-background">
  <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="diamond-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="40" height="40" fill="#9B3D9B" transform="rotate(45 20 20)" />
        <rect x="40" y="0" width="40" height="40" fill="#8B7355" transform="rotate(45 60 20)" />
        <rect x="0" y="40" width="40" height="40" fill="#8B7355" transform="rotate(45 20 60)" />
        <rect x="40" y="40" width="40" height="40" fill="#9B3D9B" transform="rotate(45 60 60)" />
        <g transform="translate(60, 20) scale(0.15)">
          <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
        </g>
        <g transform="translate(20, 60) scale(0.15)">
          <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
  </svg>
</div>
```

CSS:
```css
.diamond-background {
  position: relative;
  overflow: hidden;
}

.diamond-background svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  pointer-events: none;
}
```

---

## 3. Background Color Scheme

The dark mode background color from JoJo Cafe:

```css
:root {
  --background-dark: #1e1032; /* Very dark purple */
  --background-dark-hsl: 270 68% 15%;
}

/* Usage */
body {
  background-color: hsl(270, 68%, 15%);
  /* or */
  background-color: #1e1032;
}
```

---

## 4. Complete Example (React/Next.js)

```tsx
import DiamondPattern from './components/DiamondPattern';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1e1032] relative">
      {/* Diamond Pattern Background */}
      <DiamondPattern />
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-[#ffd700]">
          Your Title Here
        </h1>
        <p className="font-sans text-xl text-white">
          Your body text here
        </p>
      </div>
    </div>
  );
}
```

---

## 5. Complete Example (Vanilla HTML/CSS)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #1e1032;
      color: #f0e6ff;
      min-height: 100vh;
    }
    
    h1, h2, h3 {
      font-family: 'Cinzel Decorative', serif;
      color: #ffd700;
    }
    
    .diamond-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.2;
      pointer-events: none;
      z-index: 0;
    }
    
    .content {
      position: relative;
      z-index: 10;
      padding: 2rem;
    }
  </style>
</head>
<body>
  <!-- Diamond Pattern Background -->
  <div class="diamond-background">
    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diamond-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="40" height="40" fill="#9B3D9B" transform="rotate(45 20 20)" />
          <rect x="40" y="0" width="40" height="40" fill="#8B7355" transform="rotate(45 60 20)" />
          <rect x="0" y="40" width="40" height="40" fill="#8B7355" transform="rotate(45 20 60)" />
          <rect x="40" y="40" width="40" height="40" fill="#9B3D9B" transform="rotate(45 60 60)" />
          <g transform="translate(60, 20) scale(0.15)">
            <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
          </g>
          <g transform="translate(20, 60) scale(0.15)">
            <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
    </svg>
  </div>
  
  <!-- Your Content -->
  <div class="content">
    <h1>Your Title</h1>
    <p>Your content here...</p>
  </div>
</body>
</html>
```

---

## Quick Reference

### Fonts:
- **Display Font (Headings)**: `Cinzel Decorative` - Use `font-display` class or `font-family: "Cinzel Decorative", serif`
- **Body Font**: `Roboto` - Use `font-sans` class or `font-family: "Roboto", sans-serif`

### Colors:
- **Gold (Headings)**: `#ffd700` or `rgb(255, 215, 0)`
- **Dark Background**: `#1e1032` or `hsl(270, 68%, 15%)`
- **Magenta Accent**: `#f02dff` or `rgb(240, 45, 255)`
- **Text Color**: `#f0e6ff` or `hsl(270, 50%, 93%)`

### Background Pattern:
- Use the `DiamondPattern` component or SVG
- Adjust opacity with `opacity-20` class or `opacity: 0.2` in CSS

