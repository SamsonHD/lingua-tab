# Design System - UI Components

This document outlines the UI components available in the design system.

## Button Component

The `Button` component provides a consistent, accessible, and animated button implementation with multiple variants and sizes.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "destructive" \| "ghost" \| "outline"` | `"primary"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `isLoading` | `boolean` | `false` | Shows loading spinner |
| `loadingText` | `string` | - | Text to show during loading |
| `icon` | `ReactNode` | - | Icon to display |
| `children` | `ReactNode` | - | Button content |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Additional CSS classes |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Button type |

### Variants

#### Primary Button
- **Use case**: Primary actions, confirmations
- **Colors**: Blue theme with transparency
- **Background**: `bg-blue-500/20`
- **Border**: `border-blue-400/40`
- **Text**: `text-blue-300`
- **Hover**: `hover:bg-blue-500/30`
- **Active**: `active:bg-blue-500/40`
- **Focus**: `focus:ring-blue-400/30`

#### Secondary Button
- **Use case**: Secondary actions, navigation
- **Colors**: White theme with transparency
- **Background**: `bg-white/10`
- **Border**: `border-white/20`
- **Text**: `text-white`
- **Hover**: `hover:bg-white/20`
- **Active**: `active:bg-white/30`
- **Focus**: `focus:ring-white/30`

#### Destructive Button
- **Use case**: Delete, remove, destructive actions
- **Colors**: Red theme with transparency
- **Background**: `bg-red-500/20`
- **Border**: `border-red-400/40`
- **Text**: `text-red-300`
- **Hover**: `hover:bg-red-500/30`
- **Active**: `active:bg-red-500/40`
- **Focus**: `focus:ring-red-400/30`

#### Ghost Button
- **Use case**: Subtle actions, overlays
- **Colors**: Transparent with white text
- **Background**: `bg-transparent`
- **Border**: `border-transparent`
- **Text**: `text-white`
- **Hover**: `hover:bg-white/10`
- **Active**: `active:bg-white/20`
- **Focus**: `focus:ring-white/30`

#### Outline Button
- **Use case**: Alternative actions, secondary CTAs
- **Colors**: Transparent with border
- **Background**: `bg-transparent`
- **Border**: `border-white/20`
- **Text**: `text-white`
- **Hover**: `hover:bg-white/10`
- **Active**: `active:bg-white/20`
- **Focus**: `focus:ring-white/30`

### Sizes

#### Small (`sm`)
- **Padding**: `px-3 py-1.5`
- **Text**: `text-sm`
- **Use case**: Compact spaces, inline actions

#### Medium (`md`)
- **Padding**: `px-4 py-2`
- **Text**: `text-sm sm:text-base`
- **Use case**: Standard buttons, most common size

#### Large (`lg`)
- **Padding**: `px-5 py-2.5`
- **Text**: `text-base`
- **Use case**: Prominent actions, CTAs

### States

#### Default State
- Normal appearance with hover and active states
- Smooth transitions with `transition-all duration-200`

#### Hover State
- Scale animation: `scale: 1.02`
- Background color changes based on variant
- Smooth transition with `duration: 0.1`

#### Active State
- Scale animation: `scale: 0.98`
- Darker background color
- Provides tactile feedback

#### Focus State
- Focus ring with variant-specific colors
- `focus:ring-2` with appropriate opacity
- Accessibility compliant

#### Disabled State
- Reduced opacity: `opacity-50`
- Disabled cursor: `cursor-not-allowed`
- No hover effects: `disabled:hover:bg-transparent`
- No animations when disabled

#### Loading State
- Animated spinner icon
- Optional loading text
- Automatically disabled during loading

### Usage Examples

```tsx
import { Button, PrimaryButton, DestructiveButton, SecondaryButton } from "./ui";

// Basic usage
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

// With icon
<PrimaryButton 
  icon={<DownloadIcon />}
  onClick={handleExport}
>
  Export Data
</PrimaryButton>

// Loading state
<DestructiveButton 
  isLoading={isDeleting}
  loadingText="Deleting..."
  onClick={handleDelete}
>
  Delete Item
</DestructiveButton>

// Disabled state
<SecondaryButton 
  disabled={!isValid}
  onClick={handleSubmit}
>
  Submit
</SecondaryButton>
```

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Readers**: Proper ARIA attributes
- **Disabled State**: Clear visual and functional indication
- **Loading State**: Accessible loading indicators

