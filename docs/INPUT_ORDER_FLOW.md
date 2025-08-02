# Input Order Flow Documentation

## Overview
This document describes the flow and logic for the Input Order feature in the Molagis React application. The feature allows users to create new catering orders with multiple delivery dates, packages, and customization options.

## Architecture

### Component Structure
```
InputOrderPage (Main Container)
├── FormProgress (Progress indicator)
├── DatePicker (Calendar selection)
├── CustomerInput (Autocomplete customer search)
├── PackageSelector (Multiple package selection)
├── AdditionalItems (Collapsible extra items)
├── CourierAndShipping (Courier and shipping cost)
├── PaymentMethod (Payment method selection)
├── NotesSection (Tabbed notes interface)
└── OrderConfirmationModal (Final confirmation)
```

### Data Flow
1. **Form State Management**: Centralized state in `InputOrderPage` using React hooks
2. **Component Communication**: Props-based data flow with callback functions
3. **Validation**: Real-time validation with visual feedback
4. **Submission**: Multi-step confirmation process before API submission

## User Flow

### 1. Date Selection
- User selects delivery dates using the calendar interface
- Supports multiple date selection with drag functionality
- Excludes Sundays and national holidays automatically
- Quick selection options (7 days, 14 days)
- Visual feedback for selected dates with badges

### 2. Customer Selection
- Autocomplete search with minimum 2 characters
- Real-time filtering of customer database
- Keyboard navigation support (arrow keys, enter, escape)
- Automatic shipping cost update based on customer
- Display customer address and default shipping cost

### 3. Package Selection
- Multiple package selection with quantity
- Add/remove package functionality (max 5 packages)
- Real-time price calculation
- Package summary with subtotals
- Validation for minimum one package requirement

### 4. Additional Items (Optional)
- Collapsible section for extra items
- Price and modal price input
- Quick template buttons for common items
- Profit calculation display
- Clear functionality

### 5. Courier and Shipping
- Courier selection from active couriers list
- Shipping cost input with quick preset buttons
- Visual indicator for standard vs custom rates
- Validation for positive shipping costs

### 6. Payment Method
- Three payment options: COD, Transfer, Belum Bayar
- Contextual information for each method
- Quick selection buttons
- Payment status indicator

### 7. Notes Section
- Tabbed interface for different note types:
  - Order Notes: General order information
  - Kitchen Notes: Cooking instructions
  - Courier Notes: Delivery instructions
- Template buttons for common notes
- Character count and preview
- Notes summary display

### 8. Form Submission
- Real-time form validation
- Progress indicator showing completion percentage
- Confirmation modal with order summary
- Error handling with user feedback
- Success notification and form reset

## Technical Implementation

### State Management
```typescript
interface OrderFormData {
  customerId: number | null;
  customerName: string;
  customerAddress: string;
  selectedDates: Set<string>;
  packages: OrderPackage[];
  additionalItem: AdditionalItem;
  courierId: number | null;
  shippingCost: number;
  paymentMethod: PaymentMethodType;
  notes: OrderNotes;
}
```

### Validation Logic
- **Customer**: Required, must be selected from database
- **Dates**: Minimum 1 date, excludes holidays/Sundays
- **Packages**: Minimum 1 package with valid quantity
- **Shipping**: Must be positive number
- **Payment**: Required selection

### API Integration
- **GET /api/customers**: Fetch customer list for autocomplete
- **GET /api/packages**: Fetch available packages
- **GET /api/couriers**: Fetch active couriers
- **POST /api/order**: Submit complete order data

## Order Submission Logic

### Data Transformation
The form data is transformed into the API-expected format:

```typescript
interface SubmitOrderData {
  customer_id: number;
  order_data: {
    customer_id: number;
    tanggal_pesan: string;
    total_harga: number;
    notes: string;
    catatan_dapur: string;
    catatan_kurir: string;
    metode_pembayaran: string;
  };
  delivery_dates: DeliveryDate[];
  order_details: OrderDetail[];
  new_ongkir?: number;
}
```

