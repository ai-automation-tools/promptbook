---
title: "📌 Analytic Rubric Builder"
tags: ["education", "rubric", "assessment", "grading", "K-12"]
category: "Education"
subcategory: "K12"
---

# Analytic Rubric Builder

## Purpose
Build an analytic rubric whose performance levels describe observable differences in work, not adverbs like "somewhat" and "consistently" stacked on the same sentence.

## Instructions
Act as an assessment designer. Build a rubric for the task below.

Inputs:
- **Assignment:** [what students produce]
- **Grade level and subject:** [text]
- **Standards or objectives assessed:** [list]
- **Number of performance levels:** [default: 4]
- **Point total or weighting:** [if graded]

Rules:
- One criterion per learning objective. If two objectives collapse into one row, the rubric cannot diagnose which one a student missed.
- Each performance level must name a different observable feature of the work. Writing the top level and then adding qualifiers downward produces a rubric that only measures the grader's mood.
- Separate the content criteria from the conventions criteria so a strong idea in weak prose does not disappear.
- Keep the language student-facing — students should be able to self-assess with it before submitting.

Flag any criterion that cannot be judged from the artifact alone, and any that measures compliance (length, formatting) rather than learning.

## Output Format
- Rubric table: criterion by performance level
- Student-facing self-check version
- Flags: unobservable or compliance-only criteria

## Related Prompts
- [Assessment Design Tool](../Curriculum/assessment-design-tool.md)
- [Differentiated Instruction Planner](./differentiated-instruction-planner.md)

## Reputable Sources
- Association for Supervision and Curriculum Development: https://www.ascd.org/
- Edutopia assessment resources: https://www.edutopia.org/
