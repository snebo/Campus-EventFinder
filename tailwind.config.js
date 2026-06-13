/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        surface: '#F7F7F8', // page background (light off-white/gray)
        'surface-elevated': '#FFFFFF', // input/card backgrounds
        'border-default': '#E2E2E5', // input borders, divider lines, icon badge border, chip borders
        'border-error': '#DC2626', // red-600, for invalid fields
        'text-primary': '#111111', // headings
        'text-secondary': '#6B7280', // subtitle, helper text, labels
        'text-placeholder': '#9CA3AF', // input placeholder text
        'text-error': '#DC2626', // error helper/tooltip text
        'text-success': '#16A34A', // green-600, satisfied password rule
        'brand-dark': '#111111', // primary button background
        primary: '#111111', // brand/focus-ring color

        // Tooltip variants — used by TooltipComponent (auth screens)
        'tooltip-info-bg': '#111111',
        'tooltip-info-text': '#FFFFFF',
        'tooltip-error-bg': '#FEF2F2',
        'tooltip-error-border': '#DC2626',
        'tooltip-error-text': '#991B1B',

        // Chip / badge / card surfaces (main-app screens — estimates, confirm against Figma)
        'chip-bg': '#FFFFFF', // unselected chip background
        'chip-bg-selected': '#111111', // selected chip / dismissible filter (same as primary)
        'badge-bg-neutral': '#FFFFFF', // category/date badge background (overlaid on images)
        'image-placeholder-bg': '#E5E7EB', // gray box behind ImagePlaceholderComponent's icon
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        logo: ['18px', { fontWeight: '700' }],
        'heading-1': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        subtitle: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        label: ['12px', { letterSpacing: '0.05em', fontWeight: '500' }], // uppercase labels
        input: ['15px', { lineHeight: '22px', fontWeight: '400' }],
        helper: ['12px', { lineHeight: '16px', fontWeight: '400' }],
        button: ['16px', { lineHeight: '24px', fontWeight: '600' }],
        tooltip: ['13px', { lineHeight: '18px', fontWeight: '400' }],
      },
      borderRadius: {
        input: '10px',
        button: '10px',
        tooltip: '8px',
        badge: '12px', // AuthIconBadgeComponent corner radius
        card: '12px', // event card corners (featured, search-result, schedule cards)
        chip: '999px', // fully-rounded pill chips
        thumb: '8px', // small square thumbnails (EventCardCompactComponent)
      },
      spacing: {
        'field-gap': '20px', // vertical gap between form fields
        'section-gap': '32px', // gap between major sections (header/intro, form, footer)
        'icon-badge': '64px', // AuthIconBadgeComponent width/height
        'card-gap': '16px', // vertical gap between stacked event cards
      },
      boxShadow: {
        'focus-ring': '0 0 0 3px rgba(17, 17, 17, 0.15)', // glow using primary color at low opacity
      },
      maxWidth: {
        'auth-container': '440px', // keeps desktop layout close to the mobile design — used on all auth screens
      },
    },
  },
};
