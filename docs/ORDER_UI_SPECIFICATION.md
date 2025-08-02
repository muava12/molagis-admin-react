# Order Management UI Specification

## Overview
This document outlines the technical specification for building a modern order management interface using Vite, React, Tailwind CSS, and Untitled UI components. The interface will replicate the design shown in the provided mockup with a dark theme and green accent colors.

## Technology Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Component Library**: Untitled UI React Components
- **State Management**: React Hooks (useState, useReducer)
- **Form Handling**: Custom validation with real-time feedback
- **Icons**: Untitled UI Featured Icons

## Project Structure
```
molagis-order-ui/
├── src/
│   ├── components/
│   │   ├── ui/                    # Untitled UI base components
│   │   ├── calendar/              # Calendar widget components
│   │   ├── forms/                 # Form input components
│   │   ├── layout/                # Layout components
│   │   └── order/                 # Order-specific components
│   ├── hooks/                     # Custom React hooks
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # Utility functions
│   ├── styles/                    # Global styles and Tailwind config
│   └── App.tsx                    # Main application component
├── public/                        # Static assets
└── package.json                   # Dependencies and scripts
```

## Component Architecture

### 1. Main Layout (`OrderFormLayout`)
- **Purpose**: Container for the entire order form interface
- **Features**: 
  - Two-column layout (calendar + form)
  - Responsive design for mobile/tablet
  - Dark theme with green accent colors
  - Progress indicator at the top

### 2. Calendar Widget (`CalendarWidget`)
- **Purpose**: Date selection interface
- **Features**:
  - Month navigation (August 2025 shown in mockup)
  - Multiple date selection
  - Quick filter buttons (Hari Ini, Bulan Depan, Clear, 7 Hari, 14 Hari)
  - Selected dates counter
  - Disabled Sundays and holidays
- **Components**:
  - `CalendarHeader` - Month/year display with navigation
  - `CalendarGrid` - Date grid with selection logic
  - `QuickFilters` - Filter button group
  - `SelectedDatesCounter` - Shows "X Hari dipilih"

### 3. Customer Section (`CustomerSection`)
- **Purpose**: Customer selection and information
- **Features**:
  - Autocomplete search input
  - Real-time customer filtering
  - Customer address display
  - Default shipping cost integration
- **Components**:
  - `CustomerSearchInput` - Autocomplete input field
  - `CustomerInfo` - Display selected customer details

### 4. Package Selection (`PackageSection`)
- **Purpose**: Food package selection with quantities
- **Features**:
  - Dropdown for package selection
  - Quantity controls with +/- buttons
  - Multiple package support
  - Price calculation
- **Components**:
  - `PackageDropdown` - Package selection dropdown
  - `QuantityControl` - Increment/decrement buttons
  - `PackageList` - List of selected packages

### 5. Additional Items (`AdditionalItemsSection`)
- **Purpose**: Expandable section for extra items
- **Features**:
  - Collapsible interface
  - Item name and price inputs
  - Quick template buttons
  - Profit calculation
- **Components**:
  - `CollapsibleSection` - Expandable container
  - `ItemInputs` - Name and price inputs
  - `TemplateButtons` - Quick selection buttons

### 6. Shipping Section (`ShippingSection`)
- **Purpose**: Courier and shipping cost management
- **Features**:
  - Courier selection dropdown
  - Shipping cost input with validation
  - Quick preset buttons
- **Components**:
  - `CourierDropdown` - Courier selection
  - `ShippingCostInput` - Cost input with presets

### 7. Payment Method (`PaymentMethodSection`)
- **Purpose**: Payment method selection
- **Features**:
  - Three payment options (COD, Transfer, Belum Bayar)
  - Radio button or dropdown selection
  - Payment status indicators
- **Components**:
  - `PaymentMethodSelector` - Payment option selection

### 8. Notes Section (`NotesSection`)
- **Purpose**: Tabbed interface for different note types
- **Features**:
  - Three tabs: Order Notes, Kitchen Notes, Courier Notes
  - Icon-based tab headers
  - Text area inputs
  - Character count
- **Components**:
  - `TabbedInterface` - Tab container
  - `NoteTab` - Individual tab with icon and text area

### 9. Action Button (`SubmitButton`)
- **Purpose**: Form submission
- **Features**:
  - Green "Simpan Pesanan" button
  - Loading states
  - Form validation feedback
  - Success/error handling

## Data Models

