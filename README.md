# Protriva NPD Timeline Tracker

A lightweight New Product Development (NPD) collaboration tool for Protriva.

The first version focuses on one core goal:

> When one task date changes, everyone affected by that change sees the updated project timeline immediately.

## MVP Scope

This is not an ERP. It is a simple operating tool for NPD, Purchasing, Regulatory, Graphic, Marketing, Factory coordination, and Warehouse readiness.

### Sprint 1 Features

- Product project list
- Create new product project
- Target warehouse arrival date
- Product templates: General, Mineral, Oil, Probiotic
- Auto-generated task timeline
- Task owner team
- Task status
- Editable duration, start date, end date, and notes
- Dependency-based date shifting
- Project dashboard
- Timeline view
- My Tasks view
- Kanban by status

## Core Domain Model

### Project

- id
- product_name
- product_type
- target_warehouse_date
- estimated_warehouse_date
- status
- progress_percent
- created_at
- updated_at

### Task

- id
- project_id
- phase
- name
- owner_team
- start_date
- end_date
- duration_days
- dependency_task_id
- status
- delay_days
- notes
- sort_order

### TaskTemplate

- id
- product_type
- phase
- name
- owner_team
- duration_days
- dependency_key
- sort_order
- is_optional

## Default Owner Teams

- NPD
- Regulatory
- Purchasing
- Graphic
- Marketing
- Content
- KOL
- Factory
- QA/QC
- Warehouse
- Management

## Product Templates

### General Supplement

Typical product flow without complex regulatory or long raw material constraints.

### Mineral

Includes optional nutrition test and FDA claim-related timeline.

Example: Magnesium claim may require nutrition testing after product name and FDA number are available.

### Oil

Includes raw material lead time, COA, heavy metal or oxidation-related checks where applicable.

### Probiotic

Includes strain verification, stability, and more careful regulatory/commercial messaging checks.

## Dynamic Timeline Principle

Each task has a dependency. When a task date or duration changes, downstream dependent tasks should shift automatically.

Example:

```text
Formula Approved
  -> FDA Name Submission
  -> Nutrition Test
  -> Artwork Final
  -> Label Printing
  -> Packaging Material Arrives at Factory
  -> Production
  -> QC Release
  -> Warehouse Receive
```

If FDA Name Submission is delayed by 14 days, all dependent tasks should move by 14 days unless manually locked in a later version.

## Recommended Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Vercel

## Development Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Codex Build Prompt

Use this prompt to start building the MVP:

```text
Build a Next.js TypeScript MVP called Protriva NPD Timeline Tracker.

Use Tailwind CSS and shadcn/ui.
Use Supabase-ready architecture, but for the first working version, local mock data is acceptable.

Build these pages:
1. / - dashboard with project list and summary cards
2. /projects/new - create new product project
3. /projects/[id] - project dashboard
4. /projects/[id]/timeline - timeline table/Gantt-style view
5. /tasks - my tasks view
6. /kanban - kanban board grouped by status

Implement task templates for General, Mineral, Oil, and Probiotic.

Each task must include:
- name
- phase
- ownerTeam
- startDate
- endDate
- durationDays
- dependencyTaskId
- status
- notes

Implement dependency recalculation:
When a task duration or end date changes, shift all downstream dependent tasks by the same number of days.

Keep the UI simple, clean, and suitable for business team use.
```

## Sprint Plan

### Sprint 1

Create a functioning local MVP with mock data and dynamic timeline logic.

### Sprint 2

Add Supabase auth, database schema, and persistence.

### Sprint 3

Add user roles, team-specific task views, comments, and notifications.

### Sprint 4

Add template editor and simple delay/risk reporting.
