#!/usr/bin/env node

import fs from "node:fs";

function parseArgs(argv) {
  const args = {
    report: "/var/app/bonwinfull/okwink6/chinese_scan_views_report.txt",
    terms: "/var/app/bonwinfull/okwink6/chinese_translation_work/terms_master.tsv",
    onlyValue: false,
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--report" && argv[i + 1]) {
      args.report = argv[i + 1];
      i += 1;
    } else if (arg === "--terms" && argv[i + 1]) {
      args.terms = argv[i + 1];
      i += 1;
    } else if (arg === "--only-value") {
      args.onlyValue = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node ht/scripts/apply-chinese-translation.mjs [options]

Options:
  --report <path>     Report path
  --terms <path>      TSV dictionary path (columns: cn_text, vi_text)
  --only-value        Only apply lines containing "value="
  --dry-run           Preview only (do not write files)
`);
}

function parseReportLine(line) {
  const m = line.match(/^(\/.*):(\d+):(.*)$/);
  if (!m) return null;
  return {
    file: m[1],
    line: Number.parseInt(m[2], 10),
    content: m[3],
  };
}

function parseTsvLine(line) {
  const parts = line.split("\t");
  return parts.map((x) => x.trim());
}

function loadDictionary(tsvPath) {
  if (!fs.existsSync(tsvPath)) {
    throw new Error(`Dictionary not found: ${tsvPath}`);
  }
  const raw = fs.readFileSync(tsvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter((x) => x.trim() !== "");
  if (lines.length === 0) return new Map();

  const header = parseTsvLine(lines[0]);
  const idxCn = header.indexOf("cn_text");
  const idxVi = header.indexOf("vi_text");
  const idxStatus = header.indexOf("status");

  if (idxCn === -1 || idxVi === -1) {
    throw new Error(`Invalid TSV header. Required: cn_text, vi_text`);
  }

  const map = new Map();
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].startsWith("#")) continue;
    const cols = parseTsvLine(lines[i]);
    const cn = cols[idxCn] || "";
    const vi = cols[idxVi] || "";
    const status = idxStatus >= 0 ? cols[idxStatus] || "" : "";
    if (!cn || !vi) continue;
    if (status.toLowerCase() === "skip") continue;
    map.set(cn, vi);
  }
  return map;
}

function loadTargets(reportPath) {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Report not found: ${reportPath}`);
  }
  const raw = fs.readFileSync(reportPath, "utf8");
  const lines = raw.split(/\r?\n/);
  const rows = lines.map(parseReportLine).filter(Boolean);
  const byFile = new Map();

  for (const row of rows) {
    if (!byFile.has(row.file)) byFile.set(row.file, new Set());
    byFile.get(row.file).add(row.line);
  }
  return byFile;
}

function replaceHanTokens(line, dict) {
  const regex = /[\p{Script=Han}]+/gu;
  let changed = false;
  const missing = new Set();
  const out = line.replace(regex, (match) => {
    if (dict.has(match)) {
      changed = true;
      return dict.get(match);
    }
    missing.add(match);
    return match;
  });
  return { out, changed, missing };
}

function main() {
  const args = parseArgs(process.argv);
  const dict = loadDictionary(args.terms);
  const targetsByFile = loadTargets(args.report);

  let filesChanged = 0;
  let linesChanged = 0;
  let replacements = 0;
  const missingTerms = new Map();

  for (const [filePath, lineSet] of targetsByFile.entries()) {
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf8");
    const newline = raw.includes("\r\n") ? "\r\n" : "\n";
    const lines = raw.split(/\r?\n/);
    let fileChanged = false;

    for (const oneBasedLine of lineSet) {
      const idx = oneBasedLine - 1;
      if (idx < 0 || idx >= lines.length) continue;
      const original = lines[idx];
      if (args.onlyValue && !original.includes("value=")) continue;

      const { out, changed, missing } = replaceHanTokens(original, dict);
      if (changed) {
        lines[idx] = out;
        fileChanged = true;
        linesChanged += 1;
        replacements += 1;
      }
      for (const m of missing) {
        missingTerms.set(m, (missingTerms.get(m) || 0) + 1);
      }
    }

    if (fileChanged) {
      filesChanged += 1;
      if (!args.dryRun) {
        fs.writeFileSync(filePath, lines.join(newline), "utf8");
      }
    }
  }

  console.log(`Dictionary entries: ${dict.size}`);
  console.log(`Files changed: ${filesChanged}`);
  console.log(`Lines changed: ${linesChanged}`);
  console.log(`Applied replacements: ${replacements}`);
  console.log(`Mode: ${args.onlyValue ? "only value= lines" : "all target lines"}`);
  console.log(`Write mode: ${args.dryRun ? "dry-run" : "write"}`);

  const missingSorted = [...missingTerms.entries()].sort((a, b) => b[1] - a[1]);
  if (missingSorted.length > 0) {
    console.log("Missing terms (top 50):");
    for (const [term, count] of missingSorted.slice(0, 50)) {
      console.log(`  ${term}\t${count}`);
    }
  }
}

main();