### Order Form State
```typescript
interface OrderFormState {
  // Customer information
  customer: {
    id: number | null;
    name: string;
    address: string;
    defaultShippingCost: number;
  };
  
  // Selected dates
  selectedDates: Set<string>;
  
  // Package selection
  packages: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  
  // Additional items
  additionalItems: {
    name: string;
    price: number;
    modalPrice: number;
  };
  
  // Shipping information
  shipping: {
    courierId: number | null;
    courierName: string;
    cost: number;
  };
  
  // Payment method
  paymentMethod: 'COD' | 'Transfer' | 'Belum Bayar';
  
  // Notes
  notes: {
    orderNotes: string;
    kitchenNotes: string;
    courierNotes: string;
  };
}
```

## Styling Guidelines

### Color Scheme
- **Background**: Dark navy/charcoal (`bg-slate-900`)
- **Cards/Sections**: Slightly lighter dark (`bg-slate-800`)
- **Primary Accent**: Green (`bg-green-500`, `text-green-400`)
- **Text Primary**: Light gray (`text-gray-100`)
- **Text Secondary**: Medium gray (`text-gray-400`)
- **Borders**: Dark gray (`border-gray-700`)

### Component Styling
- **Inputs**: Dark background with light borders, focus states with green accent
- **Buttons**: Green primary, dark secondary with hover states
- **Dropdowns**: Dark theme with proper contrast
- **Calendar**: Selected dates with green background
- **Cards**: Rounded corners with subtle shadows

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Single column layout, stacked components
- **Tablet**: `768px - 1024px` - Adjusted spacing, collapsible sidebar
- **Desktop**: `> 1024px` - Two-column layout as shown in mockup

### Mobile Adaptations
- Calendar becomes full-width with touch-friendly controls
- Form sections stack vertically
- Larger touch targets for buttons and inputs
- Collapsible sections for better space utilization

## Form Validation

### Validation Rules
- **Customer**: Required, must be selected from database
- **Dates**: Minimum 1 date selected
- **Packages**: Minimum 1 package with quantity > 0
- **Shipping Cost**: Must be positive number
- **Payment Method**: Required selection

### Validation Feedback
- Real-time validation with visual indicators
- Error messages below invalid fields
- Form submission disabled until all validations pass
- Success states for completed sections

## Performance Considerations

### Optimization Strategies
- Lazy loading for non-critical components
- Debounced search inputs (300ms)
- Memoized calculations for totals
- Virtual scrolling for large lists
- Optimized re-renders with React.memo

### Caching Strategy
- Customer data cached in sessionStorage
- Package data cached with TTL
- Form state persistence in localStorage
- API response caching where appropriate

## Accessibility Features

### WCAG Compliance
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Focus management and visual indicators
- Screen reader compatibility
- Color contrast compliance (4.5:1 minimum)

### Keyboard Navigation
- Tab order optimization
- Arrow key navigation in calendar
- Enter/Escape handling in modals
- Shortcut keys for common actions

## Integration Points

### API Endpoints (Future)
```typescript
// Customer management
GET /api/customers - Fetch customer list
GET /api/customers/search?q={query} - Search customers

// Package management  
GET /api/packages - Fetch available packages

// Courier management
GET /api/couriers - Fetch active couriers

// Order submission
POST /api/orders - Submit new order
```

### External Services
- Holiday API for calendar date validation
- Address validation service (optional)
- Payment gateway integration (future)

## Testing Strategy

### Unit Tests
- Component rendering and props
- Form validation logic
- Calculation functions
- State management hooks

### Integration Tests
- Form submission flow
- Component interactions
- API integration mocks
- Error handling scenarios

### E2E Tests
- Complete order creation flow
- Mobile responsiveness
- Cross-browser compatibility
- Performance benchmarks

## Development Phases

### Phase 1: Foundation (Days 1-2)
- Project setup with Vite + React + TypeScript
- Untitled UI integration and configuration
- Basic layout and routing structure
- Dark theme implementation

### Phase 2: Core Components (Days 3-5)
- Calendar widget with date selection
- Customer search and selection
- Package selection with quantities
- Basic form state management

### Phase 3: Advanced Features (Days 6-8)
- Additional items section
- Shipping and courier selection
- Payment method selection
- Notes section with tabs

### Phase 4: Polish & Testing (Days 9-10)
- Form validation and error handling
- Responsive design refinements
- Performance optimizations
- Testing and bug fixes

## Future Enhancements

### Planned Features
1. **Order Templates**: Save and reuse common orders
2. **Bulk Operations**: Multiple customer orders
3. **Real-time Updates**: WebSocket integration
4. **Offline Support**: PWA capabilities
5. **Advanced Analytics**: Order tracking and reporting

### Technical Improvements
1. **State Management**: Redux Toolkit for complex state
2. **API Layer**: React Query for data fetching
3. **Testing**: Comprehensive test coverage
4. **Documentation**: Storybook for component library
5. **CI/CD**: Automated testing and deployment

This specification provides a comprehensive roadmap for building a modern, accessible, and performant order management interface that matches the provided design mockup while incorporating best practices for React development.