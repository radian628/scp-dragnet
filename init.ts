import * as fs from "node:fs/promises";
import * as process from "node:process";

const manifestStructure = [
  {
    pageSlug: process.argv[2],
    sourceTextUrl: "http://localhost:6969/static/source.txt",
    metadataUrl: "http://localhost:6969/static/metadata.json",
    fileAttachmentNamesUrl: "http://localhost:6969/filenames.json",
    filesBaseUrl: "http://localhost:6969/files",
    changesUrl: "ws://localhost:6969/changes",
  },
];

await fs.writeFile(
  "static/manifest.json",
  JSON.stringify(manifestStructure, undefined, 2)
);
