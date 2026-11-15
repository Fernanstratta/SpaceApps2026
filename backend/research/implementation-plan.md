# Execution plan and repository inspection

Repository supplied by the user: `ClydioSeven/Starman-Backend`, default branch `Main`. Inspected recursive tree, package manifest, Vercel config, API handlers, server helpers, React entry point, comparison content and TypeScript config before modifying files. No AGENTS.md was present in the retrieved repository tree or workspace parent inspected.

Architecture: React 19, Vite 8, TypeScript 7, Node 24, Vercel file-based functions. Existing handlers: APOD, health, eight-planet catalog. Frontend includes Atacama/Gale and McMurdo/lunar-pole content. Existing HTTP helper only permits GET; the new public catalog handlers use a separate helper to avoid changing old contracts.

Priorities executed:

1. Identify three evidence-supported teaching pairs; separate observations from proposed analog interpretations.
2. Curate local JSON, citations, contextual coordinates, educational levels and explicit missing-data fields.
3. Add Zod-derived types, scoring logic, repository adapter, validated/cached endpoints and explicit detail rewrites.
4. Add a React integration example and client-side response validation while preserving prior functionality.
5. Retrieve reproducible NASA POWER context, test scoring and endpoints, run existing build/typecheck, and package a source update overlay.

Assumptions: English educational content; no new database; no deployment or remote writes. GitHub connector could retrieve text but not original binary images; deliver changed/new files as an overlay for the original checkout. No private tokens are placed in source or artifacts. Source access limitations, rather than synthetic measurements, define the release boundary.
