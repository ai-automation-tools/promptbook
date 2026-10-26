# Library Mode Implementation Progress

> **Note (2026-10-21):** Phase 2 below planned a `library/My_Prompts/` tree inside the Public
> Library. That never shipped. My Library is a separate folder of markdown files, one per
> prompt (`site/lib/my-library.ts`, default `site/my-library/`, set with `MY_LIBRARY_DIR`),
> and sections are the numbered folders (`1_Guides` … `5_System_Prompts`), not
> `Prompt_Library` / `Agent_Instructions`. Write routes only ever touch that folder, and in
> read-only mode (the hosted demo) they return `403` and the mode switcher is hidden. See
> [ARCHITECTURE.md](../ARCHITECTURE.md#my-library). Phase 1 is accurate.
>
> **Note (2026-04-29):** This document reflects an earlier implementation phase. For current behavior (prompt creation flow, My Library removal actions, and skill-pack add/remove + mode filtering), see the 2026-04-29 entry in `docs/CHANGELOG.md` and `docs/features/API.md`.

## ✅ Phase 1 Complete: Foundation & UI Switching

### Implemented Features

#### 1. Library Mode State Management
- Added `libraryMode` state: `'public' | 'my'`
- **Persistence**: Saved to localStorage as `library-mode`
- **URL Integration**: Mode reflected in URL query param (`?library=public` or `?library=my`)
- **Priority**: URL param > localStorage > default ('public')

#### 2. Library Mode Switcher UI
- **Location**: Top of sidebar, below the header, above dropdown menu
- **Design**: Segmented toggle button with two options:
  - **Public Library** - BookOpen icon
  - **My Library** - Library icon
- **Active State**: Selected mode has accent background with glow effect
- **Responsive**: Works on mobile and desktop

#### 3. Data Model Updates

**Frontend (Prompt interface)**:
```typescript
interface Prompt {
  // ... existing fields
  isUserOwned?: boolean; // true if user created or copied this prompt
}
```

**Backend (API response)**:
- Added `isUserOwned` field to each prompt
- Set to `true` for prompts in `My_Prompts` section
- Set to `false` (or undefined) for all public library prompts

#### 4. Filtering by Library Mode

**Public Library Mode**:
- Shows all prompts from all 5 sections
- Total: 903 prompts currently

**My Library Mode**:
- Shows only prompts where `isUserOwned === true`
- Currently: 0 prompts (no My_Prompts directory exists yet)
- Will show prompts user has:
  - Created via "New Prompt" button
  - Copied from Public Library via "Copy to My Library"

#### 5. Conditional Actions (Edit/Delete Buttons)

**Logic**:
```typescript
// Show Edit/Delete only when:
if (libraryMode === 'my' || prompt.isUserOwned) {
  // Show Edit and Delete buttons
}
```

**Behavior**:
- **Public Library**: Edit/Delete hidden for all prompts (unless user somehow has user-owned prompts showing)
- **My Library**: Edit/Delete visible for all prompts (since filter already ensures only user-owned)
- **Favorite button**: Always visible in both modes
- **Copy button**: Always visible in both modes

---

## 🚧 Phase 2: TODO - Data Persistence & Backend Guards

### Remaining Work

#### 1. Backend Authorization Guards
Current state: Edit/Delete API endpoints don't check ownership

**Needed**:
```typescript
// In PUT /api/prompts/:id
if (!prompt.isUserOwned && !isAdmin(user)) {
  return res.status(403).json({ error: "Cannot edit public library prompts" });
}

// In DELETE /api/prompts/:id
if (!prompt.isUserOwned && !isAdmin(user)) {
  return res.status(403).json({ error: "Cannot delete public library prompts" });
}
```

#### 2. Create My_Prompts Directory Structure
- Create `library/My_Prompts/` directory
- Mirror the 5-category structure within My_Prompts:
  - `My_Prompts/Prompt_Library/`
  - `My_Prompts/Agent_Instructions/`
  - `My_Prompts/Agent_Guides/`
  - `My_Prompts/System_Prompts/`
  - `My_Prompts/Skills/`

#### 3. Update Copy to My Library Flow
Current behavior: Copies to `My_Prompts/<category>/<subcategory>/`

**Need to verify**:
- Does it preserve the original section (Prompt_Library, Agent_Guides, etc.)?
- Should copied prompts maintain their section or all go to a single location?

**Recommendation**: 
```
Source: 4_Prompts/Awesome_ChatGPT/General/emoji-translator.md
Target: My_Prompts/Prompt_Library/Awesome_ChatGPT/General/emoji-translator.md
         ^^^^^^^^^ (new top-level section for all user-owned)
```

#### 4. New Prompt Creation
- Should route to `My_Prompts/<activeSection>/` instead of `<activeSection>/`
- Update form to save to correct location

#### 5. Empty State for My Library
When user first switches to "My Library" and has 0 prompts:
- Show helpful empty state
- Message: "Your library is empty. Browse the Public Library and click 'Copy to My Library' to get started."
- Include visual illustration
- Add "Browse Public Library" button

---

## 📊 Current State Summary

### What Works
✅ Library mode switcher in sidebar  
✅ Mode persistence (localStorage + URL)  
✅ Filtering prompts by mode  
✅ Edit/Delete buttons hidden in Public Library  
✅ Backend marks My_Prompts as user-owned  

### What's Needed
❌ Backend permission guards (API enforcement)  
❌ My_Prompts directory structure  
❌ Empty state UI for My Library  
❌ Verify/update "Copy to My Library" flow  
❌ Update "New Prompt" to save to My_Prompts  

---

## 🧪 Testing Performed

### API Response Structure
```bash
# Total prompts
curl -s http://localhost:3010/api/prompts | jq 'length'
# Output: 903

# User-owned prompts
curl -s http://localhost:3010/api/prompts | jq '[.[] | select(.isUserOwned == true)] | length'
# Output: 0 (expected, no My_Prompts directory yet)
```

### UI Behavior
- ✅ Switcher renders correctly
- ✅ Switching modes updates URL and localStorage
- ✅ Refresh maintains selected mode
- ✅ Public Library shows all 903 prompts
- ✅ My Library shows empty (0 prompts)
- ✅ Edit/Delete buttons hidden in Public Library view
- ⚠️  My Library needs empty state UI (currently just shows no prompts)

---

## 🎯 Next Steps

### Immediate Priorities

1. **Add Empty State UI**
   - Component for "No prompts in My Library"
   - Helpful guidance for new users
   - Link back to Public Library

2. **Create My_Prompts Structure**
   ```bash
   mkdir -p library/My_Prompts/{Prompt_Library,Agent_Instructions,Agent_Guides,System_Prompts,Skills}
   ```

3. **Test Copy Flow**
   - Copy a prompt from Public Library
   - Verify it appears in My Library
   - Verify Edit/Delete work on copied prompt

4. **Backend Guards**
   - Add ownership checks to PUT/DELETE endpoints
   - Test unauthorized edit/delete attempts

5. **Documentation**
   - Update README with library mode documentation
   - Add user guide for Public vs My Library

---

## 📝 Implementation Notes

### Design Decisions

**Why URL + localStorage?**
- URL allows sharing specific library mode (e.g., "check out my library")
- localStorage provides user preference persistence
- URL takes precedence for explicit intent

**Why separate My_Prompts top-level section?**
- Clear separation between public catalog and user content
- Easy to implement file-based permissions
- Prevents accidental modification of public prompts
- Simplifies backup/export of user data

**Why show Edit/Delete based on mode + ownership?**
- Defense in depth: UI + backend enforcement
- More flexible for future admin features
- Clearer user experience (actions only when available)

### Code Locations

**Frontend**:
- State: the `libraryMode` `useState` in `src/App.tsx`
- Switcher UI: the Public / My Library buttons in `src/components/Sidebar.tsx`
- Filtering: the `libraryMode` branch in `src/hooks/usePromptFilters.ts`
- Conditional buttons: `src/components/PromptCard.tsx` and `src/components/PromptDetail.tsx`

**Backend**:
- isUserOwned logic: `toApiPrompt` (always `true`) and the public-library handlers (`false`)
  in `api/index.ts`

> Pointers are by symbol, not line number — the line numbers here rotted through two rounds
> of `App.tsx` extraction.

---

## 🐛 Known Issues

1. **No empty state UI** - My Library shows blank when no prompts
2. **Backend lacks guards** - API doesn't enforce ownership checks yet
3. **Copy flow untested** - Need to verify prompts copy correctly to My_Prompts
4. **New prompt flow** - Needs update to save to My_Prompts

---

## ✨ Future Enhancements

- Export My Library as JSON/ZIP
- Import prompts from file
- Share My Library with others (read-only link)
- Organize My Library with custom folders
- Sync My Library across devices
- Admin mode to edit Public Library
