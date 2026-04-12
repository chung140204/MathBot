# Scout Report: Image Paste Feature

## Exploration Scope
- Target: `ManualInputForm.tsx` and `UploadClient.tsx`
- Boundaries: `components/admin/`, `app/admin/upload/`

## Patterns Discovered
### Pattern: Image Upload Logic
- **Location**: `components/admin/ManualInputForm.tsx:76-120`
- **Usage**: Handles file selection, validation (5MB limit), and POSTing to `/api/v1/admin/upload/image`.
- **Must Follow**: Yes (reusing the same API and validation)

### Pattern: State Synchronization
- **Location**: `components/admin/ManualInputForm.tsx:98-112`
- **Usage**: Updates specific state fields (`contentImageUrl`, `options`, `statements`) based on the upload target.
- **Must Follow**: Yes

## Integration Points
| Point  | File   | Function | New Code Location |
| ------ | ------ | -------- | ----------------- |
| Question Content Textarea | `components/admin/ManualInputForm.tsx` | `textarea` | Add `onPaste={handlePaste}` to the textarea at line 317. |
| Upload Logic | `components/admin/ManualInputForm.tsx` | `handleImageUpload` | Refactor into a core `uploadFile(file, target)` function to be used by both `onChange` and `onPaste`. |

## Conventions
- Naming: `handlePaste`, `uploadFile`
- File organization: Keep logic in `ManualInputForm.tsx` unless it grows too large.

## Warnings
- ⚠️ Ensure `onPaste` correctly identifies image types in `clipboardData.items`.
- ⚠️ Handle multiple items if necessary, though typical use is one image.
- ⚠️ The "Loader2 is not defined" error in `UploadClient.tsx` appears to be a false positive or stale error as the import exists at line 21. No action needed unless it persists in runtime.
