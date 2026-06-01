#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    chunksDir: "/var/app/bonwinfull/okwink6/chinese_translation_views_manual/report_chunks",
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--chunks-dir" && argv[i + 1]) {
      args.chunksDir = argv[i + 1];
      i += 1;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node ht/scripts/apply-translated-chunks.mjs [--chunks-dir <path>] [--dry-run]`);
      process.exit(0);
    }
  }

  return args;
}

function parseRow(line) {
  const m = line.match(/^(\/.*):(\d+):(.*)$/);
  if (!m) return null;
  return { file: m[1], lineNo: Number.parseInt(m[2], 10), content: m[3] };
}

function main() {
  const args = parseArgs(process.argv);
  if (!fs.existsSync(args.chunksDir)) {
    throw new Error(`Chunks directory not found: ${args.chunksDir}`);
  }

  const files = fs
    .readdirSync(args.chunksDir)
    .filter((f) => /^report_chunk_\d+\.txt$/.test(f))
    .sort((a, b) => a.localeCompare(b));

  const byFile = new Map();
  let parsedRows = 0;
  for (const fileName of files) {
    const fullPath = path.join(args.chunksDir, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    const rows = raw.split(/\r?\n/).map(parseRow).filter(Boolean);
    for (const row of rows) {
      if (!byFile.has(row.file)) byFile.set(row.file, new Map());
      // Last chunk line wins if duplicated
      byFile.get(row.file).set(row.lineNo, row.content);
      parsedRows += 1;
    }
  }

  let filesChanged = 0;
  let linesChanged = 0;
  let linesSkipped = 0;

  for (const [filePath, lineMap] of byFile.entries()) {
    if (!fs.existsSync(filePath)) {
      linesSkipped += lineMap.size;
      continue;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const newline = raw.includes("\r\n") ? "\r\n" : "\n";
    const lines = raw.split(/\r?\n/);
    let changed = false;

    for (const [lineNo, newText] of lineMap.entries()) {
      const idx = lineNo - 1;
      if (idx < 0 || idx >= lines.length) {
        linesSkipped += 1;
        continue;
      }
      if (lines[idx] !== newText) {
        lines[idx] = newText;
        linesChanged += 1;
        changed = true;
      }
    }

    if (changed) {
      filesChanged += 1;
      if (!args.dryRun) {
        fs.writeFileSync(filePath, lines.join(newline), "utf8");
      }
    }
  }

  console.log(`Chunk files: ${files.length}`);
  console.log(`Parsed rows: ${parsedRows}`);
  console.log(`Files changed: ${filesChanged}`);
  console.log(`Lines changed: ${linesChanged}`);
  console.log(`Lines skipped: ${linesSkipped}`);
  console.log(`Write mode: ${args.dryRun ? "dry-run" : "write"}`);
}

main();
