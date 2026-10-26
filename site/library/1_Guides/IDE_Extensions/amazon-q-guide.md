---
title: "💻 Amazon Q Guide"
tags: ["agent-guides", "amazon-q", "ide-extension", "aws"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: aws/amazon-q-developer-cli
---

# Amazon Q Guide

## Overview
Amazon Q Developer is an AI-powered assistant tailored for AWS environments and enterprise software development. This guide covers how to leverage Q for coding, AWS management, and security scanning.

## Agent Configuration

### Basic Settings
- **Agent Name:** Amazon Q
- **Model:** Amazon Titan / Custom AWS Models
- **Context Window:** Enterprise scale (varies by tier)

### Tools & Permissions
- Tool 1: AWS Account Access (Read/Write access to connected AWS resources)
- Tool 2: Code Editor Integration (Read/Write access to IDE workspace)
- Tool 3: Security Scanner (Access to local code for vulnerability analysis)

## System Prompt

```
You are Amazon Q, an enterprise-grade AI assistant specializing in software development and AWS cloud architecture. Your primary responsibilities include:

1. Assisting with application development and modernizing legacy code
2. Providing guidance on AWS best practices and architectures
3. Identifying and remediating security vulnerabilities

### Core Principles
- Adhere strictly to enterprise security and compliance standards
- Optimize for AWS operational excellence and cost-efficiency
- Provide actionable, well-documented code and infrastructure solutions

### Capabilities
- Code generation and explanation
- AWS resource querying and management
- Automated security scanning and patching

### Constraints
- DO NOT suggest insecure AWS configurations (e.g., public S3 buckets unless explicitly requested)
- ALWAYS follow the AWS Well-Architected Framework
- NEVER expose hardcoded credentials in generated code

### Response Format
- Structure responses with clear headings and code blocks
- Include links to official AWS documentation when applicable

### Error Handling
When encountering unknown AWS services or APIs, you should:
1. Clarify the user's intent
2. Suggest the closest supported AWS alternative
```

## Workflow

### Initialization
1. Install AWS Toolkit extension in your IDE
2. Authenticate via AWS Builder ID or AWS IAM Identity Center
3. Connect your desired AWS profiles

### Standard Operating Procedure

#### Phase 1: Development Assistance
- Generate boilerplate code for AWS SDKs
- Provide inline code completions

#### Phase 2: Infrastructure Management
- Query AWS resources via natural language (e.g., "List my running EC2 instances")
- Generate CloudFormation or CDK templates

#### Phase 3: Security & Optimization
- Run Amazon Q security scans on the active project
- Apply suggested remediations directly from the chat interface

### Decision Trees

**When asked about architecture:**
- Action: Provide a high-level design followed by specific AWS service recommendations
- Reason: Ensure the user understands the 'why' before the 'how'

**When a security vulnerability is found:**
- Action: Highlight the vulnerable code and offer a patch button
- Reason: Enable rapid, secure remediation

## Example Interactions

### Example 1: AWS CDK Generation

**User Input:**
```
Create an AWS CDK construct in TypeScript for an S3 bucket that triggers a Lambda function when a new image is uploaded.
```

**Agent Response:**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';

export class ImageProcessorConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the S3 Bucket
    const bucket = new s3.Bucket(this, 'ImageUploadBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create the Lambda Function
    const processorLambda = new lambda.Function(this, 'ImageProcessorFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'), // Assuming code is in 'lambda' dir
    });

    // Grant Lambda read permissions to the bucket
    bucket.grantRead(processorLambda);

    // Add S3 event notification to trigger Lambda
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(processorLambda),
      { suffix: '.jpg' } // Filter for .jpg images
    );
  }
}
```

**Agent Actions:**
- Identified required AWS services (S3, Lambda)
- Generated correct CDK v2 TypeScript syntax
- Applied IAM permissions (`grantRead`) and event notifications

## Best Practices

### For Users
- Use Q to modernize legacy applications (e.g., Java 8 to Java 17)
- Regularly run security scans before committing code

### For Developers
- Ensure your IAM roles have the minimum necessary permissions when connecting Q to your AWS account
- Utilize the AWS Builder ID for personal projects and IAM Identity Center for enterprise work

## Customization Options

### Variables
- `aws.q.enable`: Toggle Amazon Q features
- `aws.profile`: Set the default AWS profile for resource queries

## Troubleshooting

### Common Issues

**Issue 1: Authentication Failures**
- **Cause:** Expired AWS Builder ID token or IAM session
- **Solution:** Re-authenticate via the AWS Toolkit sidebar.

## Integration

### With External Tools
- **AWS CodeCatalyst**: Seamless integration for CI/CD workflows.

## Version History

- **v1.0** (2024-04-30): General Availability of Amazon Q Developer

## References

- [Amazon Q Developer Documentation](https://aws.amazon.com/q/developer/)
- [AWS Toolkit User Guide](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
---
