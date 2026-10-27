---
title: "📌 Prompt: Configuration Validation Script Generation"
tags:
- collections
- engineering
- configuration
- validation
- script
- generation
category: Collections
subcategory: Engineering
---

# Prompt: Configuration Validation Script Generation

## Description
This prompt generates a Python script to validate a configuration file in TOML format. The script checks for the presence of required sections and keys, and also validates the data types of the values.

## Libraries
* `toml`

## Template

```python
import toml

def validate_config(config_path):
    """
    Validates a TOML configuration file against a predefined schema.

    Args:
        config_path (str): The path to the configuration file.

    Returns:
        bool: True if the configuration is valid, False otherwise.
    """
    try:
        with open(config_path, 'r') as f:
            config = toml.load(f)
    except FileNotFoundError:
        print(f"Error: Configuration file not found at {config_path}")
        return False
    except toml.TomlDecodeError as e:
        print(f"Error decoding TOML file: {e}")
        return False

    # Define the expected schema
    schema = {
        "database": {
            "server": str,
            "ports": list,
            "connection_max": int,
            "enabled": bool,
            "data": list,
        },
        "owner": {
            "name": str,
            "dob": str,
        }
    }

    # Validate the configuration
    for section, keys in schema.items():
        if section not in config:
            print(f"Error: Missing section '{section}' in configuration.")
            return False
        for key, value_type in keys.items():
            if key not in config[section]:
                print(f"Error: Missing key '{key}' in section '{section}'.")
                return False
            if not isinstance(config[section][key], value_type):
                print(f"Error: Invalid type for key '{key}' in section '{section}'. Expected {value_type}.")
                return False

    print("Configuration is valid.")
    return True

if __name__ == "__main__":
    # Create a dummy config file for testing
    dummy_config = {
        "database": {
            "server": "192.168.1.1",
            "ports": [8001, 8001, 8002],
            "connection_max": 5000,
            "enabled": True,
            "data": [["gamma", "delta"], [1, 2]],
        },
        "owner": {
            "name": "Tom Preston-Werner",
            "dob": "1979-05-27T07:32:00-08:00",
        }
    }
    with open("config.toml", "w") as f:
        toml.dump(dummy_config, f)

    validate_config("config.toml")
```
