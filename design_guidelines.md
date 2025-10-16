# Rwanda Traffic Academy - Design Guidelines

## Design Approach
**Reference-Based with Educational Focus**: Drawing inspiration from modern EdTech platforms like Duolingo and Khan Academy, combined with clean mobile-first principles. The design emphasizes learning progression, gamification elements, and clear information hierarchy while maintaining professional credibility for a government exam preparation platform.

## Core Design Elements

### A. Color Palette

**Primary Green (Brand)**
- Primary: 142 70% 45% (vibrant educational green)
- Primary Dark: 142 70% 35% (hover states, dark mode)
- Primary Light: 142 60% 92% (backgrounds, subtle highlights)

**Supporting Colors**
- Success: 142 70% 45% (uses primary for consistency)
- Warning: 38 92% 50% (quiz time warnings)
- Error: 0 84% 60% (incorrect answers)
- Correct: 142 76% 40% (correct answers, brighter green)

**Neutral Palette**
- Background Light: 0 0% 98%
- Background Dark: 142 20% 8%
- Surface Light: 0 0% 100%
- Surface Dark: 142 15% 12%
- Text Primary Light: 142 25% 15%
- Text Primary Dark: 142 5% 95%
- Text Secondary Light: 142 10% 40%
- Text Secondary Dark: 142 5% 70%

### B. Typography

**Font Families**
- Primary: 'Inter' (body, UI elements) - clean, highly legible for educational content
- Headings: 'Inter' with increased font-weight (600-700) for hierarchy
- Kinyarwanda Text: Include 'Noto Sans' as fallback for proper character support

**Type Scale**
- Hero: text-5xl (48px) md:text-6xl (60px), font-bold
- H1: text-4xl (36px) md:text-5xl (48px), font-semibold
- H2: text-3xl (30px) md:text-4xl (36px), font-semibold
- H3: text-2xl (24px), font-semibold
- Body Large: text-lg (18px), font-normal
- Body: text-base (16px), font-normal
- Small: text-sm (14px), font-medium
- Caption: text-xs (12px), font-medium

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Micro spacing: p-2, gap-2 (8px) for tight groupings
- Standard spacing: p-4, gap-4 (16px) for card internals
- Section spacing: py-12 md:py-20 (mobile to desktop)
- Component margins: mb-6, mt-8 for vertical flow

**Container Strategy**
- Page wrapper: max-w-7xl mx-auto px-4 md:px-6
- Content sections: max-w-6xl for lessons/quizzes
- Reading content: max-w-3xl for lesson text
- Cards/Modules: Grid with gap-6, responsive columns

### D. Component Library

**Navigation**
- Fixed top navbar: backdrop-blur with semi-transparent green-tinted background
- Mobile: Hamburger menu expanding to full-screen overlay
- Desktop: Horizontal nav with clear section labels (Kinyarwanda + icons)
- Active state: Bottom border in primary green (3px solid)

**Module/Lesson Cards**
- Rounded corners: rounded-xl (12px)
- Elevation: shadow-md with hover:shadow-lg transition
- Structure: Image thumbnail (16:9) + title + progress bar + CTA
- Progress indicator: Linear green bar showing completion percentage
- Lock icon overlay for gated content (semi-transparent dark overlay)

**Quiz Interface**
- Question card: Large rounded container with subtle shadow
- Image display: Full-width with aspect-ratio-video, object-cover, supports zoom modal
- Radio buttons: Large touch targets (44x44px min), custom green checkmark styling
- Choice layout: Stack vertically with p-4, border-2, rounded-lg
- Selected state: border-primary bg-primary/5
- Correct/Incorrect feedback: Border color change + icon (✓/✗) + explanation slide-down

**Quiz Timer (Mock Mode)**
- Sticky top-right corner
- Pill shape with icon + countdown
- Color progression: green → yellow (5 min) → red (1 min)
- Pulsing animation when < 1 minute

**Results/Marks Page**
- Hero score display: Circular progress ring (large, 200px) showing percentage
- Pass/Fail badge: Bold, celebratory for pass (confetti animation), encouraging for fail
- Question breakdown: Expandable accordion with traffic light colors (green/red indicators)
- Review mode: Side-by-side question + explanation layout

**Subscription Cards (MTN Mobile Money)**
- Two-column grid on desktop, stack on mobile
- Popular plan highlighted: ring-2 ring-primary, "Most Popular" badge
- Price display: Large RWF amount + duration subtitle
- Feature list: Checkmark bullets with green icons
- CTA button: Full-width, primary green, prominent

**Account Dashboard (Konte)**
- Stats cards: 2x2 grid showing total attempts, pass rate, study time, current streak
- Weekly progress chart: Bar chart with green gradient fills
- Attempt history: Table with status badges (Pass/Fail), score, date, review CTA

**Progress Indicators**
- Linear bars: Green gradient from primary to primary-light
- Circular rings: Green stroke with gray background track
- Lesson completion: Checkmark icons in green circles

### E. Images & Visual Assets

**Hero Image**: Yes - Use a hero image showing a modern Rwandan road scene or confident learner driver, optimistic and aspirational. Full-width, 60vh on mobile, 70vh on desktop, with dark gradient overlay for text legibility.

**Module Thumbnails**: Traffic scenario illustrations or photography representing each module theme (traffic signs, road safety, vehicle rules, etc.). 16:9 aspect ratio, 400x225px minimum.

**Quiz Images**: Traffic signs, road scenarios, vehicle diagrams. Display above question text in a rounded-lg container, max-height 320px with object-contain. Include zoom icon overlay (magnifying glass) in top-right corner.

**Icons**: Heroicons for UI elements (navigation, actions), custom traffic icons for specific road elements.

**Illustrations**: Spot illustrations for empty states (no attempts yet, no lessons completed) in a friendly, simple line-art style with green accent color.

### F. Responsive Behavior

**Breakpoints**
- Mobile: < 768px (base styles)
- Tablet: 768px - 1024px (md:)
- Desktop: > 1024px (lg:)

**Mobile-First Patterns**
- Single column layouts, expand to 2-3 columns on tablet/desktop
- Bottom navigation bar for primary actions on mobile
- Collapsible sidebar becomes top nav on mobile
- Touch-optimized: 44px minimum button height, generous padding
- Swipe gestures for quiz navigation (next/previous question)

## Animation Principles

**Minimal & Purposeful**
- Page transitions: Subtle fade-in (200ms)
- Quiz feedback: Scale + color transition (300ms ease-out) on answer selection
- Progress updates: Smooth bar/ring animations (500ms)
- Modal overlays: Slide-up from bottom on mobile (300ms), fade-center on desktop
- NO decorative animations, NO parallax effects

## Dark Mode Implementation

- Maintain green primary color across both modes
- Dark backgrounds: Use dark green-tinted blacks (142 20% 8%)
- Reduce image opacity to 0.9 in dark mode for better integration
- Quiz answer cards: Elevated surfaces (surface-dark) with subtle borders
- Consistent contrast ratios (WCAG AA minimum)