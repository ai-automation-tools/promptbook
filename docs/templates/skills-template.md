---
title: "🔧 [Skill Name]"
tags: ["skill", "skill-type", "domain"]
category: "Skills"
subcategory: "[Category_Name]"  # e.g., Git, Docker, Cloud
name: [skill-name-lowercase]
description: "[One-sentence description of what this skill does and when to use it]. Use when: (1) [use case 1], (2) [use case 2], (3) [use case 3]. NOT for: [anti-patterns or when not to use]."
upstream:                 # REQUIRED since 2026-10-23: CI fails a skill with no GitHub source
  match: exact
  repo: [owner/repo]
  path: [path/to/skill/SKILL.md]
  ref: [full commit sha you copied from]
  checked: [YYYY-MM-DD]
---

# [Skill Name/Title]

[Opening paragraph describing what this skill does, its purpose, and core capabilities. Be specific about the problem it solves.]

## Prerequisites

[List requirements, dependencies, tools, or setup needed before using this skill]

- **Required Tool/Service:** [Tool name] - [Why it's needed]
- **Authentication:** [Auth requirements if any]
- **Permissions:** [Required permissions or access levels]
- **Environment:** [OS, runtime, or environment requirements]

### Setup Instructions

1. [Setup step 1]
2. [Setup step 2]
3. [Setup step 3]

**Verification:**
```bash
[Command to verify setup is correct]
```

Expected output:
```
[What successful verification looks like]
```

## Usage

### Basic Usage

[Describe the standard way to invoke and use this skill]

```bash
[Command or invocation example]
```

**What it does:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

### Common Workflows

#### Workflow 1: [Workflow Name]

[When to use this workflow]

**Steps:**
1. [Step 1 with command if applicable]
   ```bash
   [command]
   ```
2. [Step 2 with command if applicable]
   ```bash
   [command]
   ```
3. [Step 3 with command if applicable]

**Expected Outcome:**
[What should happen]

#### Workflow 2: [Workflow Name]

[When to use this workflow]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Configuration

### Required Configuration

[Explain any configuration files, environment variables, or settings]

**Config File Location:** `[path/to/config]`

```json
{
  "setting1": "value1",
  "setting2": "value2",
  "setting3": {
    "nested": "value"
  }
}
```

**Environment Variables:**
```bash
export VARIABLE_NAME="value"
export ANOTHER_VAR="value"
```

### Optional Configuration

[Additional settings that can enhance functionality]

| Setting | Default | Description |
|---------|---------|-------------|
| `setting1` | `default_value` | [What it does] |
| `setting2` | `default_value` | [What it does] |

## Examples

### Example 1: [Scenario Name]

**Context:** [Describe the situation]

**Task:** [What needs to be accomplished]

**Commands:**
```bash
[command 1]
[command 2]
[command 3]
```

**Output:**
```
[Expected output]
```

**Explanation:**
[Break down what happened and why]

### Example 2: [Scenario Name]

**Context:** [Describe the situation]

**Task:** [What needs to be accomplished]

**Commands:**
```bash
[command sequence]
```

**Result:**
[What was achieved]

## Advanced Usage

### [Advanced Feature 1]

[When and why to use this advanced feature]

```bash
[Advanced command example]
```

**Options:**
- `--option1`: [Description]
- `--option2`: [Description]
- `--option3`: [Description]

### [Advanced Feature 2]

[Description of advanced capability]

**Implementation:**
```bash
[Code or command example]
```

## Integration

### With Other Skills

[How this skill works with other skills]

- **[Skill Name]**: [Integration details and use case]
- **[Skill Name]**: [Integration details and use case]

### With External Tools

[How this skill integrates with external tools/services]

- **[Tool Name]**: [Integration details]
  ```bash
  [Integration command example]
  ```

## Troubleshooting

### Common Issues

#### Issue 1: [Problem Description]

**Symptoms:**
- [Symptom 1]
- [Symptom 2]

**Cause:**
[Why this happens]

**Solution:**
```bash
[Fix command or steps]
```

#### Issue 2: [Problem Description]

**Symptoms:**
- [Symptom 1]
- [Symptom 2]

**Cause:**
[Why this happens]

**Solution:**
1. [Fix step 1]
2. [Fix step 2]
3. [Fix step 3]

### Debugging

**Enable verbose logging:**
```bash
[Command with debug flags]
```

**Check logs:**
```bash
tail -f ~/.openclaw/[skill-name].log
```

**Verify configuration:**
```bash
[Verification command]
```

## Best Practices

### Do's ✅

- [Best practice 1]
- [Best practice 2]
- [Best practice 3]
- [Best practice 4]

### Don'ts ❌

- [Anti-pattern 1]
- [Anti-pattern 2]
- [Anti-pattern 3]
- [Anti-pattern 4]

## Performance Considerations

### Optimization Tips

1. **[Tip 1]**: [Description]
   ```bash
   [Example]
   ```

2. **[Tip 2]**: [Description]
   ```bash
   [Example]
   ```

### Resource Usage

- **CPU:** [Expected CPU usage or impact]
- **Memory:** [Expected memory usage]
- **Network:** [Network requirements if any]
- **Disk:** [Disk space or I/O requirements]

## Security & Safety

### Permissions Required

[List permissions this skill needs and why]

- [Permission 1]: [Why it's needed]
- [Permission 2]: [Why it's needed]

### Safety Considerations

⚠️ **Important Warnings:**
- [Warning 1]
- [Warning 2]
- [Warning 3]

### Data Handling

[How this skill handles sensitive data]

- [Data type 1]: [How it's handled]
- [Data type 2]: [How it's handled]

## API Reference

### Functions

#### `functionName(param1, param2)`

**Description:** [What this function does]

**Parameters:**
- `param1` (type): [Description]
- `param2` (type): [Description]

**Returns:**
- (type): [Description of return value]

**Example:**
```javascript
const result = functionName(value1, value2);
```

### Hooks

[If the skill uses hooks, document them]

#### PostToolUse Hook

**Matcher:** `[ToolName]`

**Action:** [What the hook does]

**Configuration:**
```yaml
PostToolUse:
  - matcher: "[ToolName]"
    hooks:
      - type: command
        command: "[command]"
```

## File Structure

[If the skill involves multiple files or a directory structure]

```
[skill-name]/
├── SKILL.md              # This file
├── scripts/
│   ├── script1.sh        # [Description]
│   └── script2.py        # [Description]
├── config/
│   └── default.json      # [Description]
└── references/
    └── docs.md           # [Description]
```

## References

### Documentation
- [Official docs link]
- [API reference link]
- [Tutorial link]

### Related Skills
- [Related skill 1](../skill-1/SKILL.md)
- [Related skill 2](../skill-2/SKILL.md)

### External Resources
- [Resource 1]
- [Resource 2]

## Changelog

### Version [X.Y.Z] - [Date]
- [Change 1]
- [Change 2]
- [Change 3]

### Version [X.Y.Z] - [Date]
- [Change 1]
- [Change 2]

## Contributing

[Guidelines for contributing to or improving this skill]

1. [Contribution guideline 1]
2. [Contribution guideline 2]
3. [Contribution guideline 3]

## License

[License information if applicable]

---

**Note:** Replace all [bracketed placeholders] with your specific content. Remember to:
- Use lowercase with hyphens for skill name (e.g., `gh-address-comments`)
- Include 🔧 emoji or appropriate icon in the name field
- Write a clear one-sentence description with use cases and anti-patterns
- Document prerequisites, setup, and verification steps
- Include concrete examples with actual commands and expected output
- Add troubleshooting section for common issues
- Document all configuration options and environment variables
- Specify required permissions and safety considerations
- Include hooks configuration if the skill uses them
- Keep examples practical and copy-pasteable
- Structure sections logically from basic to advanced usage
- Use code blocks with proper syntax highlighting
- Include file structure if the skill has multiple files
- Add references to related skills and external resources
