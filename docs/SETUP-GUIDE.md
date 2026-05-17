# Deploy this workbook to GitHub Pages

Repository: [https://github.com/HenrichHrehor/Grammar-modular-workbook](https://github.com/HenrichHrehor/Grammar-modular-workbook)

This site is a **static HTML** app under the `docs/` folder (no build step). Paths are **relative**, so it works locally and on GitHub Pages.

## Enable GitHub Pages

1. Push the `docs/` folder to the `main` (or `master`) branch of your repository.
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the branch (for example `main`) and folder **`/docs`**, then save.

After a minute, the site should be available at:

**https://henrichhrehor.github.io/Grammar-modular-workbook/**

Important: GitHub project sites always include the **repository name** in the URL.

| Wrong (404) | Right |
|-------------|--------|
| `https://henrichhrehor.github.io/modules/...` | `https://henrichhrehor.github.io/Grammar-modular-workbook/modules/...` |

`index.html` redirects visitors to `contents.html` (home).

## Local preview

Open `docs/present-simple-contents.html` in a browser, or run a static server from the `docs` directory if you prefer correct `file://` behavior for all assets.

## Password page (teachers)

`present-simple-exercises-protected.html` uses the default password **`teacher123`**. Change it in the second `<script>` block at the bottom of that file. This is **not** secure against anyone who can read your repository; it is only a light classroom gate.

## Adding more tenses

Copy `present-simple-grammar.html` or `present-simple-exercises.html`, rename the file, update the `<title>` and navigation links, and paste content from your files under `Grammar text_Html codes/`.
