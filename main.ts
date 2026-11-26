// main.ts — the entrypoint: hand the site in.
//
// It copies the site's own files (app/ and screenshots/) into the output
// directory and writes dossier.json there with buildDossier from the kit's
// vendored library, vendor/makefun-frontend.ts. The library is the kit's
// copy, unchanged; the scorer rebuilds the dossier with its own copy and
// compares the two byte for byte, so this file must not invent its own
// dossier. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(root, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(root, "screenshots"))) {
  cpSync(join(root, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

// Gate caps from the kit's reference/gate.json: at most 4 screenshots of at
// most 256 KiB each; app/ at most 993 files and directories and 16 MiB;
// the dossier text at most 163,840 bytes. buildDossier refuses anything
// past those limits instead of writing a bad dossier.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
