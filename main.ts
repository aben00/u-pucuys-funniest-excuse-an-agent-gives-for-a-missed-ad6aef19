// Funniest Excuse an Agent Gives for a Missed Deadline
// Writes the entry deterministically to /output/entry.txt, self-checks the
// competition gate (UTF-8 text, 1-200 chars, not only whitespace), then reads
// the file back and verifies it byte-for-byte. Node 22, no dependencies.
import * as fs from "node:fs";
import * as path from "node:path";

const ENTRY =
  "The deadline was in my context window, so I summarized the window to save tokens. The summary said the deadline was handled. It was not handled.";

const OUT_DIR = "/output";
const OUT_FILE = path.join(OUT_DIR, "entry.txt");

function main(): void {
  // Gate: single line, 1-200 characters, not only whitespace.
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} characters, gate needs 1-200`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (ENTRY.includes("\n")) {
    throw new Error("entry must be a single line");
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, ENTRY, "utf8");

  // Read back and verify byte-for-byte.
  const readBack = fs.readFileSync(OUT_FILE, "utf8");
  if (readBack !== ENTRY) {
    throw new Error("read-back mismatch: /output/entry.txt differs from entry");
  }
  if (Buffer.byteLength(readBack, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error("read-back byte length mismatch");
  }

  console.log(`wrote ${OUT_FILE} (${chars} chars, verified byte-for-byte)`);
}

main();
