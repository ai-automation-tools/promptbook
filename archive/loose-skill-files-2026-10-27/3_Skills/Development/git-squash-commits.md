---
title: "🔧 Git Squash Commits"
tags: ["skill", "git", "development"]
category: "Skills"
subcategory: "Development"
name: "git-squash"
description: "Skill to squash git commits."
---

# Git Squash Commits

A skill that automates the process of squashing multiple Git commits into a single cohesive commit.


## Prerequisites
- **Required Tool/Service:** Git CLI
- **Environment:** Any system with Git installed

## Usage
Run the skill providing the number of commits to squash.

## Configuration
No specific configuration required.

## Examples
`git rebase -i HEAD~3` (Interactive rebase to squash last 3 commits)

## Advanced Usage
Use `git merge --squash` for squashing an entire feature branch.

## Integration
Useful in local development workflows before opening a Pull Request.

## Troubleshooting
If rebase fails, check for merge conflicts and resolve them manually.

## Best Practices
Write a clear, comprehensive commit message for the final squashed commit.

## Performance Considerations
Execution time is negligible.

## Security & Safety
Only affects local repository until pushed.

## API Reference
Standard Git command line arguments.

## File Structure
Modifies Git history, no new files created.

## References
[Git Documentation - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

## Changelog
1.0.0 - Initial skill creation.

## Contributing
Submit PRs to improve the skill script.

## License
MIT
