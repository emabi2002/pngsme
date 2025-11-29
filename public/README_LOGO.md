# Logo Setup Instructions

## Current Logo

✅ **A bird of paradise SVG logo is already in place** at `logo.svg`

This is a custom-designed logo inspired by PNG's national bird, featuring:
- Red crest (top feathers)
- Yellow/orange body (center)
- Green and red wing petals (sides)
- Blue petals (bottom)

## Replacing with Your Official Logo (Optional)

To use the exact PNG SME Market logo you provided:

### Step 1: Save Your Logo Image

1. **Save your official logo image** as `logo.png` or `logo.svg` in this directory
2. The official logo features:
   - Colorful bird of paradise design
   - Red, yellow, green, and blue petals/feathers
   - "PNG SME MARKET" text

### Step 2: File Location

Place your logo file here:
```
png-sme-marketplace/
└── public/
    └── logo.svg  ← Replace this file (or use logo.png)
```

### Step 3: Verify

Once you save `logo.png` in the `public/` folder, the logo will automatically appear in:
- ✅ Header navigation (top of every page)
- ✅ Footer (bottom of every page)
- ✅ All responsive sizes

### Recommended Logo Specifications

- **Format**: PNG (with transparency preferred)
- **Minimum Size**: 200px × 200px
- **Recommended Size**: 400px × 400px or higher
- **Aspect Ratio**: The bird of paradise logo as shown
- **File Size**: Keep under 200KB for fast loading

### Current Setup

The components are already configured to use `/logo.png`:
- `src/components/header.tsx` - Main navigation logo
- `src/components/footer.tsx` - Footer branding logo

### Alternative: Using Different Sizes

If you want to optimize for different screen sizes:

1. Save multiple versions:
   - `logo.png` - Full size
   - `logo-sm.png` - Small size (for mobile)
   - `logo.svg` - Vector format (best for scaling)

2. Update components to use responsive images

### Troubleshooting

**Logo not showing?**
- Make sure the file is named exactly `logo.png` (case-sensitive)
- Make sure it's in the `public/` folder (not in `src/` or elsewhere)
- Clear your browser cache and refresh
- Restart the dev server: `bun run dev`

**Logo looks blurry?**
- Use a higher resolution image (at least 400px × 400px)
- Consider using SVG format for perfect scaling
- Save as PNG with high quality settings

---

**Once you add the logo, your PNG SME Marketplace will have the beautiful bird of paradise branding throughout the entire site!** 🇵🇬
