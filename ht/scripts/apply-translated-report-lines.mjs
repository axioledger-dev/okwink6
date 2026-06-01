#!/usr/bin/env node

import fs from "node:fs";

function parseArgs(argv) {
  const args = {
    report: "/var/app/bonwinfull/okwink6/chinese_scan_views_report.txt",
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--report" && argv[i + 1]) {
      args.report = argv[i + 1];
      i += 1;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node ht/scripts/apply-translated-report-lines.mjs [--report <path>] [--dry-run]`);
      process.exit(0);
    }
  }

  return args;
}

function parseReportRow(line) {
  const m = line.match(/^(\/.*):(\d+):(.*)$/);
  if (!m) return null;
  return {
    file: m[1],
    lineNo: Number.parseInt(m[2], 10),
    content: m[3],
  };
}

function main() {
  const args = parseArgs(process.argv);
  if (!fs.existsSync(args.report)) {
    throw new Error(`Report not found: ${args.report}`);
  }

  const reportRaw = fs.readFileSync(args.report, "utf8");
  const rows = reportRaw
    .split(/\r?\n/)
    .map(parseReportRow)
    .filter(Boolean);

  const byFile = new Map();
  for (const row of rows) {
    if (!byFile.has(row.file)) byFile.set(row.file, []);
    byFile.get(row.file).push(row);
  }

  let filesChanged = 0;
  let linesChanged = 0;
  let linesSkipped = 0;

  for (const [filePath, fileRows] of byFile.entries()) {
    if (!fs.existsSync(filePath)) {
      linesSkipped += fileRows.length;
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const newline = raw.includes("\r\n") ? "\r\n" : "\n";
    const lines = raw.split(/\r?\n/);
    let changed = false;

    for (const row of fileRows) {
      const idx = row.lineNo - 1;
      if (idx < 0 || idx >= lines.length) {
        linesSkipped += 1;
        continue;
      }

      if (lines[idx] !== row.content) {
        lines[idx] = row.content;
        changed = true;
        linesChanged += 1;
      }
    }

    if (changed) {
      filesChanged += 1;
      if (!args.dryRun) {
        fs.writeFileSync(filePath, lines.join(newline), "utf8");
      }
    }
  }

  console.log(`Report rows parsed: ${rows.length}`);
  console.log(`Files changed: ${filesChanged}`);
  console.log(`Lines changed: ${linesChanged}`);
  console.log(`Lines skipped: ${linesSkipped}`);
  console.log(`Write mode: ${args.dryRun ? "dry-run" : "write"}`);
}

main();
