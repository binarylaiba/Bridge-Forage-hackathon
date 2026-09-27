import { DemoStepItem } from '../types';

export const DEMO_STEPS: DemoStepItem[] = [
  {
    index: 0,
    timeCode: '0:00 - 0:30',
    title: 'The Hook',
    subtitle: 'The Problem: API Contract Drift',
    scriptNarrative: '"Every time backend changes an API, the frontend breaks. It costs thousands of hours a year. BridgeForge uses IBM Bob 2.0 to fix this instantly."',
    keyAction: 'Explain the problem and introduce BridgeForge as the central nervous system for modern cross-stack engineering.',
    syncStage: 'healthy'
  },
  {
    index: 1,
    timeCode: '0:30 - 1:00',
    title: 'The Setup',
    subtitle: 'Healthy Baseline Application',
    scriptNarrative: '"Here is our enterprise app. The React UI is seamlessly fetching user data from UserController.java and rendering Alex Johnson\'s profile."',
    keyAction: 'Show the dummy UserProfile.tsx rendering properly with firstName: "Alex".',
    syncStage: 'healthy'
  },
  {
    index: 2,
    timeCode: '1:00 - 1:20',
    title: 'The Break',
    subtitle: 'Backend introduces breaking change',
    scriptNarrative: '"Now, backend engineer renames `firstName` to `given_name` in UserController.java and hits save. Normally, the React UI crashes with undefined, docs go stale, and pipelines fail."',
    keyAction: 'Trigger the backend drift event. Sandbox UI crashes with an API Contract Drift error.',
    syncStage: 'drift_detected'
  },
  {
    index: 3,
    timeCode: '1:20 - 2:20',
    title: 'Bob in Action',
    subtitle: 'Plan Mode & Parallel Subagents',
    scriptNarrative: '"BridgeForge detects the save. IBM Bob 2.0 activates Plan Mode, maps the Blast Radius in .bob/plans/sync-plan.md, and spawns 3 parallel subagents to rewrite UI, docs, and tests concurrently."',
    keyAction: 'Show Bob Plan Mode analyzing AST diff, and subagents 1, 2, and 3 rewriting files in parallel.',
    syncStage: 'subagents_running'
  },
  {
    index: 4,
    timeCode: '2:20 - 3:00',
    title: 'The Resolution',
    subtitle: 'Zero Downtime, Fully Synced',
    scriptNarrative: '"Look at the result: UserProfile.tsx now uses given_name, the OpenAPI docs are updated, and E2E tests pass. Hit refresh, the UI is restored instantly without a single manual pull request!"',
    keyAction: 'Display side-by-side Monaco diffs and refreshed healthy dummy app.',
    syncStage: 'synced'
  }
];
