---
title: "📌 Bash Script"
tags: ["it", "development", "bash", "script", "generator"]
category: "IT"
subcategory: "Development"
---
# Bash Script Generator

Generate robust, production-ready Bash scripts with error handling, logging, and best practices.

## Requirements

### Script Structure
```bash
#!/bin/bash
# Script description
# Usage: script.sh [options]

set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${LOG_FILE:-/tmp/script_$(date +%Y%m%d_%H%M%S).log}"

# Functions
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

error() {
    log "ERROR: $*" >&2
    exit 1
}

# Main logic
main() {
    log "Starting script..."
    # Your code here
    log "Script completed successfully"
}

# Execute
main "$@"
```

### Features to Include
- Argument parsing with defaults
- Help/usage message
- Error handling and cleanup
- Logging (stdout + file)
- Progress indicators
- Dry run mode
- Configuration file support
- Exit codes

### Best Practices
- Use `shellcheck` for linting
- Quote all variables
- Use `[[ ]]` for tests
- Prefer `$(command)` over backticks
- Use functions for reusability
- Add timeout for long-running commands
- Implement retry logic where appropriate

## Common Patterns

### Argument Parsing
```bash
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done
```

### File Processing
```bash
while IFS= read -r line; do
    process_line "$line"
done < "$INPUT_FILE"
```

### Parallel Execution
```bash
for item in "${items[@]}"; do
    process_item "$item" &
done
wait  # Wait for all background jobs
```

### JSON Processing
```bash
# Read JSON with jq
VALUE=$(jq -r '.key' config.json)

# Iterate over array
jq -r '.items[]' data.json | while read -r item; do
    echo "Processing: $item"
done
```

## Use Cases
- Automation scripts
- Data processing pipelines
- System administration tasks
- CI/CD workflows
- Backup and maintenance scripts

---

*Based on: Various automation scripts in OpenClaw projects*
