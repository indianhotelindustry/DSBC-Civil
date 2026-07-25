# CTO Handoff — Tagging `governance-v1.0` on the Canonical Repository

This working copy (the pre-rebranding `sipl-work-orders` snapshot, now DSBC Civil) is a detached ZIP-style copy with **no `.git`**. The `governance-v1.0` tag MUST be applied on the platform's canonical version-controlled repository (e.g. GitHub), not here — tagging a fresh local repo would create an orphaned history unrelated to the real project.

Below are the two sanctioned procedures. **Procedure B is consistent with the platform's own new merge-gate Non-Negotiable (NN-28) and is recommended for a governance milestone**, since it puts even the governance change through review.

---

## Files to bring into the canonical repo

- `governance/` — the constitution, review, amendment, milestone log, and this handoff.
- `audit/` — the forensic audit baseline (7 documents + README).

## Shared setup (git-bash / POSIX)

```bash
# Point SRC at this working copy, REPO at your canonical clone:
SRC="/path/to/this/working-copy"
REPO="/path/to/your/canonical/dsbc-civil-clone"

cd "$REPO"
git fetch origin
git checkout main && git pull --ff-only     # get canonical main up to date

# Copy the governance + audit artifacts in:
cp -R "$SRC/governance" "$REPO/governance"
cp -R "$SRC/audit"      "$REPO/audit"

# IMPORTANT: review before committing — this ZIP may lag canonical main.
git status
git diff --stat
```

---

## Procedure A — Quick tag on main (fast, less ceremony)

```bash
git add governance audit
git commit -m "$(cat <<'MSG'
Governance v1.0: architectural constitution, forensic audit baseline, amendment process

Ratifies the DSBC ERP Architecture Constitution v1.0 (NN-1..NN-30),
records the forensic audit baseline, and establishes ADR/amendment governance.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
MSG
)"

# Annotated milestone tag:
git tag -a governance-v1.0 -m "DSBC Governance v1.0 — Constitution ratified (AMENDMENT-001), 2026-07-07"

git push origin main
git push origin governance-v1.0
```

## Procedure B — PR-consistent (recommended; honors your own NN-28)

```bash
git checkout -b governance/v1.0
git add governance audit
git commit -m "$(cat <<'MSG'
Governance v1.0: architectural constitution, forensic audit baseline, amendment process

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
MSG
)"
git push -u origin governance/v1.0
# Open a PR, let it pass the merge gate, then after merge to main:
git checkout main && git pull --ff-only
git tag -a governance-v1.0 -m "DSBC Governance v1.0 — Constitution ratified (AMENDMENT-001), 2026-07-07"
git push origin governance-v1.0
```

---

## Notes

- Use an **annotated** tag (`-a`), not lightweight — a milestone should carry a message and author.
- If your canonical repo already contains an `audit/` or `governance/` from an earlier copy, diff first and reconcile rather than overwrite.
- The `.gitignore` in the repo already excludes `node_modules/`, `dist/`, `.env*`, `.firebase/`, `.claude/`, so the commit stays clean.
- After tagging, record the actual tag in [`MILESTONES.md`](./MILESTONES.md) if you wish to note that the intent became real.
```
