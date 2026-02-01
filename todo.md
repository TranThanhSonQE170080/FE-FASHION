# E-Commerce Clothing Store - Development Plan

## Design Guidelines

### Design References (Primary Inspiration)
- **ASOS.com**: Modern fashion e-commerce with clean product grids
- **Zara.com**: Minimalist design, large product images, elegant typography
- **H&M.com**: User-friendly navigation, clear categories
- **Style**: Modern Minimalism + Clean Fashion + Premium E-commerce

### Color Palette
- Primary: #000000 (Pure Black - header, text, buttons)
- Secondary: #FFFFFF (White - background, cards)
- Accent: #FF6B6B (Coral Red - CTAs, sale tags, highlights)
- Gray Scale: #F5F5F5 (Light Gray - backgrounds), #666666 (Medium Gray - secondary text)
- Success: #4CAF50 (Green - in stock indicators)

### Typography
- Heading1: Inter font-weight 700 (48px) - Hero titles
- Heading2: Inter font-weight 600 (36px) - Section titles
- Heading3: Inter font-weight 600 (24px) - Product names
- Body/Normal: Inter font-weight 400 (16px) - Descriptions
- Body/Small: Inter font-weight 400 (14px) - Labels, tags
- Price: Inter font-weight 700 (24px) - Product prices

### Key Component Styles
- **Buttons**: Black background (#000000), white text, 4px rounded, hover: scale 1.05
- **Product Cards**: White background, subtle shadow, 8px rounded, hover: lift 4px
- **Forms**: Clean inputs with bottom border, focus: coral accent
- **Tags**: Small rounded pills with light backgrounds
- **Navigation**: Sticky header, clean menu items, smooth transitions

### Layout & Spacing
- Hero section: Full width with large product showcase
- Product grid: 4 columns desktop, 3 tablet, 2 mobile, 24px gaps
- Section padding: 60px vertical, 24px horizontal
- Card hover: Lift 4px with shadow, 300ms transition
- Max width: 1400px for content

### Images to Generate
1. **hero-fashion-banner.jpg** - Modern fashion model wearing trendy outfit, studio lighting, clean background (Style: photorealistic, fashion photography)
2. **category-mens-wear.jpg** - Men's casual clothing collection, modern style (Style: photorealistic, product photography)
3. **category-womens-wear.jpg** - Women's fashion collection, elegant and modern (Style: photorealistic, product photography)
4. **category-accessories.jpg** - Fashion accessories like bags, watches, sunglasses (Style: photorealistic, product photography)

---

## Development Tasks

### 1. Database Setup
- Create products table with schema: id, name, description, price, image, category, size, color, stock, created_at
- Fields: 
  - id: Integer (auto-increment)
  - name: String (required)
  - description: String (required)
  - price: Number (required)
  - image: String (URL)
  - category: String (men, women, accessories)
  - size: String (XS, S, M, L, XL, XXL)
  - color: String
  - stock: Integer
  - created_at: DateTime

### 2. Mock Data Generation
- Insert 20+ clothing products into database
- Categories: Men's Wear, Women's Wear, Accessories
- Variety: T-shirts, Jeans, Dresses, Jackets, Bags, Shoes
- Include realistic Vietnamese product names and descriptions

### 3. Homepage Development
- Hero banner with CTA
- Category navigation cards
- Featured products grid (4 columns)
- Filter sidebar (category, price range, size)
- Search functionality
- Responsive design

### 4. Product Detail Page
- Large product image gallery
- Product information (name, price, description)
- Size selector
- Color selector
- Stock status indicator
- Add to cart button
- Related products section

### 5. Admin Panel
- Product list table with edit/delete actions
- Create product form (name, description, price, image URL, category, size, color, stock)
- Update product form (pre-filled with existing data)
- Delete confirmation modal
- Form validation

### 6. Navigation & Layout
- Sticky header with logo, menu, search bar
- Navigation menu: Home, Men, Women, Accessories, Admin
- Footer with links and info
- Shopping cart icon (visual only for now)
- Responsive mobile menu

### 7. Advanced Features
- Search products by name
- Filter by category, price range
- Sort by price (low to high, high to low)
- Pagination (12 products per page)
- Loading states
- Error handling
- Responsive design for all screen sizes

---

## File Structure

### Frontend Files to Create/Modify
- `src/pages/Index.tsx` - Homepage with product grid
- `src/pages/ProductDetail.tsx` - Product detail page
- `src/pages/Admin.tsx` - Admin panel for CRUD operations
- `src/pages/AuthCallback.tsx` - Auth callback handler
- `src/components/Header.tsx` - Navigation header
- `src/components/Footer.tsx` - Footer component
- `src/components/ProductCard.tsx` - Product card component
- `src/components/ProductForm.tsx` - Create/Edit product form
- `src/components/FilterSidebar.tsx` - Filter and search sidebar
- `src/lib/api.ts` - API client configuration
- `src/App.tsx` - Add routing for all pages
- `index.html` - Update title and meta tags

### Backend Files (Auto-generated)
- `backend/models/products.py` - Product ORM model
- `backend/routers/products.py` - Product API routes
- `backend/services/products.py` - Product business logic

---

## API Endpoints (Auto-generated by Backend)

- GET /api/v1/products - List all products (with query params for filtering)
- GET /api/v1/products/{id} - Get single product
- POST /api/v1/products - Create new product
- PUT /api/v1/products/{id} - Update product
- DELETE /api/v1/products/{id} - Delete product

---

## Notes

- Use shadcn-ui components for consistent UI
- Implement responsive design with Tailwind CSS
- Use React hooks for state management
- Integrate with Atoms Backend for database operations
- Follow Vietnamese language for product names and descriptions
- Ensure all forms have proper validation
- Add loading states for all API calls
- Implement error handling with toast notifications