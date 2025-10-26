import { smartAsyncReplaceAll } from "./r628/src/stringutils";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as chokidar from "chokidar";
import * as sassCompiler from "sass";
import { exec } from "node:child_process";
import { stdout, stderr } from "node:process";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

const devopsServer = exec("wds run");

function indent(str: string, indentWith: string) {
  return indentWith + str.replaceAll("\n", "\n" + indentWith);
}

devopsServer.stderr?.on("data", (d) => {
  stderr.write("Server:\n");
  stderr.write(indent(d.trimEnd(), "| ") + "\n\n");
});
devopsServer.stdout?.on("data", (d) => {
  stdout.write("Server:\n");
  stdout.write(indent(d.trimEnd(), "| ") + "\n\n");
});

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
    async (s) => {
      const rawCss = (await sassCompiler.compileStringAsync(s)).css;
      return (
        await postcss([autoprefixer]).process(rawCss, { from: undefined })
      ).css;
    },
    str,
    enclosingTag
  );
};

// @ts-expect-error
globalThis.writeFile = async (filename: string, str: string) => {
  await fs.writeFile(filename, str);
  return "";
};

function log(str: string) {
  stdout.write("Build:\n");
  stdout.write(indent(str, "| ") + "\n\n");
}

async function rebuild() {
  log("Started build!");
  const page = (await fs.readFile("src/page.txt")).toString();
  fs.writeFile("static/source.txt", await smartStringReplace(page));
  log("Finished build!");
}

chokidar
  .watch("src", {
    usePolling: true,
    ignoreInitial: true,
  })
  .on("all", async () => {
    rebuild();
  });

rebuild();
