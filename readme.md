# Git merge repositories

Calling this small util will merge many git repositories into a single monorepo.

## Features

1. Preserve git history
2. Read repositories list from a cli option or from stdin
3. Merge all repositories into a subfolder from the git root

## Examples

You have 2 ways of entering repositories: with a `--repos` option or with stdin.

### Pass repository list as an option

```bash
npx git-merge-repositories merge -m core -p packages --reset
-dir --repos git@github.com:adamgen/repo1.git git@github.com:adamgen/repo2.git
```

### Pass repository list from stdin

Make a repos.txt file with similar contents

```text
# Whitespace is ignored

# A repo start from the single character and has no trailing zeros
git@github.com:adamgen/adamgen-blog.git
git@github.com:adamgen/website.git

# Comments are optional
#git@bitbucket.org:zixi-dev/monitor.git
#git@bitbucket.org:zixi-dev/new-front.git
#git@bitbucket.org:zixi-dev/back.git
#git@bitbucket.org:zixi-dev/orchestrator.git

```

Then run this command:

```bash
cat repos.txt | npx git-merge-repositories merge -m core -p packages --reset-dir
```

## Options

Copy-pasted from running `npx git-merge-repositories merge --help`

```
-m, --monorepo-dir [string] Destination directory that will contain the
monorepo's git root. This directory will be deleted
and re-initiated when wetting --reset-dir

-r, --repos [string...] Repository url. You must either provide this, or pass
stdin with valid repos.

-p, --packages-dir [string] Packages/projects dir. Similar to lerna's packages
directory

-y, --yes Without this option you will be asked to approve
after presented a list or the repositories to be
merged. Note - using stdin will never prompt a dialog

--reset-dir Clear the destination directory before running. Very
useful for debugging.

-h, --help display help for command
```

## Architecture

It's a small side project, yet some thinking was made when working on it.

The `lib/steps` directory containes the actions done on the file system & git.

The `lib/helpers` directory has all other utilities that don't directly interact with the file system and can be called many times if needed.