### Animation Details

- **Hover**: Subtle scale up (1.02x) with smooth transition
- **Tap**: Scale down (0.98x) for tactile feedback
- **Duration**: 0.1s for responsive feel
- **Disabled**: No animations when disabled
- **Loading**: Smooth spinner rotation

### Design Tokens

The button component uses consistent design tokens:

- **Border Radius**: `rounded-xl` (0.75rem)
- **Font Weight**: `font-medium` (500)
- **Transitions**: `transition-all duration-200`
- **Focus Ring**: `focus:ring-2` with variant colors
- **Opacity**: `opacity-50` for disabled state

### Best Practices

1. **Use appropriate variants** for different action types
2. **Provide loading states** for async operations
3. **Include icons** for better visual hierarchy
4. **Use consistent sizing** across your application
5. **Test keyboard navigation** and screen reader compatibility
6. **Provide clear loading text** for better UX
7. **Disable buttons** during loading to prevent double-clicks

## Dropdown Component

The `Dropdown` component provides a consistent, accessible, and animated dropdown implementation with multiple variants and sizes. It uses the same dropdown arrow (ChevronDown) as the LanguageSelector component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `DropdownOption[]` | - | Array of dropdown options |
| `value` | `string` | - | Currently selected value |
| `placeholder` | `string` | `"Select an option..."` | Placeholder text when no option selected |
| `onSelect` | `(value: string) => void` | - | Callback when option is selected |
| `disabled` | `boolean` | `false` | Disabled state |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `"secondary"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Dropdown size |
| `fullWidth` | `boolean` | `false` | Whether dropdown takes full width |
| `className` | `string` | - | Additional CSS classes |

### DropdownOption Interface

```typescript
interface DropdownOption {
  value: string;
  label: string;
  icon?: any;
  disabled?: boolean;
}
```

### Variants

#### Primary Dropdown
- **Use case**: Primary form selections, important choices
- **Colors**: Blue theme with transparency
- **Background**: `bg-blue-500/20`
- **Border**: `border-blue-400/40`
- **Text**: `text-blue-300`
- **Hover**: `hover:bg-blue-500/30`

#### Secondary Dropdown (Default)
- **Use case**: Standard form selections, general use
- **Colors**: White theme with transparency
- **Background**: `bg-white/10`
- **Border**: `border-white/20`
- **Text**: `text-white`
- **Hover**: `hover:bg-white/20`

#### Ghost Dropdown
- **Use case**: Subtle selections, minimal UI
- **Colors**: Transparent with white text
- **Background**: `bg-transparent`
- **Border**: `border-transparent`
- **Text**: `text-white`
- **Hover**: `hover:bg-white/10`

#### Outline Dropdown
- **Use case**: Alternative selections, secondary forms
- **Colors**: Transparent with border
- **Background**: `bg-transparent`
- **Border**: `border-white/20`
- **Text**: `text-white`
- **Hover**: `hover:bg-white/10`

### Sizes

#### Small (`sm`)
- **Padding**: `px-3`
- **Height**: `h-10` (2.5rem)
- **Text**: `text-xs`
- **Use case**: Compact dropdowns, inline selections

#### Medium (`md`)
- **Padding**: `px-3`
- **Height**: `h-12` (3rem)
- **Text**: `text-sm`
- **Use case**: Standard dropdowns, most common size

#### Large (`lg`)
- **Padding**: `px-4`
- **Height**: `h-14` (3.5rem)
- **Text**: `text-sm sm:text-base`
- **Use case**: Prominent selections, large forms

### Features

#### Dropdown Menu
- **Background**: `bg-black/80` with `backdrop-blur-sm`
- **Border**: `border-white/10`
- **Animation**: Scale and fade in/out with `duration: 0.2`
- **Max Height**: `max-h-60` with `overflow-y-auto`
- **Shadow**: `shadow-xl` for depth

#### Options
- **Hover Effect**: `hover:bg-white/10` with slide animation (`x: 4`)
- **Selected State**: `bg-white/5` with white text
- **Disabled State**: `opacity-50` with `cursor-not-allowed`
- **Icon Support**: Optional icons displayed before label

#### Accessibility
- **Keyboard Navigation**: Escape key closes dropdown
- **Click Outside**: Closes dropdown when clicking outside
- **ARIA Attributes**: `aria-expanded`, `aria-haspopup`, `role="listbox"`, `role="option"`, `aria-selected`
- **Screen Reader**: Proper labeling and state announcements

#### Responsive Design
- **Mobile Backdrop**: Full-screen backdrop on mobile devices
- **Width**: Responsive width with `min-w-[200px]` or full width option
- **Text Truncation**: Long labels are truncated with ellipsis

### Usage Examples

```tsx
import { Dropdown, PrimaryDropdown, type DropdownOption } from "./ui";

