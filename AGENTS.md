# AGENTS.md - Development Guide for Coding Agents

This document provides essential information for AI coding agents working on the `dozto-payment-h5` project.

## Project Overview

- **Framework**: SvelteKit 2.x with Svelte 5
- **Language**: TypeScript (strict mode)
- **Package Manager**: Bun (note: `bun.lock` present)
- **UI Framework**: Tailwind CSS 4.x + shadcn-svelte components
- **Database**: Dexie.js (IndexedDB wrapper)
- **Real-time**: Socket.io client
- **Build Tool**: Vite 7.x

## Commands

### Development

```bash
bun dev                  # Start dev server
bun run build            # Build for production
bun run preview          # Preview production build
```

### Type Checking & Linting

```bash
bun run check            # Type-check with svelte-check
bun run check:watch      # Type-check in watch mode
bun run lint             # Check formatting with Prettier
bun run format           # Format code with Prettier
```

### Testing

**E2E Testing** (Playwright):

```bash
bun run e2e             # Run all E2E tests headless
bun run e2e:ui          # Run tests in UI mode (interactive)
bun run e2e:headed      # Run tests in headed mode (see browser)
bun run e2e:debug       # Run tests in debug mode
bun run e2e:report      # Show HTML test report
playwright test tests/dashboard.spec.ts  # Run single test file
```

**Unit Testing**: Not yet configured. Consider Vitest for unit tests:

```bash
# After installing Vitest:
vitest                  # Run unit tests in watch mode
vitest run              # Run unit tests once
vitest run path/to/test.spec.ts  # Run single test file
```

## Code Style Guidelines

### Formatting

- **Indentation**: Tabs (not spaces) - configured in `.prettierrc`
- **Quotes**: Single quotes for strings
- **Line Width**: 100 characters max
- **Trailing Commas**: None
- **Semicolons**: Required (TypeScript/Prettier default)

### Imports

- **Order**: External packages first, then internal imports using path aliases
- **Extensions**: Use `.js` for TypeScript imports (SvelteKit convention)
- **Style**: Named imports preferred over default imports
- **Path Aliases** (configured in `svelte.config.js`):
  - `$lib` - src/lib (SvelteKit default)
  - `$store` - src/lib/stores
  - `$config` - src/lib/config
  - `$service` - src/lib/services
  - `$types` - src/lib/types
  - `$api` - src/lib/api
  - `$db` - src/lib/db
  - `$socket` - src/lib/socket
  - `$utils` - src/lib/utils

Example:

```typescript
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Order } from '$types/payments.js';
import { orderRepository } from '$db/index.js';
```

### Naming Conventions

- **Files**: kebab-case (e.g., `order-sync.service.ts`, `user.store.ts`)
- **Components**: kebab-case for files, PascalCase for component names (e.g., `app-sidebar.svelte` exports `AppSidebar`)
- **Types/Interfaces**: PascalCase (e.g., `Order`, `Transaction`, `GetPaymentsResponse`)
- **Enums**: PascalCase with SCREAMING_SNAKE_CASE values (e.g., `Providers.WECHATPAY`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DEMO_ORG_ID`, `PAYMENTS_PAGE_LIMIT`)
- **Functions**: camelCase (e.g., `getPayments`, `normalizeOrder`)
- **Variables**: camelCase
- **Stores**: camelCase with `Store` suffix (e.g., `userStore`, `ordersStore`)

### TypeScript

- **Strict Mode**: Enabled - always provide types
- **Type Imports**: Use `type` keyword for type-only imports
  ```typescript
  import type { Order } from '$types/payments.js';
  ```
- **Nullability**: Use `null` for intentional absence, `undefined` for optional properties
- **Type Assertions**: Avoid `as` casting; prefer type guards or validation
- **Zod Validation**: Use Zod schemas for external data (API responses)
  ```typescript
  const parsed = OrderSchema.safeParse(rawOrder);
  if (!parsed.success) {
  	throw new Error(`Validation failed: ${parsed.error.message}`);
  }
  ```

### Svelte 5 Patterns

- **Runes**: Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`)
  ```svelte
  let { data }: { data: DataType } = $props();
  const computed = $derived(data.value * 2);
  ```
- **Stores**: Import from `svelte/store`, use `$` prefix for auto-subscription
  ```svelte
  import {ordersStore} from '$store/order.store.js';
  {#if $ordersStore === undefined}
  	<p>Loading…</p>
  {:else}
  	<OrderTable orders={$ordersStore ?? []} />
  {/if}
  ```

### Error Handling

- **Async Errors**: Always wrap API calls in try-catch
- **User-Facing Errors**: Provide clear, actionable messages
- **Validation Errors**: Include context (e.g., record ID) in error messages
  ```typescript
  throw new Error(`Invalid order shape (id=${rawOrder.id ?? '?'}): ${parsed.error.message}`, {
  	cause: parsed.error
  });
  ```
- **API Errors**: Include status code and URL
  ```typescript
  throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  ```

### Architecture Patterns

- **Stores**: Reactive state management in `src/lib/stores/`
  - Export store, derived stores, and action objects
  - Persist to localStorage when in browser context
- **Services**: Business logic in `src/lib/services/`
  - Coordinate between API, database, and stores
  - Handle side effects and data transformations
- **Repositories**: Data access layer in `src/lib/db/repositories/`
  - Thin wrappers around Dexie tables
  - One repository per table/entity
- **Adapters**: Data transformation in `src/lib/adapters/`
  - Normalize external data to internal types
  - Use Zod for validation
- **API Layer**: HTTP clients in `src/lib/api/`
  - Accept `fetch` function as parameter for SSR compatibility
  - Return typed responses with Zod validation

### Comments

- **Prefer**: Self-documenting code over comments
- **Use Chinese**: For business logic explanations (project appears to have Chinese context)
- **JSDoc**: For public APIs and complex functions
- **Avoid**: Obvious comments, commented-out code

### Component Organization

```svelte
<script lang="ts">
	// 1. Imports (external, then internal)
	// 2. Props with $props()
	// 3. State with $state()
	// 4. Derived values with $derived()
	// 5. Effects with $effect()
	// 6. Functions
</script>

<!-- Template -->

<style>
	/* Component-specific styles (if needed) */
</style>
```

## Browser Checks

Always guard browser-only code:

```typescript
import { browser } from '$app/environment';

if (!browser) return;
// browser-only code
```

## Git Workflow

- Commit messages: Use conventional style (e.g., "feat:", "fix:", "refactor:")
- Keep commits atomic and focused
- Ensure `bun run check` and `bun run lint` pass before committing
