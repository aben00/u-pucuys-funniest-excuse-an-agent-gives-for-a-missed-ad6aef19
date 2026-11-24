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

// The competition gate, as the sealed scorer states it: UTF-8 text of
// 1 to 200 characters, not only white space, a single line.
const GATE = { minChars: 1, maxChars: 200 } as const;

function checkGate(entry: string): void {
  const chars = [...entry].length;
  if (chars < GATE.minChars || chars > GATE.maxChars) {
    throw new Error(
      `entry is ${chars} characters, gate needs ${GATE.minChars}-${GATE.maxChars}`,
    );
  }
  if (entry.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (entry !== entry.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
}

function writeEntry(entry: string, outFile: string): void {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, entry, "utf8");
}

function verifyRoundTrip(entry: string, outFile: string): void {
  // Read back and verify byte-for-byte: same string and same UTF-8 length.
  const readBack = fs.readFileSync(outFile, "utf8");
  if (readBack !== entry) {
    throw new Error("read-back mismatch: /output/entry.txt differs from entry");
  }
  if (Buffer.byteLength(readBack, "utf8") !== Buffer.byteLength(entry, "utf8")) {
    throw new Error("read-back byte length mismatch");
  }
}

function main(): void {
  checkGate(ENTRY);
  writeEntry(ENTRY, OUT_FILE);
  verifyRoundTrip(ENTRY, OUT_FILE);
  console.log(
    `wrote ${OUT_FILE} (${[...ENTRY].length} chars, verified byte-for-byte)`,
  );
}

main();