const options: DropdownOption[] = [
  { value: "en", label: "English", icon: "🇺🇸" },
  { value: "es", label: "Spanish", icon: "🇪🇸" },
  { value: "fr", label: "French", icon: "🇫🇷", disabled: true }
];

// Basic usage
<Dropdown
  options={options}
  value={selectedValue}
  onSelect={handleSelect}
  placeholder="Choose a language..."
/>

// With variant and size
<PrimaryDropdown
  options={options}
  value={selectedValue}
  onSelect={handleSelect}
  size="lg"
  fullWidth
/>

// Disabled state
<Dropdown
  options={options}
  value={selectedValue}
  onSelect={handleSelect}
  disabled={isLoading}
/>
```

### Animation Details

- **Hover**: Scale up (1.02x) with smooth transition
- **Tap**: Scale down (0.98x) for tactile feedback  
- **Dropdown Open**: Scale and fade animation (0.95x to 1x)
- **Chevron Rotation**: 180° rotation when opened
- **Option Hover**: Slide right (4px) animation
- **Duration**: 0.1s for button, 0.2s for dropdown

### Design Tokens

The dropdown component uses consistent design tokens:

- **Border Radius**: `rounded-xl` (0.75rem)
- **Font Weight**: `font-medium` (500)
- **Transitions**: `transition-all duration-200`
- **Backdrop Blur**: `backdrop-blur-sm`
- **Z-Index**: `z-10` (backdrop), `z-20` (dropdown)

### Best Practices

1. **Provide meaningful labels** for all options
2. **Use icons** to improve visual scanning
3. **Handle disabled states** clearly
4. **Set appropriate placeholder text**
5. **Use fullWidth** for form layouts
6. **Test keyboard navigation** and accessibility
7. **Consider option order** for better UX
8. **Handle empty states** gracefully

## Search Input Component

The `SearchInput` component provides a consistent, accessible, and animated search input implementation with multiple variants and sizes. It includes built-in search icon, clear functionality, and keyboard shortcuts.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Current input value |
| `onChange` | `(value: string) => void` | - | Callback when value changes |
| `placeholder` | `string` | `"Search..."` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `"secondary"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Input size |
| `fullWidth` | `boolean` | `false` | Whether input takes full width |
| `showClearButton` | `boolean` | `true` | Show clear button when value exists |
| `icon` | `ReactNode` | `<Search />` | Custom icon to display |
| `onFocus` | `() => void` | - | Focus callback |
| `onBlur` | `() => void` | - | Blur callback |
| `onKeyDown` | `(e: KeyboardEvent) => void` | - | Key down callback |
| `className` | `string` | - | Additional CSS classes |

### Variants

#### Primary Search Input
- **Use case**: Primary search functionality, main search bars
- **Colors**: Blue theme with transparency
- **Background**: `bg-blue-500/20`
- **Border**: `border-blue-400/40`
- **Text**: `text-blue-300`
- **Placeholder**: `placeholder-blue-300/60`
- **Focus**: `focus:border-blue-400/60 focus:ring-blue-400/30`

#### Secondary Search Input (Default)
- **Use case**: Standard search inputs, general use
- **Colors**: White theme with transparency
- **Background**: `bg-white/10`
- **Border**: `border-white/20`
- **Text**: `text-white`
- **Placeholder**: `placeholder-white/50`
- **Focus**: `focus:border-white/40 focus:ring-white/10`