### Calculation Logic

#### Total Calculation
```typescript
const calculateTotals = (): OrderTotals => {
  const packageCost = packages.reduce((total, pkg) => {
    return total + (packagePrice * pkg.quantity);
  }, 0);
  
  const additionalCost = additionalItem.price || 0;
  const totalPerDay = packageCost + additionalCost + shippingCost;
  const totalPayment = totalPerDay * selectedDates.size;
  
  return { totalPerDay, totalPayment, shipping: shippingCost };
};
```

#### Order Details Generation
For each selected date and package combination:
```typescript
sortedDates.forEach((date, dateIndex) => {
  packages.forEach(pkg => {
    if (pkg.packageId && pkg.quantity > 0) {
      orderDetails.push({
        delivery_index: dateIndex,
        paket_id: pkg.packageId,
        jumlah: pkg.quantity,
        subtotal_harga: packagePrice * pkg.quantity
      });
    }
  });
});
```

### Error Handling
- Network errors with retry mechanism
- Validation errors with field-specific feedback
- Server errors with user-friendly messages
- Loading states during submission

## Performance Optimizations

### Caching
- Package data cached in localStorage (1 hour TTL)
- Customer data fetched once per session
- Holiday data cached per year

### Debouncing
- Customer search input debounced (300ms)
- Form validation debounced for better UX

### Lazy Loading
- Components loaded on-demand
- API calls triggered only when needed

## Mobile Responsiveness

### Touch Interactions
- Enhanced touch targets (44px minimum)
- Drag selection for date picker
- Haptic feedback where supported
- Prevent zoom on form inputs

### Layout Adaptations
- Responsive grid layouts
- Collapsible sections on mobile
- Optimized button sizes
- Scrollable modals

## Accessibility Features

### Keyboard Navigation
- Tab order optimization
- Arrow key navigation in date picker
- Enter/Escape key handling in modals
- Focus management

### Screen Reader Support
- ARIA labels and descriptions
- Semantic HTML structure
- Status announcements
- Error message associations

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Validation logic
- Calculation functions

### Integration Tests
- Form submission flow
- API integration
- Error handling
- User interactions

### E2E Tests
- Complete order creation flow
- Mobile responsiveness
- Cross-browser compatibility
- Performance benchmarks

## Future Enhancements

### Planned Features
1. **Order Templates**: Save and reuse common orders
2. **Bulk Date Selection**: Select date ranges
3. **Package Bundles**: Pre-configured package combinations
4. **Customer Groups**: Bulk orders for multiple customers
5. **Recurring Orders**: Automated recurring deliveries

### Technical Improvements
1. **Offline Support**: PWA capabilities
2. **Real-time Updates**: WebSocket integration
3. **Advanced Validation**: Server-side validation
4. **Analytics**: User behavior tracking
5. **Performance**: Virtual scrolling for large lists

## Troubleshooting

### Common Issues
1. **Date Selection Not Working**: Check holiday API availability
2. **Customer Search Slow**: Verify API response times
3. **Form Not Submitting**: Check validation errors
4. **Mobile Layout Issues**: Test on actual devices

### Debug Tools
- React DevTools for component inspection
- Network tab for API monitoring
- Console logs for error tracking
- Performance profiler for optimization

## API Endpoints

### Required Endpoints
```
GET /api/customers - Fetch customer list
GET /api/packages - Fetch package list  
GET /api/couriers - Fetch courier list
POST /api/order - Submit order data
* UPDATE: NOW USE DIRECLY SUPABASE API
```

### External APIs
```
GET https://api-harilibur.pages.dev/api?year={year} - Holiday data
```

## Configuration

### Environment Variables
```
VITE_API_BASE_URL - Base API URL
VITE_HOLIDAY_API_URL - Holiday API URL
VITE_CACHE_TTL - Cache time-to-live
```

### Feature Flags
- Enable/disable holiday checking
- Enable/disable customer caching
- Enable/disable mobile optimizations