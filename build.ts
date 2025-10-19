import { smartAsyncReplaceAll } from "./r628/src/stringutils";
import * as fs from "node:fs/promises";
import * as path from "node:path";

async function smartStringReplace(str: string) {
  return (
    await smartAsyncReplaceAll(str, /\{\{js:([\s\S]*?)\}\}/g, async (str) => {
      const code = str.slice(5, -2);
      return await eval(code);
    })
  ).str;
}

// @ts-expect-error
globalThis.file = async (str, enclosingTag) => {
  const ret = await smartStringReplace(
    (await fs.readFile(path.join("src", str))).toString()
  );

  if (enclosingTag) {
    return `<${enclosingTag}>${ret}</${enclosingTag}>`;
  }
  return ret;
};

// const page = (await fs.readFile("src/page.txt")).toString();

// fs.writeFile("static/source.txt", await smartStringReplace(page));
