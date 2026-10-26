# Graph Report - DTA-OTA  (2026-10-21)

## Corpus Check
- 55 files · ~74,254 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: .example 1, (none) 1)

## Summary
- 97 nodes · 208 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- NPM Test Runner Scripts
- Mitra OTA & Core E2E Framework
- Central Auth & TempMail Helpers
- E2E Configuration & AI SDK Dependencies
- Finance BUMD Test Suite
- 35-Step Lifecycle Regression & Approval
- Cursor IDE MCP Integration
- Root MCP Tooling Server

## God Nodes (most connected - your core abstractions)
1. `@e2e-dev/web` - 25 edges
2. `e2e` - 24 edges
3. `scripts` - 18 edges
4. `loginAndNavigateToMitra()` - 10 edges
5. `loginAndNavigateToBumd()` - 6 edges
6. `fillTab1()` - 6 edges
7. `fillTab2()` - 5 edges
8. `loginAndNavigateToTagProperti()` - 5 edges
9. `openLoginModal()` - 5 edges
10. `logoutSession()` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (8 total, 2 thin omitted)

### Community 0 - "NPM Test Runner Scripts"
Cohesion: 0.11
Nodes (18): scripts, test:auth:all, test:auth:guest, test:auth:mitra, test:auth:roles, test:bumd, test:bumd:crud, test:bumd:regression (+10 more)

### Community 1 - "Mitra OTA & Core E2E Framework"
Cohesion: 0.33
Nodes (6): e2e, @e2e-dev/web, loginAndNavigateToMitra(), loginAndNavigateToRegistrasiProperti(), loginAndNavigateToTagProperti(), takeEvidenceScreenshot()

### Community 2 - "Central Auth & TempMail Helpers"
Cohesion: 0.28
Nodes (11): AUTH_LOGOUT_URL, dismissInitialPromo(), logoutSession(), openLoginModal(), setupApiRouteBridge(), takeAuthScreenshot(), TARGET_URL, createTempInbox() (+3 more)

### Community 3 - "E2E Configuration & AI SDK Dependencies"
Cohesion: 0.13
Nodes (13): devDependencies, ai, @ai-sdk/google, @ai-sdk/openai, e2e, @e2e-dev/web, zod, private (+5 more)

### Community 4 - "Finance BUMD Test Suite"
Cohesion: 0.40
Nodes (8): fillTab1(), fillTab2(), fillTab3(), loginAndNavigateToBumd(), navigateToTab4(), setFoundedYear(), submitWizardForm(), takeEvidenceScreenshot()

### Community 5 - "35-Step Lifecycle Regression & Approval"
Cohesion: 0.32
Nodes (5): clickWizardSubmit(), submitAndAdvance(), loginMitraDashboard(), logoutCurrentSession(), takeLifecycleScreenshot()

## Knowledge Gaps
- **4 isolated node(s):** `npx`, `npx`, `ai`, `zod`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 36 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@e2e-dev/web` connect `Mitra OTA & Core E2E Framework` to `Central Auth & TempMail Helpers`, `E2E Configuration & AI SDK Dependencies`, `Finance BUMD Test Suite`, `35-Step Lifecycle Regression & Approval`?**
  _High betweenness centrality (0.336) - this node is a cross-community bridge._
- **What connects `npx`, `npx`, `ai` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NPM Test Runner Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `NPM Test Runner Scripts` to `E2E Configuration & AI SDK Dependencies`?**
  _High betweenness centrality (0.302) - this node is a cross-community bridge._
- **Should `E2E Configuration & AI SDK Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `e2e` connect `Mitra OTA & Core E2E Framework` to `Central Auth & TempMail Helpers`, `E2E Configuration & AI SDK Dependencies`, `Finance BUMD Test Suite`, `35-Step Lifecycle Regression & Approval`?**
  _High betweenness centrality (0.292) - this node is a cross-community bridge._