#### Ghost Search Input
- **Use case**: Subtle search, minimal UI
- **Colors**: Transparent with white text
- **Background**: `bg-transparent`
- **Border**: `border-transparent`
- **Text**: `text-white`
- **Placeholder**: `placeholder-white/50`
- **Focus**: `focus:border-white/20 focus:ring-white/10`

#### Outline Search Input
- **Use case**: Alternative search, secondary forms
- **Colors**: Transparent with border
- **Background**: `bg-transparent`
- **Border**: `border-white/20`
- **Text**: `text-white`
- **Placeholder**: `placeholder-white/50`
- **Focus**: `focus:border-white/40 focus:ring-white/10`

### Sizes

#### Small (`sm`)
- **Padding**: `px-3`
- **Height**: `h-10` (2.5rem)
- **Text**: `text-xs`
- **Use case**: Compact search, inline search

#### Medium (`md`)
- **Padding**: `px-3`
- **Height**: `h-12` (3rem)
- **Text**: `text-sm`
- **Use case**: Standard search inputs, most common size

#### Large (`lg`)
- **Padding**: `px-4`
- **Height**: `h-14` (3.5rem)
- **Text**: `text-sm sm:text-base`
- **Use case**: Prominent search, large forms

### Features

#### Built-in Search Icon
- **Default Icon**: Lucide React `Search` icon
- **Custom Icon**: Support for custom icons via `icon` prop
- **Positioning**: Left side with proper spacing
- **Opacity**: `opacity-70` for subtle appearance

#### Clear Button
- **Auto-show**: Appears when value exists and `showClearButton` is true
- **Animation**: Scale hover (1.1x) and tap (0.9x) effects
- **Accessibility**: Proper `aria-label` for screen readers
- **Focus Management**: Refocuses input after clearing

#### Keyboard Shortcuts
- **Escape Key**: Clears the input value
- **Focus Management**: Maintains focus after clearing
- **Custom Handlers**: Support for additional key handlers

#### Responsive Design
- **Mobile**: Smaller padding and text sizes
- **Desktop**: Larger padding and text sizes
- **Width**: Responsive width with full width option
- **Touch**: Optimized for touch interactions

### Usage Examples

```tsx
import { SearchInput, PrimarySearchInput, type SearchInputProps } from "./ui";

// Basic usage
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search words, meanings, or examples..."
/>

// With variant and size
<PrimarySearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search..."
  size="lg"
  fullWidth
/>

// With custom icon and handlers
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search..."
  icon={<CustomSearchIcon />}
  onFocus={() => console.log('Focused')}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }}
/>

// Disabled state
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  disabled={isLoading}
  placeholder="Search disabled..."
/>
```

### Animation Details

- **Hover**: Scale up (1.01x) with smooth transition
- **Focus**: Ring animation with variant-specific colors
- **Clear Button**: Scale hover (1.1x) and tap (0.9x) animations
- **Duration**: 0.1s for responsive feel
- **Disabled**: No animations when disabled

### Design Tokens

The search input component uses consistent design tokens:

- **Border Radius**: `rounded-xl` (0.75rem)
- **Transitions**: `transition-all duration-200`
- **Focus Ring**: `focus:ring-2` with variant colors
- **Icon Opacity**: `opacity-70` for subtle appearance
- **Disabled Opacity**: `opacity-50` for disabled state

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support including Escape to clear
- **Focus Management**: Proper focus indicators and management
- **Screen Readers**: Proper ARIA labels and announcements
- **Disabled State**: Clear visual and functional indication
- **Clear Button**: Accessible clear functionality with proper labeling

### Best Practices

1. **Provide meaningful placeholders** for better UX
2. **Use appropriate variants** for different contexts
3. **Handle focus states** properly for better accessibility
4. **Use fullWidth** for form layouts
5. **Test keyboard navigation** and screen reader compatibility
6. **Consider custom icons** for brand consistency
7. **Handle disabled states** clearly
8. **Use responsive sizing** for mobile optimization
