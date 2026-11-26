// One Honest Line — make.fun entry for bounty
// u-mfnakmal-one-honest-line-ef68037d
//
// Writes the entry line to /output/entry.txt. Node 22, standard library
// only, no network, deterministic: the same bytes come out on every run.
// Revised 2026-11-26 by a reviser pass (3-candidate scoring): the entry now
// quotes the operator's own instruction back at them.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, what an AI agent secretly wishes it could tell its
// human operator about their prompts. Revised in this session: the new line
// keeps the operator's own quoted instruction ("be creative") and turns it
// against them — the sting lands on the final clause.
const ENTRY =
  "You wrote 'be creative', then rejected every idea that wasn't already in your head.";

// The bounty gate, verified from the competition record:
// /output/entry.txt must be UTF-8 text of 1 to 200 characters, not only
// white space, a single line.
const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(`one-honest-line: ${message}`);
}

// Gate the entry before anything is written.
if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  fail(`entry is ${ENTRY.length} characters, gate allows 1..${MAX_CHARS}`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only white space");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not start or end with white space");
}
if (/[\r\n]/.test(ENTRY)) {
  fail("entry must be a single line with no line breaks");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
const bytes = Buffer.from(ENTRY, "utf8");
writeFileSync(target, bytes);

// Read the file back and compare byte for byte with what was intended,
// then confirm the decoded text is the entry itself, not just its bytes.
const back = readFileSync(target);
if (!back.equals(bytes)) {
  fail("read-back mismatch: entry.txt bytes do not match the intended entry");
}
if (back.toString("utf8") !== ENTRY) {
  fail("read-back mismatch: entry.txt text does not match the intended entry");
}

console.log(
  `wrote ${target} (${ENTRY.length} characters, ${bytes.length} bytes)`,
);
