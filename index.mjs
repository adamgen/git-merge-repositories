#!/usr/bin/env node

import 'zx/globals';
import { program } from 'commander';
import getStdin from 'get-stdin';

import { resetDir } from './lib/steps/reset-dir.mjs';
import { addRemotes } from './lib/steps/add-remotes.mjs';
import { gitFetch } from './lib/steps/git-fetch.mjs';
import { addBranchPerRepo } from './lib/steps/add-branch-per-repo.mjs';
import { mergeRepos } from './lib/steps/merge-repos.mjs';
import { approveRepos } from './lib/helpers/validate-repos.mjs';
import { isGitUrl } from './lib/helpers/is-git-url.mjs';

program.version('0.0.1');

program
    .command('merge')
    .requiredOption(
        '-m, --monorepo-dir [string]',
        "Destination directory that will contain the monorepo's git root. This directory will be deleted and re-initiated when wetting --reset-dir",
    )
    .option(
        '-r, --repos [string...]',
        'Repository url. You must either provide this, or pass stdin with valid repos.',
    )
    .option(
        '-p, --packages-dir [string]',
        "Packages/projects dir. Similar to lerna's packages directory",
    )
    .option(
        '-y, --yes',
        'Without this option you will be asked to approve after presented a list or the repositories to be merged. Note - using stdin will never prompt a dialog',
    )
    .option(
        '--reset-dir',
        'Clear the destination directory before running. Very useful for debugging.',
    )
    .description(
        `Calling this small util will merge many git repositories into a single monorepo.`,
    )
    .action(
        async ({
            repos,
            monorepoDir,
            resetDir: isResetDir,
            packagesDir,
            yes,
        }) => {
            const pwd = (await $`pwd`).toString().trim();
            const destinationMonorepoDirDir = path.join(pwd, monorepoDir);

            const stdin = (await getStdin()).trim().replace();

            if (!repos) {
                repos = stdin.split('\n').filter(isGitUrl);
            }

            if (!repos) {
                console.log(chalk.red('No repos provided.'));
                return process.exit();
            }

            if (stdin) {
                console.log(chalk.blue(`Parsing repositories`));
                console.log(repos);
            } else if (!yes) {
                const isApprove = await approveRepos(repos);
                if (!isApprove) {
                    return process.exit();
                }
            }

            if (fs.existsSync(destinationMonorepoDirDir)) {
                if (isResetDir) {
                    await resetDir(destinationMonorepoDirDir, isResetDir);
                } else {
                    throw new Error(
                        `Path exists on ${destinationMonorepoDirDir}`,
                    );
                }
            } else {
                await resetDir(destinationMonorepoDirDir, isResetDir);
            }

            await addRemotes(destinationMonorepoDirDir, repos);
            await gitFetch(destinationMonorepoDirDir, repos);
            await addBranchPerRepo(
                destinationMonorepoDirDir,
                repos,
                packagesDir,
            );
            await mergeRepos(destinationMonorepoDirDir, repos);
        },
    );

program.parse();
