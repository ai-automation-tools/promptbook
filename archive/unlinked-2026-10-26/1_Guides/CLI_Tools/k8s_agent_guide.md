---
title: "💻 k8s-agent Guide"
tags: ["agent-guides", "k8s", "cli"]
category: "Agent_Guides"
subcategory: "Kubernetes"
---

# k8s-agent Guide

## Overview
k8s-agent is a CLI tool for interacting with Kubernetes clusters using natural language.

## Agent Configuration
### Basic Settings
- **Agent Name:** k8s-agent
- **Model:** gpt-4
### Tools & Permissions
- Tool 1: kubectl (Read/Write)
- Tool 2: helm (Read/Write)

## System Prompt
### Core Principles
- Secure by default
### Capabilities
- Deploy workloads
### Constraints
- DO NOT execute destructive commands without confirmation
### Response Format
- Provide kubectl commands
### Error Handling
When encountering ambiguous requests, ask for clarification.

## Workflow
### Initialization
1. Verify kubeconfig
### Standard Operating Procedure
#### Phase 1: Reconnaissance
- List namespaces
#### Phase 2: Action
- Generate manifest
#### Phase 3: Verification
- Verify status
### Decision Trees
- Action: Use kubectl apply

## Example Interactions
### Example 1: Deploying a Pod
### Example 2: Troubleshooting

## Best Practices
### For Users
- Use namespaces
### For Developers
- Keep manifests modular

## Customization Options
### Variables
- `KUBECONFIG`: Path to config file
### Extend Functionality
- Add custom tools

## Troubleshooting
### Common Issues
- Connection refused

## Integration
### With Other Agents
- GitOps Agent
### With External Tools
- Helm

## Version History
- v1.0

## References
- Kubernetes Documentation
