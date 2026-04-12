# Implementation Plan: KaTeX Support for Correct Answer

## 📌 User Request (VERBATIM)
> chỗ đáp án chính xác này đang chưa hỗ trợ katex

## 🎯 Acceptance Criteria (Derived from User Request)
| ID | Criterion | Verification Method |
|----|-----------|---------------------|
| AC1 | Ô nhập "Đáp án chính xác" hiển thị preview KaTeX khi người dùng nhập LaTeX ($...$). | Nhập `$12,5$` và kiểm tra xem có hiển thị số được render đẹp mắt bên dưới không. |
| AC2 | Phần "Xem trước trực tiếp" (Live Preview) hiển thị đáp án chính xác bằng KaTeX. | Kiểm tra bảng Preview bên phải hiển thị đáp án đã render. |

## 📋 Context Summary
**Architecture**: React Client Component with KaTeX integration via `renderLatex` helper.
**Patterns**: Using `LatexPreview` component for rendering.
**Constraints**: Keep the input as a text field for ease of typing.

## Overview
Adding KaTeX rendering to the correct answer field to allow administrators to verify math expressions before saving.

## Prerequisites
- [x] Analyze `ManualInputForm.tsx` (Completed in Phase 1)

## Phase 1: Implementation
### Tasks
- [ ] Task 1.1: Add Preview to Form Field
  - Agent: `frontend-engineer`
  - File(s): `components/admin/ManualInputForm.tsx`
  - Acceptance: `LatexPreview` component added below the `correctAnswer` input.
  - Verification: Enter `$1/2$` in the field and see the fraction rendered.
- [ ] Task 1.2: Update Live Preview Display
  - Agent: `frontend-engineer`
  - File(s): `components/admin/ManualInputForm.tsx`
  - Acceptance: `LatexPreview` component used in the Right Panel for `SHORT_ANSWER`.
  - Verification: Preview panel correctly shows rendered math for the answer.

### Exit Criteria
- [ ] Correct answer field supports and previews LaTeX.
- [ ] Live preview updates in real-time with rendered LaTeX.

## Risks
| Risk | Impact | Mitigation | Rollback |
|------|--------|------------|----------|
| Multi-line rendering | Low | Use `whitespace-pre-wrap` if needed, but answers are usually short. | N/A |

## Rollback Strategy
1. Remove `LatexPreview` additions in those specific locations.
