## Inter‑Warehouse Management System — Frontend

**Stack**: React + Vite + TypeScript (Node 20), Tailwind CSS, shadcn/ui, Cloudflare Pages (deploy), Cloudflare R2 (object storage via presigned URLs), Supabase (Auth/JWT)

### Goals
- Fast, modular SPA following Clean Architecture principles
- Strict type safety, clear feature boundaries, and barrel exports for DX
- Direct-to-storage uploads using presigned URLs; minimal backend coupling for media

### High-level Architecture
- Presentation (UI): pages, features, widgets, and shared UI components
- Application: state, services (API clients), and cross-cutting utilities
- Domain: types/models and business rules used client-side
- Infrastructure: API gateway, auth client, storage client

### Folder Architecture (proposed)
```
src/
  app/                    # app shell and composition roots
    providers/            # QueryClient, Theme, Router, Auth providers
    routes/               # Route objects; lazy-loaded pages
    index.tsx             # App entry
    main.tsx              # Vite bootstrap

  api/                    # CENTRALIZED API LAYER
    baseApi.ts            # axios instance + interceptors (JWT, org/warehouse headers)
    authApi.ts            # auth/session + /auth/status + /auth/bootstrap
    usersApi.ts           # users endpoints
    attachmentsApi.ts     # presign/upload endpoints
    index.ts              # barrel (re-exports)

  entities/               # Domain entities (types and minimal logic)
    user/
      model.ts            # User, Role, Privilege types
      index.ts            # barrel
    warehouse/
      model.ts
      index.ts
    product/
      model.ts
      index.ts
    inventory/
      model.ts
      index.ts

  features/               # Use-cases grouped by feature (Clean + FSD-inspired)
    auth/
      api.ts              # calls to backend/supabase auth endpoints
      hooks.ts            # useAuth, useSession
      components/
        LoginForm.tsx
        LogoutButton.tsx
        index.ts
      index.ts            # barrel
    users/
      api.ts              # manage users/roles/privileges
      pages/              # list, details, edit
      components/
        UserForm.tsx
        UsersTable.tsx
        index.ts
      index.ts
    warehouses/
      api.ts              # CRUD warehouses/zones/bins
      pages/
      components/
        WarehouseForm.tsx
        index.ts
      index.ts
    products/
      api.ts              # CRUD SKUs, categories, UOM, lots/expiry
      pages/
      components/
        ProductForm.tsx
        index.ts
      index.ts
    inventory/
      api.ts              # stock by warehouse/location; adjustments; counts
      components/
        AdjustmentForm.tsx
        CycleCountForm.tsx
        index.ts
      index.ts
    transfers/
      api.ts              # inter-warehouse transfer flows
      pages/
      components/
        TransferForm.tsx
        TransferApproveModal.tsx
        index.ts
      index.ts
    receiving/
      api.ts              # receiving from purchases/transfers
      components/
        ReceivingForm.tsx
        index.ts
      index.ts
    shipping/
      api.ts              # picking/packing/shipping
      components/
        ShipmentForm.tsx
        index.ts
      index.ts
    attachments/
      api.ts              # presigned URL requests; list attachments
      components/
        FileUpload.tsx
        AttachmentList.tsx
        index.ts
      index.ts
    reports/
      api.ts              # stock on hand, movement, aging
      pages/
      components/
        ReportsFilters.tsx
        index.ts
      index.ts

  pages/                  # Route-level pages composing features
    DashboardPage.tsx
    WarehousesPage.tsx
    ProductsPage.tsx
    InventoryPage.tsx
    TransfersPage.tsx
    ReceivingPage.tsx
    ShippingPage.tsx
    UsersPage.tsx
    ReportsPage.tsx
    index.ts

  shared/                 # Reusable, cross-cutting building blocks
    ui/                   # shadcn/ui wrappers, primitives
      Button.tsx
      Dialog.tsx
      DataTable.tsx
      index.ts
    lib/                  # utils, formatting, date, zod schemas
      date.ts
      validation.ts
      index.ts
    config/               # runtime configuration helpers
      env.ts              # reads Vite env vars
      rbac.ts             # client-side RBAC helpers (guarding UI)
      index.ts

  widgets/                # Page-level compositions (cards, dashboards)
    inventory/StockCard.tsx
    transfers/TransfersWidget.tsx
    index.ts

  styles/
    globals.css
    tailwind.css
    index.ts

  app.d.ts                # ambient types

public/
  favicon.svg
```

Barrel files: Each folder exposes public API via `index.ts`. Avoid deep imports; import from feature roots.

