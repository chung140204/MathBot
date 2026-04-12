# Implementation Plan: Image Paste Feature

## 📌 User Request (VERBATIM)
> cập nhật thêm tính năng paste ảnh ở chỗ nội dung câu hỏi

## 🎯 Acceptance Criteria (Derived from User Request)
| ID | Criterion | Verification Method |
|----|-----------|---------------------|
| AC1 | Người dùng có thể dán (paste) ảnh từ clipboard trực tiếp vào ô "Nội dung câu hỏi". | Sao chép một vùng ảnh (Vd: từ Snipping Tool) và dán (Ctrl+V) vào textarea. |
| AC2 | Ảnh sau khi dán phải được tự động upload lên server. | Kiểm tra thông báo toast thành công và `contentImageUrl` được cập nhật. |
| AC3 | Preview hiển thị ảnh vừa dán ngay lập tức. | Kiểm tra Right Panel (Live Preview) hiển thị ảnh. |

## 📋 Context Summary
**Architecture**: Next.js (App Router) with Client Components.
**Patterns**: Custom image upload API at `/api/v1/admin/upload/image`. File size limit 5MB. Toast notifications via `react-hot-toast`.
**Constraints**: Must maintain existing file selection upload functionality.

## Overview
Reusing the existing upload infrastructure in `ManualInputForm.tsx` to handle clipboard image events. The implementation logic will be refactored to share code between manual file selection and clipboard pasting.

## Prerequisites
- [x] Analyze `ManualInputForm.tsx` (Completed in Phase 1)

## Phase 1: Implementation
### Tasks
- [ ] Task 1.1: Refactor `handleImageUpload`
  - Agent: `frontend-engineer`
  - File(s): `components/admin/ManualInputForm.tsx`
  - Acceptance: A reusable `processFileUpload(file: File, target: string)` function is created.
  - Verification: Manual file upload still works correctly.
- [ ] Task 1.2: Implement `handlePaste`
  - Agent: `frontend-engineer`
  - File(s): `components/admin/ManualInputForm.tsx`
  - Acceptance: `handlePaste` correctly extracts image from clipboard and calls `processFileUpload`.
  - Verification: Console log confirms image detection on paste.
- [ ] Task 1.3: Update Question Textarea
  - Agent: `frontend-engineer`
  - File(s): `components/admin/ManualInputForm.tsx`
  - Acceptance: `onPaste={handlePaste}` is added to the question content textarea.
  - Verification: Pasting an image triggers the upload flow and updates the preview.

### Exit Criteria
- [ ] User can paste images from clipboard into question content.
- [ ] Existing upload buttons still work.

## Risks
| Risk | Impact | Mitigation | Rollback |
|------|--------|------------|----------|
| Paste event not firing on all browsers | Medium | Use standard `onPaste` event and check for `clipboardData`. | Revert `onPaste` handler. |
| Multiple images in clipboard | Low | Process only the first image or all sequentially. | Limit to first image. |

## Rollback Strategy
1. Revert changes to `ManualInputForm.tsx` to restore original `handleImageUpload` and remove `onPaste`.

## Implementation Notes
- Use `event.clipboardData.items` and `item.getAsFile()`.
- Ensure `isUploading` state is used to show loading indicator.
