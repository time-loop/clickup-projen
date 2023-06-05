# Renovate at ClickUp

By default our TypeScript repos have Renovate enabled to manage dependencies.
This document describes the default configuration and some common use patterns.

## Default Configuration

WRITEME

## Enabling AutoMerge for Updates

In your `.projenrc.ts` add the following:

```ts
  // Writeme
```

## Pinning Problem Libraries

You may only pin libraries if you have created a task
to address the issue in the future.

- Your PR to pin MUST reference the task.
- Your pinning code MUST include a link to the task.
- Your squad SHOULD have a plan to address the
  associated tech debt in the next quarter.

Example
[task](https://staging.clickup.com/t/333/CLK-211432),
[pr](https://github.com/time-loop/click/pull/89),
[comment](https://github.com/time-loop/click/pull/89/files#diff-bda22a3de7550efc76dd29e2a427a8d5abd5863f6e96a339ff47390d9bed7d14R42)

Example code from `.projenrc.ts` in the PR.

```ts
  renovatebotOptions: {
    // See https://staging.clickup.com/t/333/CLK-211432
    // tl;dr: we get the following error when we touch the oclif libs.
    //
    // 👾 build » compile | tsc --build
    // Error: node_modules/@oclif/parser/lib/index.d.ts(16,35): error TS2344: Type 'TFlags' does not satisfy the constraint 'Output'.
    // Error: node_modules/@oclif/parser/lib/index.d.ts(16,52): error TS2344: Type 'TFlags' does not satisfy the constraint 'OutputFlags<any>'.
    // Error: node_modules/@oclif/command/lib/command.d.ts(70,31): error TS2344: Type 'F' does not satisfy the constraint 'Output'.
    // Error: node_modules/@oclif/command/lib/command.d.ts(70,67): error TS2344: Type 'F' does not satisfy the constraint 'OutputFlags<any>'.
    // 👾 Task "build » compile" failed when executing "tsc --build" (cwd: /home/runner/work/click/click)
    // Error: Process completed with exit code 1.
    ignore: [
      '@oclif/core',
      '@oclif/command',
      '@oclif/config',
      '@oclif/plugin-help',
      '@oclif/plugin-not-found',
      '@oclif/test',
      'oclif',
    ],
  },

```
