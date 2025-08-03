# Simple Navigation Components

Komponen navigation yang simple, performant, dan collapsible dengan native support. Dibuat untuk mengatasi masalah performance pada komponen UntitledUI yang kompleks.

## 🚀 Features

- ✅ **Simple & Performant** - Minimal state management dan DOM manipulation
- ✅ **Native Collapsible** - Menggunakan CSS transitions tanpa JavaScript yang kompleks
- ✅ **Responsive Design** - Mobile-first dengan breakpoint yang optimal
- ✅ **UntitledUI Integration** - Menggunakan komponen individual UntitledUI (icons, avatar, badges)
- ✅ **TypeScript Support** - Fully typed dengan interface yang jelas
- ✅ **Accessibility** - ARIA labels dan keyboard navigation
- ✅ **Customizable** - Props yang fleksibel untuk berbagai use case

## 📦 Components

### SimpleLayout
Komponen utama yang menggabungkan header dan sidebar dengan state management.

```tsx
import { SimpleLayout, useSimpleLayout } from "@/components/application/app-navigation";

const MyApp = () => {
  const { activeItemId, handleNavItemClick } = useSimpleLayout("dashboard");

  return (
    <SimpleLayout
      activeItemId={activeItemId}
      onNavItemClick={handleNavItemClick}
    >
      <div>Your main content here</div>
    </SimpleLayout>
  );
};
```

### SimpleHeader
Header yang responsive dengan search, notifications, dan avatar.

```tsx
import { SimpleHeader } from "@/components/application/app-navigation";

<SimpleHeader
  sidebarCollapsed={false}
  onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
  showSearch={true}
  showNotifications={true}
  showSettings={true}
  showAvatar={true}
/>
```

### SimpleSidebar
Sidebar yang collapsible dengan navigation items dan footer.

```tsx
import { SimpleSidebar, type NavItem } from "@/components/application/app-navigation";

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home01,
    active: true,
  },
  // ... more items
];

<SimpleSidebar
  collapsed={false}
  items={navItems}
  activeItemId="dashboard"
  onItemClick={(item) => console.log(item)}
/>
```

## 🎯 Props

### SimpleLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navItems` | `NavItem[]` | `defaultNavItems` | Navigation items |
| `footerItems` | `NavItem[]` | `defaultFooterItems` | Footer navigation items |
| `activeItemId` | `string` | - | Current active item ID |
| `onNavItemClick` | `(item: NavItem) => void` | - | Callback when nav item is clicked |
| `showHeaderSearch` | `boolean` | `true` | Show header search |
| `showHeaderNotifications` | `boolean` | `true` | Show header notifications |
| `showHeaderSettings` | `boolean` | `true` | Show header settings |
| `showHeaderAvatar` | `boolean` | `true` | Show header avatar |
| `showSidebarAccount` | `boolean` | `true` | Show sidebar account section |
| `headerContent` | `ReactNode` | - | Additional header content |
| `children` | `ReactNode` | - | Main content |
| `contentClassName` | `string` | - | Additional CSS classes for main content |

### NavItem Interface

```tsx
interface NavItem {
  id: string;           // Unique identifier
  label: string;        // Display label
  href?: string;        // Navigation URL
  icon?: ComponentType<{ className?: string }>; // Icon component
  badge?: ReactNode;    // Badge content
  children?: NavItem[]; // Sub-items
  active?: boolean;     // Whether item is currently active
}
```

## 🎨 Styling

Komponen menggunakan design tokens dari UntitledUI:

- `bg-primary` - Background utama
- `bg-secondary` - Background sekunder
- `border-secondary` - Border color
- `text-fg-primary` - Text primary
- `text-fg-secondary` - Text secondary
- `text-fg-tertiary` - Text tertiary
- `hover:bg-primary_hover` - Hover states

## 📱 Responsive Behavior

- **Desktop (lg+)**: Sidebar fixed, header sticky
- **Mobile (<lg)**: Sidebar overlay dengan backdrop blur
- **Auto-collapse**: Sidebar otomatis collapse pada mobile
- **Touch-friendly**: Button sizes optimal untuk touch

## 🔧 Customization

### Custom Navigation Items

```tsx
const customNavItems: NavItem[] = [
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: BarChart03,
    badge: "New",
    children: [
      {
        id: "overview",
        label: "Overview",
        href: "/analytics/overview",
      },
      {
        id: "reports",
        label: "Reports",
        href: "/analytics/reports",
        badge: "5",
      },
    ],
  },
];
```

### Custom Badges

```tsx
import { BadgeWithDot } from "@/components/base/badges/badges";

const itemWithCustomBadge: NavItem = {
  id: "tasks",
  label: "Tasks",
  href: "/tasks",
  icon: File01,
  badge: <BadgeWithDot color="warning" type="modern" size="sm">3</BadgeWithDot>,
};
```

## 🚀 Performance Optimizations

1. **Minimal State** - Hanya menggunakan state yang diperlukan
2. **CSS Transitions** - Menggunakan CSS untuk animasi, bukan JavaScript
3. **Event Delegation** - Efficient event handling
4. **Lazy Rendering** - Sub-items hanya render saat diperlukan
5. **Memoization** - Component memoization untuk prevent re-renders

## 🔄 Migration dari UntitledUI

Jika Anda menggunakan komponen UntitledUI sebelumnya:

```tsx
// Before (UntitledUI)
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";

// After (Simple Navigation)
import { SimpleLayout } from "@/components/application/app-navigation";
```

## 🧪 Testing

Untuk testing komponen, gunakan demo page:

```tsx
import DemoNavigationPage from "@/pages/demo-navigation";

// Atau import komponen individual
import { ExampleLayout } from "@/components/application/app-navigation/simple-layout";
```

## 🐛 Troubleshooting

### Sidebar tidak collapse
- Pastikan `onToggleSidebar` prop sudah di-pass ke `SimpleHeader`
- Check responsive breakpoint (lg = 1024px)

### Icons tidak muncul
- Pastikan import icon dari `@untitledui/icons`
- Check nama icon yang benar (misal: `File01` bukan `FileText01`)

### Styling tidak sesuai
- Pastikan design tokens UntitledUI sudah di-setup
- Check Tailwind CSS configuration

## 📝 Examples

Lihat file berikut untuk contoh lengkap:
- `src/pages/demo-navigation.tsx` - Demo page dengan berbagai use case
- `src/components/application/app-navigation/simple-layout.tsx` - Example component

## 🤝 Contributing

Untuk menambah fitur atau memperbaiki bug:

1. Buat branch baru dari `main`
2. Implementasi perubahan
3. Test dengan demo page
4. Update dokumentasi jika diperlukan
5. Submit PR dengan deskripsi yang jelas

---

**Note**: Komponen ini dibuat untuk menggantikan komponen UntitledUI yang kompleks dengan solusi yang lebih simple dan performant.