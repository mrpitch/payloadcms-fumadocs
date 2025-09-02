# Cursor Rules Development Guide

This guide explains how to systematically generate and maintain Cursor rules for the PayloadCMS + Fumadocs project, based on the [PageAI Cursor Rules Tutorial](https://pageai.pro/blog/cursor-rules-tutorial).

## Overview

Cursor rules are AI-powered coding guidelines that help maintain consistency and best practices across your codebase. Instead of manually writing rules, this guide shows you how to automatically generate them using AI analysis of your project files.

## Foundational Rules Setup

Before generating specific rules, you need two foundational rules that enable the system to work properly.

### 1. Cursor Rules Meta-Rule

Create `.cursor/rules/cursor-rules.mdc`:

```markdown
---
description: How to add or edit Cursor rules in our project
globs:
alwaysApply: false
---
# Cursor Rules Location

How to add new cursor rules to the project

1. Always place rule files in PROJECT_ROOT/.cursor/rules/:
    ```
    .cursor/rules/
    ├── your-rule-name.mdc
    ├── another-rule.mdc
    └── ...
    ```

2. Follow the naming convention:
    - Use kebab-case for filenames
    - Always use .mdc extension
    - Make names descriptive of the rule's purpose

3. Directory structure:
    ```
    PROJECT_ROOT/
    ├── .cursor/
    │   └── rules/
    │       ├── your-rule-name.mdc
    │       └── ...
    └── ...
    ```

4. Never place rule files:
    - In the project root
    - In subdirectories outside .cursor/rules
    - In any other location

5. Cursor rules have the following structure:

```
---
description: Short description of the rule's purpose
globs: optional/path/pattern/**/*
alwaysApply: false
---
# Rule Title

Main content explaining the rule with markdown formatting.

1. Step-by-step instructions
2. Code examples
3. Guidelines

Example:

```typescript
// Good example
function goodExample() {
  // Implementation following guidelines
}

// Bad example
function badExample() {
  // Implementation not following guidelines
}
```
```

### 2. Self-Improvement Rule

Create `.cursor/rules/self-improvement.mdc`:

```markdown
---
description: Guidelines for continuously improving Cursor rules based on emerging code patterns and best practices.
globs: **/*
alwaysApply: true
---
## Rule Improvement Triggers

- New code patterns not covered by existing rules
- Repeated similar implementations across files
- Common error patterns that could be prevented
- New libraries or tools being used consistently
- Emerging best practices in the codebase

# Analysis Process:
- Compare new code with existing rules
- Identify patterns that should be standardized
- Look for references to external documentation
- Check for consistent error handling patterns
- Monitor test patterns and coverage

# Rule Updates:

- **Add New Rules When:**
  - A new technology/pattern is used in 3+ files
  - Common bugs could be prevented by a rule
  - Code reviews repeatedly mention the same feedback
  - New security or performance patterns emerge

- **Modify Existing Rules When:**
  - Better examples exist in the codebase
  - Additional edge cases are discovered
  - Related rules have been updated
  - Implementation details have changed

- **Example Pattern Recognition:**

  ```typescript
  // If you see repeated patterns like:
  const data = await prisma.user.findMany({
    select: { id: true, email: true },
    where: { status: 'ACTIVE' }
  });

  // Consider adding to [prisma.mdc](mdc:shipixen/.cursor/rules/prisma.mdc):
  // - Standard select fields
  // - Common where conditions
  // - Performance optimization patterns
  ```

- **Rule Quality Checks:**
- Rules should be actionable and specific
- Examples should come from actual code
- References should be up to date
- Patterns should be consistently enforced

## Continuous Improvement:

- Monitor code review comments
- Track common development questions
- Update rules after major refactors
- Add links to relevant documentation
- Cross-reference related rules

## Rule Deprecation

- Mark outdated patterns as deprecated
- Remove rules that no longer apply
- Update references to deprecated rules
- Document migration paths for old patterns

## Documentation Updates:

- Keep examples synchronized with code
- Update references to external docs
- Maintain links between related rules
- Document breaking changes

Follow [cursor-rules.mdc](mdc:.cursor/rules/cursor-rules.mdc) for proper rule formatting and structure.
```

## Core Generation Prompts

### 1. Project Structure Analysis

**Prompt:**
```
@cursor-rules.mdc List all source files and folders in the project,
and create a new cursor rule outlining the directory structure and important files and folders.
```

**Purpose:** Creates a comprehensive overview of your project structure, helping AI understand the codebase organization and preventing duplicate file listings in future conversations.

**Output:** A rule file like `.cursor/rules/project-structure.mdc` that documents:
- Root directory structure
- Source code organization
- Important configuration files
- Key development patterns

### 2. Technology Stack Documentation

**Prompt:**
```
@cursor-rules.mdc @package.json Analyze all major dependencies
and create a cursor rule outlining the stack of the application
and the versions I'm using, and any remarks on best practices on those versions.
```

**Purpose:** Documents your application's technology stack, dependency versions, and best practices, ensuring consistent technology usage across the project.

**Output:** A rule file like `.cursor/rules/application-stack.mdc` that covers:
- Core dependencies and versions
- Technology stack overview
- Best practices and recommendations
- Update strategies

### 3. Component Pattern Analysis

**Prompt:**
```
@cursor-rules.mdc @components/ui/button.tsx
/Generate Cursor Rules
I want to generate a cursor rule for this React component. Please analyze it carefully and outline all of the conventions found. Output as one rule file only.
```

**Purpose:** Analyzes specific component files to extract coding conventions, patterns, and best practices that can be applied to similar components.

**Output:** A rule file like `.cursor/rules/react-component-conventions.mdc` that documents:
- Component architecture patterns
- TypeScript conventions
- Styling approaches
- Accessibility patterns

## Advanced Generation Techniques

### 4. Framework-Specific Rules

**Prompt:**
```
@cursor-rules.mdc @components/ui/tabs.tsx
/Generate Cursor Rules
I want to generate a cursor rule for this Radix UI component. Please analyze it carefully and outline all of the conventions found. Output as one rule file only.
```

**Purpose:** Creates framework-specific rules (e.g., Radix UI, shadcn/ui) that document patterns specific to those libraries.

### 5. Integration Pattern Rules

**Prompt:**
```
@cursor-rules.mdc @lib/fumadocs/source.ts
/Generate Cursor Rules
I want to generate a cursor rule for this integration service. Please analyze it carefully and outline all of the conventions found. Output as one rule file only.
```

**Purpose:** Documents integration patterns between different technologies or services in your project.

## Generic Prompt Template

For any file type, use this template:

```
@cursor-rules.mdc @path/to/your/file.ts
/Generate Cursor Rules
I want to generate a cursor rule for this [file type/component/service]. Please analyze it carefully and outline all of the conventions found. Output as one rule file only.
```

**Customization options:**

1. **Focus on specific aspects:**
   ```
   Please focus on the error handling patterns
   Please extract the TypeScript conventions
   Please identify the testing patterns
   Please look at the styling approach
   ```

2. **Reference existing rules:**
   ```
   @cursor-rules.mdc @existing-rule.mdc @your-file.ts
   /Generate Cursor Rules
   Please analyze this file and create a rule that follows the same format as the existing rule.
   ```

3. **Cross-reference patterns:**
   ```
   @cursor-rules.mdc @file1.ts @file2.ts
   /Generate Cursor Rules
   Please analyze both files and create a rule that identifies the common patterns between them.
   ```

## Rule Organization Strategy

### For Small Projects
```
.cursor/rules/
├── cursor-rules.mdc
├── self-improvement.mdc
├── project-structure.mdc
├── application-stack.mdc
└── component-conventions.mdc
```

### For Large Projects/Monorepos
```
.cursor/rules/
├── foundational/
│   ├── cursor-rules.mdc
│   ├── self-improvement.mdc
│   └── project-structure.mdc
├── frontend/
│   ├── react-components.mdc
│   ├── styling-conventions.mdc
│   └── ui-patterns.mdc
├── backend/
│   ├── api-conventions.mdc
│   ├── database-patterns.mdc
│   └── service-architecture.mdc
└── integration/
    ├── fumadocs-integration.mdc
    └── payloadcms-patterns.mdc
```

## Best Practices for Rule Generation

### 1. Use Your Best Code as Examples
- Always use well-written, production-ready files
- Avoid using files with known issues or anti-patterns
- The AI will extract patterns and write them better than you can

### 2. Focus on Recurring Patterns
- Don't create rules for one-off implementations
- Look for patterns that appear in 3+ files
- Focus on common sources of bugs or confusion

### 3. Keep Rules Actionable
- Rules should be specific enough to follow
- Include both good and bad examples
- Provide clear guidelines, not just descriptions

### 4. Reference External Documentation
- Link to official documentation when relevant
- Include version information for libraries
- Reference related rules within your project

## Common Mistakes to Avoid

### 1. Over-Generating Rules
- Don't create a rule for every single file
- Focus on patterns that repeat across multiple files
- Quality over quantity

### 2. Rules That Are Too Specific
- Avoid rules that only apply to one file
- Rules should be general enough to apply to similar situations
- Focus on transferable patterns

### 3. Forgetting to Update Rules
- Rules become outdated as your codebase evolves
- Use the self-improvement rule to identify when updates are needed
- Keep examples synchronized with current code

## Scaling to Large Codebases

### 1. Domain-Specific Rules
Group rules by domain (frontend, backend, integration) and use glob patterns to auto-attach them:

```markdown
---
description: Frontend component conventions
globs: src/components/**/*.tsx
alwaysApply: false
---
```

### 2. Team Collaboration
- Share rules with team members working on the same codebase
- Rules serve as living documentation of team coding standards
- Use version control to track rule evolution

### 3. Continuous Improvement
- Monitor code review comments for new patterns
- Track common development questions
- Update rules after major refactors

## FAQ

### How many rules should I have?
Start with 5-10 core rules covering your main patterns. You can always add more as your project grows. Quality over quantity.

### Should I commit rules to Git?
Absolutely! Cursor rules are part of your project's development infrastructure. Treat them like any other configuration file.

### Can I use this approach with other AI coding tools?
The specific `/Generate Cursor Rules` command is Cursor-specific, but the generated rules should work everywhere. You can copy and paste them into your favorite AI coding tool.

### How often should I update rules?
- Monthly: Check for security updates and new patterns
- Quarterly: Review major version updates
- Immediately: When critical bugs or patterns are discovered

## Conclusion

This systematic approach to generating Cursor rules eliminates the need for manual writing while ensuring your rules are:
- Based on actual code patterns
- Project-specific and relevant
- Easy to maintain and update
- Scalable as your project grows

By following this guide, you'll have a robust set of Cursor rules that improve your AI coding experience and maintain code quality across your team.

## References

- [PageAI Cursor Rules Tutorial](https://pageai.pro/blog/cursor-rules-tutorial) - Original tutorial
- [Cursor Documentation](https://cursor.sh/docs) - Official Cursor documentation
- [PayloadCMS Documentation](https://payloadcms.com/docs) - CMS documentation
- [Fumadocs Documentation](https://fumadocs.dev) - Documentation framework docs
