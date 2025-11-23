Next.js Project Architecture and Coding Conventions

This document outlines the standard architecture, directory structure, state management principles, and component usage conventions for this Next.js project.

Directory Structure

We use a flat, domain-driven structure within the primary src/ directory.

.
├── src
│   ├── components          # Common UI elements (Dumb/Presentation components). If complex, create a directory.
│   ├── config              # Project-wide settings (e.g., API URLs, chain IDs, wallet config).
│   ├── features            # Domain-specific, complex business logic pages (Container components).
│   │   ├── Swap
│   │   │   ├── index.tsx         # The main entry page for the Swap feature (Container).
│   │   │   ├── useSwapStore.ts   # Feature-specific Zustand store (NOT shared).
│   │   │   ├── utils.ts          # Feature-specific utility functions (NOT shared).
│   │   │   └── components        # Swap-specific dumb components.
│   │   └── .... (other features, e.g., Farm, Pool)
│   ├── hooks               # Project-wide custom hooks (excluding store-specific hooks).
│   ├── icons               # SVG or React components for icons (e.g., Lucide, custom SVGs).
│   ├── pages               # Next.js route handlers (must be kept thin).
│   ├── providers           # Context providers (e.g., WalletProvider, ThemeProvider) wrapping pages/_app.tsx.
│   ├── store               # Shared, global Zustand stores (created using store/createStore helper).
│   └── utils               # Project-wide, reusable utility functions.
└── pages/                  # Standard Next.js routing directory. Pages here should be thin wrappers.


Coding and Architectural Rules

These rules ensure maintainability, testability, and clear separation of concerns.

1. State Management (Zustand)

Initialization: Every Zustand store must define both state and actions (functions) clearly within its initialization object.

Async Operations Centralization (Crucial): All API calls and asynchronous operations should be encapsulated within Zustand actions. DO NOT wrap these calls directly in multiple components or custom hooks. This ensures a single source of truth and simplifies caching/loading logic.

Store Naming: Feature-specific stores must be named clearly (e.g., useSwapStore).

2. Component Purity

Common Components (src/components): Components here must be as pure (side-effect free) as possible. Features should be controlled exclusively by props. To add new functionality, always introduce a new prop rather than changing internal logic that could break other usages.

Feature Components (src/features/.../components): Components within features should also remain pure/dumb. They receive data and event handlers (functions) via props from their parent index.tsx (the Container). This prevents business logic from scattering across various files.

3. Next.js Pages

Thin Pages: Pages in pages/ (or src/pages/) should act primarily as entry points. Their responsibilities are limited to:

Defining the layout.

Initial data fetching (if necessary via SSR/SSG/ISR).

Dispatching initial Zustand actions.

Rendering the relevant top-level component from src/features/.

Component Abstraction Map

We use custom wrappers around Chakra UI components for better theming consistency and to pre-emptively add common functionality (like tooltips or validation logic).

Component Name

File Path

Extends

Purpose & Key Props

Rationale (Optimization)

<TokenAvatar>

./src/components/TokenAvatar.tsx

Chakra <Avatar>

Displays token iconography. prop:token (Coin's SplToken)

Ensures consistent branding, styling, and future linking/clickability features are centrally managed.

<TokenSymbol>

./src/components/TokenSymbol.tsx

Chakra <Text>

Displays token symbol. prop:token (Coin's SplToken)

Standardizes token text presentation (e.g., font, color) and easily integrates future features like tooltips.

<Button>

./src/components/Button.tsx

Chakra <Button>

Standardized action button. prop:validators (Custom validation conditions array)

Centralizes logic for showing/hiding/disabling based on application-specific validation rules.

<ChartPanel>

./src/components/ChartPanel.tsx

N/A

Styled container for chart visualization.

Standardized UI container for visual data displays.

<MessageBox>

./src/components/MessageBox.tsx

N/A

Simple message/status display (Modal-style). prop:status (warning

error

<MessageStrip>

./src/components/MessageStrip.tsx

N/A

Inline message banner. prop:status (info

warning), prop:title, prop:desc, prop:renderControlAction

Hooks and Utility Map

Hook/Function Name

File Path

Purpose

Note/Refinement

useIsomorphicLayoutEffect()

./src/hooks/useIsomorphicLayoutEffect.ts

Server-Side Rendering (SSR) safe version of React.useLayoutEffect.

Standard practice in Next.js/SSR environments to prevent console warnings/bugs.

useEvent()

./src/hooks/useEvent.ts

Creates a stable function reference that always points to the latest function logic.

Essential for optimizing hooks that depend on functions which constantly change (e.g., useEffect dependencies).

useToast()

./src/hooks/useToast.tsx

Wrapper around Chakra's toast system with custom project (Raydium) styling applied.

Ensures all notifications have a consistent, branded look and feel.

searchItems()

./src/utils/searchItems.ts

Core search logic implementation.

TODO: Implement support for a configurable sort factor to improve search result relevance and ordering.

useSearch()

./src/hooks/useSearch.ts

Hook wrapper for searchItems().

Simplifies integration of the search logic into components.

Improvements and Suggestions

Naming Consistency

Suggestion: Change src/component to src/components (plural) for consistency with hooks, pages, features, and standard React naming conventions.

Suggestion: Ensure all feature-specific utility files are named utils.ts (plural) or follow a convention like swap.utils.ts for consistency.

Asset Handling (icons)

Clarification: The src/icons directory is listed as containing "Image files." For a Next.js project, clarify the intent:

If they are static asset files (PNG, JPG), they should typically go in the public/ directory.

If they are SVG files used as React components, they belong in src/components/Icons/.

Recommendation: Rename src/icons to src/components/Icons if they are reusable React components.

Next.js Boilerplate

The initial boilerplate "Getting Started" section (running npm run dev, editing pages/index.tsx, etc.) is standard Next.js documentation. I have removed it to keep this file focused strictly on project conventions and architecture.

This document is now much cleaner, uses standard English documentation language, and reinforces the excellent architectural decisions you've already made! Let me know if you would like me to dive deeper into any of the specific coding rules or expand the explanation of a component.
