# Scout Report: Standardizing MathBot Topic Constants

## Exploration Scope
- Target: Topic definitions across UI and API
- Boundaries: `prisma/schema.prisma`, `app/admin/upload/UploadClient.tsx`, `app/(dashboard)/study/page.tsx`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/practice/page.tsx`

## Patterns Discovered
### Pattern: Hardcoded Topic Config
- **Location**: 
  - `app/admin/upload/UploadClient.tsx:26-38`
  - `app/(dashboard)/study/page.tsx:12-24`
  - `app/(dashboard)/layout.tsx:11-23`
- **Usage**: Used for sidebar navigation, theory content filtering, and admin upload options.
- **Must Follow**: Yes. Needs to match `Topic` enum in Prisma.

### Pattern: Topic Subsections
- **Location**:
  - `app/(dashboard)/layout.tsx:33-45`
  - `app/(dashboard)/study/page.tsx:34-46`
- **Usage**: Hardcoded record mapping Topic keys to arrays of strings (theory sub-sections).
- **Must Follow**: Yes. Keys must match the standardized Topic IDs.

## Integration Points
| Point  | File   | Function | New Code Location |
| ------ | ------ | -------- | ----------------- |
| Topic Mapping | `src/lib/constants/topics.ts` | Exported constants | New file |
| Admin Upload | `app/admin/upload/UploadClient.tsx` | `TOPICS` constant | Replace with import |
| Study Page | `app/(dashboard)/study/page.tsx` | `TOPIC_CONFIG`, `TOPIC_SUBSECTIONS` | Replace with import |
| Dashboard Layout | `app/(dashboard)/layout.tsx` | `TOPIC_CONFIG`, `TOPIC_SUBSECTIONS` | Replace with import |
| Practice Page | `app/(dashboard)/practice/page.tsx` | `TOPICS` constant | Replace with import |

## Conventions
- Naming: UPPER_SNAKE_CASE for IDs, Title Case/Strings for labels.
- File organization: Constants stored in `src/lib/constants/`.

## Warnings
- ⚠️ Prisma enum uses `EXPONENTIAL_LOG`, `VOLUME`, `FUNCTIONS`, `LIMITS`, `PROBABILITY`.
- ⚠️ Frontend currently uses `EXPONENTIAL_LOGARITHM`, `VOLUMES`, `FUNCTION_ANALYSIS`, `LIMITS_AND_CONTINUITY`, `COMBINATORICS_PROBABILITY`.
- ⚠️ Mismatch will cause runtime errors or empty results in theory/practice if not normalized.
