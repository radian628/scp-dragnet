# Installation

## Depedencies

- Git
- [Bun](https://bun.sh/)
- Wikidot DevOps Server (run `bun i -g wikidot-devops-server` in your terminal)
- [Wikidot DevOps UserScript](https://github.com/radian628/wikidot-usertools/raw/refs/heads/main/build/wikidot-devops/wikidot-devops.user.js)

## Installation

1. Install dependencies.
2. Clone the repo.
3. Run `bun i` to install NPM dependencies.
4. Run `bun run init SLUGNAME` where `SLUGNAME` is the page slug. For instance, if your intended page URL is `https://scp-sandbox-3.wikidot.com/qazwsx`, then `SLUGNAME` would be `qazwsx`. This step will generate the file `manifest.json`, which provides metadata that will be passed to Wikidot DevOps Server telling it which page(s) to update.
5. Create the article whose URL contains SLUGNAME as described above, and paste the contents of `source.txt` into it.
6. Go into the JavaScript console, and define the `localStorage` item it tells you to define using `localStorage.setItem("NAME HERE", "true")`. This is just a security measure to ensure that only pages you've explicitly enabled automatically update.
7. Refresh the page. You _should_ be able to type something into `static/source.txt`, wait a few seconds, and then see the change on the article.
