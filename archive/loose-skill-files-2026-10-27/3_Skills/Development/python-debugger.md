---
title: "Python Debugger Skill"
tags: ["python", "debug", "development"]
category: "Skills"
subcategory: "Development"
---

# Python Debugger Skill

## Prerequisites
A working Python 3.8+ environment.

## Usage
Use this skill to systematically identify, trace, and fix logical and runtime errors within Python scripts and applications.

## Configuration
Ensure your environment has the `pytest` testing framework installed if you intend to run test-driven debugging.

## Examples
Run a script with the built-in debugger:
`python -m pdb myscript.py`
To set a breakpoint in code:
`import pdb; pdb.set_trace()`

## Advanced Usage
For more complex applications, use `ipdb` for interactive debugging with syntax highlighting, or integrate with IDE visual debuggers like the one in VS Code.

## Integration
Integrates natively with major IDEs (VS Code, PyCharm) and works alongside CI/CD pipelines when debugging failing test suites.

## Troubleshooting
If the debugger skips breakpoints, ensure you are not running the script in optimized mode (`python -O`).

## Best Practices
- Write a failing unit test that isolates the bug before attempting to fix it.
- Use variable watching to track state changes over time.

## Performance Considerations
- Debugging overhead is significant. Never leave `pdb.set_trace()` calls in production code.

## Security & Safety
- Be cautious when debugging in live environments; do not accidentally expose or log sensitive user data or environment variables.

## API Reference
This skill relies on the standard library `pdb` module.

## File Structure
This skill consists of a single markdown guide.

## References
- https://docs.python.org/3/library/pdb.html
- Python Debugging Techniques Guide

## Changelog
- v1.0.0: Initial documentation of the Python Debugging Skill.

## Contributing
Submit pull requests with new debugging tips or advanced techniques to the repository.

## License
MIT License