### Authentication, Authorization, Roles & Access
- Auth: Supabase Auth (email/password, OTP, OAuth) consumed via `@supabase/supabase-js`.
- Session: client stores session (Supabase client). Backend validates Supabase JWT.
- Roles (suggested): `SUPER_ADMIN`, `ORG_ADMIN`, `WAREHOUSE_MANAGER`, `INVENTORY_CONTROLLER`, `OPERATOR`, `VIEWER`, `AUDITOR`.
- Privileges (examples): users.manage, roles.manage, warehouses.manage, products.manage, inventory.view, adjustments.create, transfers.create, transfers.approve, receiving.process, shipping.process, counts.perform, reports.view, attachments.upload.
- Scoping: organization-level vs warehouse-level access; UI shows/hides controls based on role/privilege.

Client-side guards
- Route guards and component guards read privileges from JWT claims (e.g., `roles`, `permissions`, `warehouseIds`).
- Always enforce authorization on the backend; client checks are UX only.

#### Auth Sub‑features (spec)
- Registration
  - Users can sign up from the login page (registration form)
  - On sign‑up, users are automatically assigned `ORG_ADMIN` on the client side context and via backend role assignment API
  - First registered account (if no `SUPER_ADMIN` exists) is elevated to `SUPER_ADMIN` by backend
- Email Verification Gate
  - After sign‑in, if `email_confirmed_at` is not set (Supabase), show a gate screen prompting verification
  - Provide a "Resend verification" action
- Approval Gate (Super‑Admin approval)
  - After email is verified, the app checks `approved` status from backend (`GET /auth/status`)
  - If `approved=false`, show a gate screen: "Your account is pending approval by a Super‑Admin"
  - When approved, the user gains access according to assigned roles/privileges
- Admin: Approvals Queue
  - Page for `SUPER_ADMIN` to list pending users and approve/reject them
  - Approve action sets `approved=true` and assigns/adjusts role(s)
- Session & Claims
  - Client stores Supabase session; role/permission decisions use backend status (`/auth/status`) plus JWT metadata
  - Optional: persist `roles` and `permissions` in `user_metadata` for UI hints; backend remains the source of truth

### Key Features (UI scope, aligned with project document)
- Warehouses & Locations
  - Manage organizations, warehouses, zones, and bin/locations
  - Configure capacity and attributes; filterable lists and detail pages
- Products & Lots
  - SKU catalog with categories, UoM, barcodes; lot/expiry support
- Inventory Monitoring
  - Real‑time stock by warehouse/location; lot‑level view
  - Inventory adjustments (reason‑coded) and cycle counts (blind/controlled)
- Inter‑Warehouse Transfers
  - Request → approve → allocate/pick → pack → dispatch → in‑transit → receive → reconcile
  - Partial shipments and discrepancy handling
- Receiving (Inbound)
  - ASN/GRN flows, putaway suggestions, quarantine/quality flags
- Shipping (Outbound)
  - Pick/pack/ship flows, packing list, labels, carrier/tracking
- Attachments & Documents
  - Upload GRNs, delivery notes, and photos to R2 via presigned URLs
- Reports & Dashboards
  - Stock on hand, movement, aging/expiry; cards/widgets for KPIs
- Users & Access
  - Role assignment, warehouse scoping, approvals by role

### Configuration
Environment variables (Vite `import.meta.env`):
```
VITE_API_BASE_URL=                      # Render backend URL
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=          # use publishable key (legacy: VITE_SUPABASE_ANON_KEY)
VITE_R2_PUBLIC_BASE_URL=                # Optional public CDN base if reading directly
VITE_ORG_ID=                            # Optional: org scoping for API requests
VITE_WAREHOUSE_ID=                      # Optional default warehouse context
```

### Conventions
- Type-first (strict TS). Prefer Zod schemas for API payloads.
- All components and features have `index.ts` barrels.
- CSS: Tailwind with shadcn/ui primitives; avoid ad-hoc class soup—compose utilities.
- API: Use a single `http` client with interceptors for auth and error handling.

### Scripts (indicative)
```
npm run dev       # vite dev
npm run build     # vite build
npm run preview   # vite preview
```

### Deployment
- Cloudflare Pages for static hosting
- Backend URL and Supabase keys provided via Pages project environment variables
- Media uploads use presigned URLs from the backend to Cloudflare R2

### Routing & Guards
- Each `pages/*Page.tsx` composes feature components and uses route guards
- Guard examples:
  - Route requires: `permissions.includes('transfers.approve')`
  - Warehouse‑scoped routes append `?warehouseId=...`
 - Auth routes:
   - `/login` (with link to register) and `/register`
   - `/gate` (post‑login gate that determines: verify email → wait approval → enter app)

### API Client
- All requests go through the centralized client in `src/api/baseApi.ts` with:
  - Supabase JWT in `Authorization: Bearer <token>`
  - `X-Org-Id`/`X-Warehouse-Id` headers if present
- Feature modules import API functions from `src/api/*Api.ts` (e.g., `authApi`, `usersApi`, `attachmentsApi`).


