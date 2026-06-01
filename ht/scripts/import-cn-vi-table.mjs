#!/usr/bin/env node

import fs from "node:fs";

function parseArgs(argv) {
  const args = {
    table: "",
    terms: "/var/app/bonwinfull/okwink6/chinese_translation_work/terms_master.tsv",
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--table" && argv[i + 1]) {
      args.table = argv[i + 1];
      i += 1;
    } else if (arg === "--terms" && argv[i + 1]) {
      args.terms = argv[i + 1];
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node ht/scripts/import-cn-vi-table.mjs --table <cn_vi_table.md> [--terms <terms_master.tsv>]`);
      process.exit(0);
    }
  }
  return args;
}

function parseMarkdownMap(md) {
  const map = new Map();
  const lines = md.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim().startsWith("|")) continue;
    const parts = line.split("|").map((x) => x.trim());
    if (parts.length < 4) continue;
    const cn = parts[1];
    const vi = parts[2];
    if (!cn || !vi) continue;
    if (cn === "Tiếng Trung" || cn.startsWith("---")) continue;
    map.set(cn, vi);
  }
  return map;
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.table) {
    throw new Error("Missing --table <path>");
  }
  if (!fs.existsSync(args.table)) {
    throw new Error(`Table file not found: ${args.table}`);
  }
  if (!fs.existsSync(args.terms)) {
    throw new Error(`Terms file not found: ${args.terms}`);
  }

  const tableRaw = fs.readFileSync(args.table, "utf8");
  const map = parseMarkdownMap(tableRaw);
  const termsRaw = fs.readFileSync(args.terms, "utf8");
  const lines = termsRaw.split(/\r?\n/);
  const header = lines[0].split("\t");
  const idxCn = header.indexOf("cn_text");
  const idxVi = header.indexOf("vi_text");
  if (idxCn < 0 || idxVi < 0) {
    throw new Error("Invalid terms TSV header. Need cn_text + vi_text");
  }

  let updated = 0;
  for (let i = 1; i < lines.length; i += 1) {
    if (!lines[i].trim()) continue;
    const cols = lines[i].split("\t");
    const cn = (cols[idxCn] || "").trim();
    if (!cn || !map.has(cn)) continue;
    const vi = map.get(cn).trim();
    if (!vi) continue;
    if ((cols[idxVi] || "").trim() !== vi) {
      cols[idxVi] = vi;
      lines[i] = cols.join("\t");
      updated += 1;
    }
  }

  fs.writeFileSync(args.terms, lines.join("\n"), "utf8");
  console.log(`Imported entries from table: ${map.size}`);
  console.log(`Updated rows in terms file: ${updated}`);
}

main();
