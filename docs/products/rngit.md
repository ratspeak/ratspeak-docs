---
sidebar_position: 4.5
sidebar_label: Git over Reticulum
---

# Git over Reticulum

rsReticulum 1.5.0 includes three git tools, ported from the ones in Reticulum 1.6.0:

| Tool | What it does |
|---|---|
| `rngit-rs` | Runs a repository node and gives you commands to create, fork, mirror, release, and manage repositories on one. |
| `git-remote-rns` | Lets `git` clone, fetch, and push `rns://` URLs. Git runs it for you. |
| `rngcs-rs` | Signs and verifies commits with a Reticulum identity, through git's SSH signing interface. |

A repository URL is `rns://<destination_hash>/<group>/<repo>`. Once a remote uses that URL, ordinary `git clone`, `fetch`, `pull`, and `push` work over Reticulum.

Build the tools from source with the rest of rsReticulum on macOS or Linux; see [Building from source](../reference/building-from-source.md#build-rsreticulum). Each needs a working Reticulum configuration, either a running `rnsd-rs` to attach to or interfaces of its own. Python's `rngit` installs its own `git-remote-rns`, so keep only one of the two on `PATH`.

Repository hosting is new in rsReticulum. Treat a node as an internet-facing service, and start with private groups.

## Run a node

The node needs `git` installed and refuses to start without it.

1. Run `rngit-rs` once. On the first run it writes a default `config` and the node's `repositories_identity`, then starts with no repositories.
2. Stop it, then edit `config`: point `[repositories]` at your directories and grant access in `[access]`.
3. Start it again. It logs `Reticulum Git Node listening on <hash>`.
4. Print the hashes to share:

   ```bash
   rngit-rs -p
   ```

   **Repositories Destination** is the hash for `rns://` URLs. **Nomad Network Destination** appears when the page node is on. **Git Peer Identity** is the `client_identity` in the node's config directory.

To grant someone access, ask for the identity their git client uses. On their machine, `rnid-rs -i ~/.rngit/client_identity -p` prints it as **Identity Hash**; the file is created the first time they use an `rns://` URL.

Use `-s` to run as a service: it logs to `server_log` in the config directory. `--config` picks the config directory and `--rnsconfig` the Reticulum one. Without `--config`, the node uses `/etc/rngit` or `~/.config/rngit` when either holds a `config` file, and `~/.rngit` otherwise.

### Repositories

Each line in `[repositories]` names a group and the directory that holds its bare repositories. A repository's name in the URL is its directory name:

```ini
[rngit]
node_name = Field office
announce_interval = 360

[repositories]
public = /srv/git/public
internal = /srv/git/internal

[access]
public = r:all, w:9710b86ba12c42d1d8f30f74fe509286
internal = rw:9710b86ba12c42d1d8f30f74fe509286
```

Here `/srv/git/public/tools` is `rns://<destination_hash>/public/tools`. A directory that is not a bare repository is skipped with a warning. For a short description, put a `tools.description` file next to the repository, or set `git config repository.description` inside it.

### Node settings

These keys go in the `[rngit]` section:

| Key | Default | Meaning |
|---|---|---|
| `node_name` | `Anonymous Git Node` | Name included in announces. |
| `announce_interval` | `360` in the default file | Minutes between announces; `0` never announces. |
| `mirror_interval` | `24` | Hours between automatic syncs of mirrors. The default file lists it under `[repositories]`, where it is not read; set it here. |
| `record_stats` | `no` | Record views, fetches, and pushes for the stats pages. |
| `stats_ignore_identities`, `stats_push_ignore_identities` | none | Identity hashes left out of the stats. |
| `blocked_identities` | none | Identity hashes refused any interaction. `d7db22f63b453c23bb0688dde565b7c1`, the hash of an unidentified peer, blocks everyone who doesn't identify. |
| `fetch_time_limit` | `30` | Minutes a fork, mirror, or sync fetch may run. rsReticulum only. |
| `fetch_size_limit` | `1024` | Megabytes a fork, mirror, or sync fetch may add on disk. rsReticulum only. |

`[aliases]` maps short names to identity hashes for use in permissions. `[logging] loglevel` sets the node's own log level, 0 to 8.

### Permissions

Nothing is readable or writable until you grant it. A statement is `permission:target`, where the target is an identity hash, an alias, `all`, or `none`:

| Permission | Allows |
|---|---|
| `r` | Clone, fetch, and view. |
| `w` | Push, and create and manage work documents. |
| `rw` | Read and write. |
| `c` | Create, fork, or mirror repositories in the group. |
| `s` | View repository statistics. |
| `rel` | Create and manage releases. |
| `i` | Comment on work documents. |
| `p` | Propose work documents. |
| `adm` | Full control. |

Group permissions come from `[access]` and from a `public.allowed` file next to the `public` group directory. A repository's own `tools.allowed` file, next to the `tools` repository, takes precedence over its group. Each file has one statement per line. Whoever creates, forks, or mirrors a repository gets `adm` on it.

An `.allowed` file with the executable bit set is run when the node loads permissions, such as at start-up, and its output is read as the permissions. It runs with the node's account, so treat it as code. Admins can edit these files remotely with `rngit-rs perms rns://<destination_hash>/public` or `.../public/tools`, which opens `$EDITOR`. Granting `adm` lets that identity change everyone's access, including yours.

## Use a node

Clone and push with ordinary git commands:

```bash
git clone rns://0d7334d411d00120cbad24edf355fdd2/public/tools
git remote add mesh rns://0d7334d411d00120cbad24edf355fdd2/public/tools
git push mesh main
```

`git-remote-rns` identifies to the node with `client_identity` and reads `client_config` in `~/.rngit`; set `RNGIT_CONFIG` for another directory and `RNS_CONFIG` for another Reticulum directory. If `~/.config/rngit/config` exists, it uses `~/.rngit/reticulum` instead, as Python's rngit does. `client_config` sets `ref_batch_size`, `[aliases]` for destination hashes, and a log level; the helper logs to `client_log` in the same directory.

The `rngit-rs` subcommands act on a remote node, and each has its own `--help`:

| Command | What it does |
|---|---|
| `rngit-rs create URL` | Create an empty repository. Needs `c` on the group. |
| `rngit-rs fork SOURCE URL` | Copy any git URL, including `https://` and `rns://`, into a new repository that remembers its source. |
| `rngit-rs mirror SOURCE URL` | Like `fork`, and the node keeps it in sync every `mirror_interval`. |
| `rngit-rs sync URL` | Fetch a fork or mirror from its source now. Needs `r` and `w`. |
| `rngit-rs release URL OPERATION` | List, view, fetch, verify, create, show the latest, or delete releases. |
| `rngit-rs work URL OPERATION` | List, view, create, propose, edit, update, complete, activate, or delete work documents, or edit their permissions. |
| `rngit-rs perms URL` | Edit group or repository permissions. Needs `adm`. |

The client commands use `client_identity` in their config directory unless you pass `-i`.

### Releases

`rngit-rs release URL create 1.2.0:./dist` checks that tag `1.2.0` exists, opens `$EDITOR` for release notes, signs every file in `./dist` with an `.rsg` signature, writes a signed `manifest.rsm`, and uploads them. Add `-L` to sign and write the manifest without uploading.

`rngit-rs release URL fetch latest:all` downloads the latest release and checks every file against the signed manifest. Pass a manifest file in place of the URL to fetch updates from the same publisher later. On `fetch` and `verify`, `-s` takes the identity hash a release must be signed by; on `create`, it takes the path of a separate signing identity. `verify` checks files already on disk without connecting.

## Sign commits

`rngcs-rs` signs commits with a Reticulum identity that has its private key. Git must use SSH-format signatures with `rngcs-rs` as the program, `gpg.ssh.allowedsignersfile` must be set to any value for git to call it, and your commit email must be your identity hash:

```bash
git config --global gpg.format ssh
git config --global gpg.ssh.program rngcs-rs
git config --global gpg.ssh.allowedsignersfile none
git config --global user.signingKey ~/.rngit/client_identity
git config --global user.email 1a54d64db7e8beca6f2c6cd17b0cb479
git commit -S -m "Update the field notes"
git log --show-signature
```

A signature verifies only when it is valid and the signer's identity hash matches the commit's author email, or the tagger's for a tag. The signature carries the public key, so checking it needs no key server.

## Page node

With `serve_nomadnet = yes` in `[pages]`, the node also serves its repositories, files, commits, releases, work documents, and stats as Nomad Network pages, under the same permissions. Markdown files are converted to Micron. `rngit-rs` shows source files without syntax highlighting.

| Key in `[pages]` | Default | Meaning |
|---|---|---|
| `serve_nomadnet` | `no` | Serve the page node. |
| `unicode_icons` | `no` | Use plain Unicode icons instead of Nerd Font icons. |
| `media_conversion` | `yes` | Convert images to WebP for Nomad Network clients, using `magick`, `convert`, `gm`, `ffmpeg`, or `avconv`. Set `RNGIT_MEDIA_BACKEND` to choose one. |

Page templates are `.mu` files in the `templates` directory of the config directory. An executable template is run with the node's account each time its page is built, and its output is used.

## Security notes

- Keep `repositories_identity` private. Whoever holds it can run your node's destination.
- Fork, mirror, and sync make the node fetch from any URL a user with `c` gives it. The fetch limits bound how long that runs and how much disk it uses; there is no unlimited setting.
- Executable `.allowed` files and templates are programs the node runs; keep them owned and writable by the node's operator only.
- Block unidentified peers when the node faces a public network, and grant `c`, `w`, and `adm` to known identities only.
