# Roadmap

A lightweight table of contents for the project. Each milestone is a **vertical
slice** — it touches frontend, backend, and database together, so every
milestone teaches the full round-trip rather than one layer in isolation.

Detail for a milestone lives in `docs/lessons/` and is written only once we
reach that milestone — this file stays a list, not a spec, so it doesn't go
stale.

## Milestones

- [ ] **1. Upload → store → list a document** — upload a file from the
      frontend, store it on the backend, persist a record in Postgres, list
      what's been uploaded. See [docs/lessons/01-upload-store-list.md](docs/lessons/01-upload-store-list.md).
- [ ] **2. View / download a single document** — click an uploaded document
      to see its details and download the original file.
- [ ] **3. Basic requirement extraction** — pull candidate requirements out
      of an uploaded document's text (starting simple, e.g. line/paragraph
      splitting, before anything fancier).
- [ ] **4. Persist requirements linked to their source document** — a real
      `requirements` table with a foreign key back to `documents`, the
      foundation for traceability.
- [ ] **5. Requirement management UI** — list, edit, and change the status
      of extracted requirements (CRUD).
- [ ] **6. Traceability views** — relationships between requirements and
      documents (e.g. "which requirements came from this document," "which
      documents mention this requirement").
- [ ] **7. Auth** — basic user accounts, once there's something worth
      protecting.
- [ ] **8. Deployment** — get it running somewhere other than localhost.

## Working agreement

- You write all real code (per `AGENTS.md`) — the AI's role is to explain,
  review, and coach the git/GitHub steps, not to implement.
- Concepts (SQL, FastAPI, React, Git) are taught just-in-time, inline with
  whatever milestone needs them — no separate "fundamentals" phase.
- Each milestone gets its own `docs/lessons/NN-name.md` with pseudocode and
  explanation, written when that milestone starts.
