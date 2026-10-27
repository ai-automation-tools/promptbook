---
title: "📝 [Product or Model] — [date or version]"
tags: ["system-prompt", "[vendor]", "[product]"]
category: "LLM Instructions"
subcategory: "[Vendor]"  # the folder under 5_System_Prompts/, e.g. Anthropic, OpenAI, Cursor
upstream:
  match: exact            # exact | similar (our copy trims or reformats a little)
  repo: [owner/repo]      # the GitHub collection or vendor repo it was copied from
  path: [path/in/repo.md]
  ref: [full commit sha]  # the commit you read
  checked: [YYYY-MM-DD]
# A prompt the vendor publishes only on its own docs page (Anthropic's release notes) uses
# instead:
#   upstream:
#     match: vendor
#     url: https://docs.anthropic.com/en/release-notes/system-prompts#...
#     checked: YYYY-MM-DD
---

<!-- 5_System_Prompts is an archive of real system prompts, copied verbatim from a source you
     can link. Never write or reconstruct one: since 2026-10-23 a file without a GitHub repo
     (or a vendor page) fails CI (scripts/upstream.test.mjs), and 63 invented prompts were
     removed for that reason. One capture per file; a newer version is a new file. -->

[The system prompt, exactly as the source has it. Keep its own formatting, XML tags and
placeholders such as {} or {{date}}; don't add headings or commentary inside it.]
