# Frontend Tests

## Structure
- `tests/unit/api/clients` - pure unit tests for API client helpers.
- `tests/unit/smoke` - broad import smoke tests covering all components/hooks/functions/api modules.
- `tests/unit/hooks` - unit tests for custom React hooks (behavior + API integration through mocks).
- `tests/unit/components` - unit tests for isolated React components.
	- Includes `all-components.imports.test.ts` to cover every file under `src/components`.
	- Includes `components/folders/*.imports.test.ts` for explicit per-folder coverage across all top-level folders.
- `tests/integration` - feature-level tests that combine hooks/components with mocked APIs.

## Running tests
- All tests: `npm test`
- All unit tests: `npm run test:unit`
- Unit API clients only: `npx vitest run tests/unit/api/clients`
- All smoke coverage: `npm run test:smoke`
- All components tests (including all-file import coverage): `npm run test:components`
- Per-folder components coverage only: `npm run test:components:folders`
- Hooks tests only: `npx vitest run tests/unit/hooks`
- Components tests only: `npx vitest run tests/unit/components`
- Single file: `npx vitest run tests/unit/api/clients/upcomingSupportClient.test.ts`

## Current behavior tests
- `tests/unit/hooks/useSupportFolder.test.tsx`
- `tests/unit/hooks/useUpcomingSupport.test.tsx`
- `tests/unit/components/UpcomingSupportCard.test.tsx`
