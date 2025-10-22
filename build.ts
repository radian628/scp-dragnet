import { smartAsyncReplaceAll } from "./r628/src/stringutils";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as chokidar from "chokidar";
import * as sassCompiler from "sass";

async function smartStringReplace(str: string) {
  return (
    await smartAsyncReplaceAll(str, /\{\{js:([\s\S]*?)\}\}/g, async (str) => {
      const code = str.slice(5, -2);
      return await eval(code);
    })
  ).str;
}

async function generalizedFileImport(
  transformer: (str: string) => Promise<string>,
  str: string,
  enclosingTag: string
) {
  const ret = await transformer(
    (await fs.readFile(path.join("src", str))).toString()
  );

  if (enclosingTag) {
    return `<${enclosingTag}>${ret}</${enclosingTag}>`;
  }
  return ret;
}

// @ts-expect-error
globalThis.file = async (str, enclosingTag) => {
  return generalizedFileImport(smartStringReplace, str, enclosingTag);
};

// @ts-expect-error
globalThis.sass = async (str, enclosingTag) => {
  return generalizedFileImport(
    async (s) => (await sassCompiler.compileStringAsync(s)).css,
    str,
    enclosingTag
  );
};

chokidar
  .watch("src", {
    usePolling: true,
    ignoreInitial: false,
  })
  .on("all", async () => {
    const page = (await fs.readFile("src/page.txt")).toString();
    fs.writeFile("static/source.txt", await smartStringReplace(page));
  });
