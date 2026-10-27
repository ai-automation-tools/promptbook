---
title: "♿ Accessibility Compliance"
tags: ["skill","design","accessibility-compliance"]
name: "accessibility-compliance"
description: Implement WCAG 2.2 compliant interfaces with screen reader support, keyboard navigation, focus management, and mobile accessibility patterns. Use when auditing accessibility or fixing a11y issues in UI work.
source: https://skillsmp.com/skills/wshobson-agents-plugins-ui-design-skills-accessibility-compliance-skill-md
author: wshobson
repository: https://github.com/wshobson/agents
stars: 33181
forks: 3609
updated: 2026-03-07
upstream:
  match: exact
  repo: wshobson/agents
  path: plugins/ui-design/skills/accessibility-compliance/SKILL.md
  declared: "https://skillsmp.com/skills/wshobson-agents-plugins-ui-design-skills-accessibility-compliance-skill-md"
  ref: a30778f8c4e6b0a87567941b7cca4f534bf642b6
  checked: 2026-09-08
---

# Accessibility Compliance

Master accessibility implementation to create inclusive experiences that work for everyone, including users with disabilities.

## When to Use This Skill

- Implementing WCAG 2.2 Level AA or AAA compliance
- Building screen reader accessible interfaces
- Adding keyboard navigation to interactive components
- Implementing focus management and focus trapping
- Creating accessible forms with proper labeling
- Supporting reduced motion and high contrast preferences
- Building mobile accessibility features (iOS VoiceOver, Android TalkBack)
- Conducting accessibility audits and fixing violations

## Detailed patterns and worked examples

Detailed pattern documentation lives in `references/details.md`. Read that file when the navigation tier above is insufficient.

## Best Practices

1. **Use Semantic HTML**: Prefer native elements over ARIA when possible
2. **Test with Real Users**: Include people with disabilities in user testing
3. **Keyboard First**: Design interactions to work without a mouse
4. **Don't Disable Focus Styles**: Style them, don't remove them
5. **Provide Text Alternatives**: All non-text content needs descriptions
6. **Support Zoom**: Content should work at 200% zoom
7. **Announce Changes**: Use live regions for dynamic content
8. **Respect Preferences**: Honor prefers-reduced-motion and prefers-contrast

## Common Issues

- **Missing alt text**: Images without descriptions
- **Poor color contrast**: Text hard to read against background
- **Keyboard traps**: Focus stuck in component
- **Missing labels**: Form inputs without associated labels
- **Auto-playing media**: Content that plays without user initiation
- **Inaccessible custom controls**: Recreating native functionality poorly
- **Missing skip links**: No way to bypass repetitive content
- **Focus order issues**: Tab order doesn't match visual order

## Testing Tools

- **Automated**: axe DevTools, WAVE, Lighthouse
- **Manual**: VoiceOver (macOS/iOS), NVDA/JAWS (Windows), TalkBack (Android)
- **Simulators**: NoCoffee (vision), Silktide (various disabilities)
