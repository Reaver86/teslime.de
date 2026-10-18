# Deploy to production

Follow this guide only when the user explicitly requests production deployment
(for example, "deploy it"). That authorizes the intended release, backup, and
verification. Editing, testing, committing, pushing, or preparing documentation
does not authorize publishing. Do not add production uploads to push triggers.

## Target and credentials

| Setting | Value |
| --- | --- |
| Production | `https://www.teslime.de/` (also check `https://teslime.de/`) |
| Netcup account / hosting | Customer `232476`, `Hosting202032`, Webhosting 2000 NUE |
| Server | `ae8e5.netcup.net` |
| Web IPv4 / IPv6 | `202.61.232.229` / `2a03:4000:61:843b::20:2032` |
| Document root in WCP | `/teslime.de/httpdocs` |
| Protocol | Explicit FTPS (FTPES), port 21, passive mode |
| Dedicated login | `teslime-deploy` |
| FTP-visible root | `/`, already restricted to `/teslime.de/httpdocs` |
| Upload source | Contents of the verified `dist/` directory |

`ottoschuster.de` shares this hosting subscription but has a separate document
root and deployment account. Never upload this build there or to the subscription
root. Routine website releases require no DNS, mail, registrar, or hosting-setting
changes.

Credentials are in ignored **`.deploy/netcup.json`** in this repository, with
directory permissions `0700` and file permissions `0600`. The deployment fields
are `host`, `ftp_port`, `ftp_username`, `ftp_password`, and `ftp_root`. Separate
`ccp_url`, `ccp_username`, and `ccp_password` fields provide recovery access through
the [Netcup portal](https://www.customercontrolpanel.de/). Read credentials
programmatically without printing them or placing passwords in command arguments.
Never upload this file or commit it. A fresh clone needs this file restored from
the owner's private credential storage or supplied by the owner.

Normal deployments use FTPS without a portal login or TAN. Portal administration
still requires two-factor authentication. If necessary, reset only the dedicated
`teslime-deploy` account through WCP → FTP Access and update the local file.
Preserve the existing `teslime` login and the shared `hosting202032` login.

## Tested transfer method

On 18 October 2026, `teslime-deploy` was created with its base directory restricted
to `/teslime.de/httpdocs`. Certificate-verified TLS login, passive listing, `MLSD`,
and download succeeded using Python 3's standard-library `ftplib.FTP_TLS`.
Downloaded `index.html` matched `https://www.teslime.de/` byte for byte. Moving to
the parent directory remained at `/`.

An isolated temporary-file probe verified upload, rename over an existing probe,
download comparison, and deletion. All probe files were removed and the original
root listing restored. No website files were replaced. A full production release
using this account has not yet been performed.

Use explicit TLS on port 21 with certificate verification and `PROT P` for encrypted
data connections. Do not use plain FTP or implicit FTPS on port 990; the latter
refused connections during the hosting probe. This FTP account has no SSH/SFTP
access. Do not reset shared hosting credentials to obtain a shell.

FTP `/` is already the website root: do **not** append `teslime.de/httpdocs` or
upload a containing `dist/` directory. Keep backups locally; this restricted
account cannot stage archives outside the served document root.

### Read-only preflight

Run this from the repository root before uploading:

```sh
python3 - <<'PYTHON'
import ftplib, io, json, ssl, urllib.request
from pathlib import Path

c = json.loads(Path(".deploy/netcup.json").read_text())
with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=30) as ftp:
    ftp.connect(c["host"], c["ftp_port"])
    ftp.login(c["ftp_username"], c["ftp_password"])
    ftp.prot_p()
    ftp.set_pasv(True)
    assert ftp.pwd() == "/", "Unexpected deployment root"
    assert {"index.html", "_astro", "nisv-verordnung.jpeg"} <= set(ftp.nlst())
    current = io.BytesIO()
    ftp.retrbinary("RETR index.html", current.write)
    with urllib.request.urlopen("https://www.teslime.de/", timeout=30) as r:
        assert current.getvalue() == r.read(), "FTP target differs from live site"
    print("Verified encrypted access to teslime.de document root")
PYTHON
```

Investigate any mismatch before uploading; caching or a changed target can affect
the comparison. Update expected files deliberately if a future approved refactor
changes the site's structure.

## Prepare the release

1. Inspect `git status` and the diff. Identify the intended working-tree release,
   including intended uncommitted changes. Record the commit and working-tree
   state; do not silently discard files or switch branches.
2. Use Node 24 (`nvm use` where available) and `npm ci` if dependencies need
   installing. Preserve the intended `PUBLIC_GOOGLE_MAPS_API_KEY` in the local
   build environment or ignored `.env`. Without it, the map becomes a link.
   See [architecture.md](architecture.md) for configuration details. GitHub Secrets
   are not automatically available in a local build.
3. Run `SITE_URL=https://www.teslime.de BASE_PATH=/ npm run verify`. It includes
   `npm test`, produces `dist/`, and must pass before deployment. Explicit overrides
   ensure a GitHub Pages preview prefix cannot leak into the production build.
4. Serve the exact build with `npm run preview -- --host 127.0.0.1`. Follow
   [verification.md](verification.md) at 320, 390, and 1440 px, including screenshots,
   menu/anchor interactions, optimized images, and the expected Maps behavior.
5. Save the verified build, SHA-256 manifest, and release metadata in a timestamped
   directory under ignored `output/deploy/`. Do not rebuild between verification
   and upload. Include all generated assets, especially `_astro/`, the favicon,
   and the NiSV document; exclude source, docs, `.env`, and `.deploy`.

## Back up and publish

1. Run the preflight, then recursively inventory FTP `/` using `mlsd()`. Download
   all regular files, including hidden server configuration and `.well-known` if
   present, into the release folder's `before/` directory. Record paths, sizes,
   and SHA-256 hashes; confirm download sizes. Do not follow unexpected symlinks
   or continue with an incomplete backup.
2. Compare the verified build manifest with the backup. Identify added, changed,
   unchanged, and obsolete files. Keep backups and manifests locally.
3. Create missing destination directories. Upload added/changed assets first and
   `index.html` last. For each file, `storbinary()` to a unique temporary name in
   its destination directory, download to verify SHA-256, then `rename()` over
   the final destination. Stop on errors and remove only this release's temporary
   files. Do not print credentials.
4. Preserve server configuration and ACME validation material unless an explicit
   reviewed change covers them. Do not empty the root or use blind mirror/delete.
   Keep previous hashed assets through verification for cached pages. Review
   obsolete content deliberately rather than leaving removed pages forever.
5. Download deployed files and compare against the new manifest, then run the
   live checks below. Retain the previous-site backup for rollback.

Per-file rename avoids exposing partial files, but this is not a whole-site atomic
release. Assets-first/HTML-last ordering reduces mixed-version risk. Temporary
files in this root may be public, so upload only public build output, never backups
or secrets. Do not assume `rsync` or SSH is available.

## Verify and roll back

Check HTTP/HTTPS and both apex and `www` hosts, including certificate validity and
the intended new content. Recheck the full single page at 320, 390, and 1440 px:
menu, section anchors, return to top, treatment galleries, prices, reviews, contact,
Maps behavior, and NiSV document. Inspect screenshots and failed network requests.
Check external link destinations without sending messages or making calls.

If release-related checks fail, restore the local `before/` backup using FTPS.
Restore any intentionally changed server configuration and remove only files newly
introduced by the failed release, using the manifests. Preserve unrelated files.
Repeat live verification and report the rollback; keep the failed artifact locally.

Report the version, production URL, checks performed, and backup location without
including secrets. Successful transfer alone does not prove a successful release.

## Recovery through the portal

If FTPS is unavailable, log in to CCP, select **Hosting202032**, open **Auto-Login
WEB**, then select **teslime.de** → **Files**. Confirm `/teslime.de/httpdocs`.
Back up before replacing files. A ZIP of build contents can be staged/extracted
outside `httpdocs` through the file manager, then copied into the document root;
preserve configuration and copy assets before HTML where possible. Perform the
same live checks and remove temporary archives afterwards. Do not leave backups
publicly downloadable. This fallback was not exercised for teslime.de in this task.

## GitHub Pages preview

`.github/workflows/main.yml` verifies pushes to `main` and manual workflow runs,
then publishes <https://reaver86.github.io/teslime.de/> through GitHub Actions.
Repository Settings → Pages uses **GitHub Actions** as its build source.
The workflow uses `withastro/action@v6` with Node 24 and `npm run verify`, then
`actions/deploy-pages@v5`, matching `ottoschuster.de`.

The preview sets `SITE_URL=https://reaver86.github.io` and
`BASE_PATH=/teslime.de`. It explicitly leaves the Maps key empty, so the preview
uses a normal Maps link without depending on production domain restrictions.
No custom domain or Netcup upload is configured. The former plain-FTP job is
removed; existing FTP secrets and accounts are unchanged.

Pushing updates the preview automatically. Production at `www.teslime.de` still
requires an explicit deployment request and the backup/FTPS procedure above.
