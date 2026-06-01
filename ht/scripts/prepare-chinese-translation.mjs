#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    report: "/var/app/bonwinfull/okwink6/chinese_scan_views_report.txt",
    outDir: "/var/app/bonwinfull/okwink6/chinese_translation_work",
    reportChunkSize: 300,
    dictChunkSize: 200,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--report" && argv[i + 1]) {
      args.report = argv[i + 1];
      i += 1;
    } else if (arg === "--out-dir" && argv[i + 1]) {
      args.outDir = argv[i + 1];
      i += 1;
    } else if (arg === "--report-chunk-size" && argv[i + 1]) {
      args.reportChunkSize = Number.parseInt(argv[i + 1], 10);
      i += 1;
    } else if (arg === "--dict-chunk-size" && argv[i + 1]) {
      args.dictChunkSize = Number.parseInt(argv[i + 1], 10);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node ht/scripts/prepare-chinese-translation.mjs [options]

Options:
  --report <path>              Report path (default: /var/app/bonwinfull/okwink6/chinese_scan_views_report.txt)
  --out-dir <path>             Output directory (default: /var/app/bonwinfull/okwink6/chinese_translation_work)
  --report-chunk-size <num>    Lines per report chunk (default: 300)
  --dict-chunk-size <num>      Terms per dictionary chunk (default: 200)
`);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toSafeTsv(value) {
  return value.replace(/\t/g, " ").replace(/\r?\n/g, " ").trim();
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

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(args.report)) {
    console.error(`Report not found: ${args.report}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(args.report, "utf8");
  const allLines = raw.split(/\r?\n/);
  const matchLines = allLines.filter((line) => /^(\/.*):\d+:/.test(line));
  const parsedRows = matchLines.map(parseReportLine).filter(Boolean);

  const outDir = args.outDir;
  const reportDir = path.join(outDir, "report_chunks");
  const dictDir = path.join(outDir, "dict_chunks");
  ensureDir(outDir);
  ensureDir(reportDir);
  ensureDir(dictDir);

  const reportChunks = chunkArray(matchLines, Math.max(1, args.reportChunkSize));
  for (let i = 0; i < reportChunks.length; i += 1) {
    const idx = String(i + 1).padStart(4, "0");
    const filePath = path.join(reportDir, `report_chunk_${idx}.txt`);
    const content = [
      `# Report chunk ${idx}`,
      `# Source: ${args.report}`,
      ...reportChunks[i],
      "",
    ].join("\n");
    fs.writeFileSync(filePath, content, "utf8");
  }

  const termMap = new Map();
  const hanRegex = /[\p{Script=Han}]+/gu;
  for (const row of parsedRows) {
    const tokens = row.content.match(hanRegex) || [];
    for (const token of tokens) {
      if (!termMap.has(token)) {
        termMap.set(token, {
          count: 0,
          file: row.file,
          line: row.line,
        });
      }
      termMap.get(token).count += 1;
    }
  }

  const terms = [...termMap.entries()]
    .map(([cnText, meta]) => ({ cnText, ...meta }))
    .sort((a, b) => b.count - a.count || a.cnText.localeCompare(b.cnText));

  const masterDictPath = path.join(outDir, "terms_master.tsv");
  const dictHeader = ["status", "cn_text", "vi_text", "count", "example_file", "example_line", "note"].join("\t");
  const dictRows = terms.map((t) =>
    [
      "todo",
      toSafeTsv(t.cnText),
      "",
      String(t.count),
      toSafeTsv(t.file),
      String(t.line),
      "",
    ].join("\t")
  );
  fs.writeFileSync(masterDictPath, [dictHeader, ...dictRows, ""].join("\n"), "utf8");

  const dictChunks = chunkArray(terms, Math.max(1, args.dictChunkSize));
  for (let i = 0; i < dictChunks.length; i += 1) {
    const idx = String(i + 1).padStart(4, "0");
    const filePath = path.join(dictDir, `terms_chunk_${idx}.tsv`);
    const rows = dictChunks[i].map((t) =>
      [
        "todo",
        toSafeTsv(t.cnText),
        "",
        String(t.count),
        toSafeTsv(t.file),
        String(t.line),
        "",
      ].join("\t")
    );
    fs.writeFileSync(filePath, [dictHeader, ...rows, ""].join("\n"), "utf8");
  }

  const readmePath = path.join(outDir, "README.txt");
  const readme = [
    "Quy trinh dich thu cong:",
    "1) Dich tung file trong report_chunks/ de hieu ngu canh.",
    "2) Dien cot vi_text trong terms_master.tsv hoac dict_chunks/terms_chunk_*.tsv.",
    "3) Danh tu rieng thi viet dang Latin theo yeu cau.",
    "4) Chay script apply de thay vao source theo dung file:line.",
    "",
    "Lenh ap dung:",
    "node /var/app/bonwinfull/okwink6/ht/scripts/apply-chinese-translation.mjs \\",
    "  --report /var/app/bonwinfull/okwink6/chinese_scan_views_report.txt \\",
    "  --terms /var/app/bonwinfull/okwink6/chinese_translation_work/terms_master.tsv",
    "",
    "Chi thay dong co value=:",
    "node /var/app/bonwinfull/okwink6/ht/scripts/apply-chinese-translation.mjs \\",
    "  --report /var/app/bonwinfull/okwink6/chinese_scan_views_report.txt \\",
    "  --terms /var/app/bonwinfull/okwink6/chinese_translation_work/terms_master.tsv \\",
    "  --only-value",
    "",
  ].join("\n");
  fs.writeFileSync(readmePath, readme, "utf8");

  console.log(`Prepared translation workspace: ${outDir}`);
  console.log(`- Match lines: ${matchLines.length}`);
  console.log(`- Unique Han terms: ${terms.length}`);
  console.log(`- Report chunks: ${reportChunks.length}`);
  console.log(`- Dict chunks: ${dictChunks.length}`);
  console.log(`- Master dictionary: ${masterDictPath}`);
}

main();
