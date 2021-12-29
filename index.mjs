#!/usr/bin/env node

import 'zx/globals';
import { program } from 'commander';
import { resetDir } from './lib/reset-dir.mjs';
import { addRemotes } from './lib/add-remotes.mjs';
import { gitFetch } from './lib/git-fetch.mjs';
import { addBranchPerRepo } from './lib/add-branch-per-repo.mjs';
import { mergeRepos } from './lib/merge-repos.mjs';
import { approveRepos } from './lib/validate-repos.mjs';

program.version('0.0.1');

program
    .command('merge')
    .requiredOption('-r, --repos [string...]', 'Repository url')
    .requiredOption('-m, --monorepo-dir [string]', 'Destination directory')
    .option('-p, --packages-dir [string]', 'Packages/projects dir')
    .option('-y, --yes', 'Approve repose without asking')
    .option(
        '--reset-dir',
        'Clear the destination directory before running. Very useful for debugging.',
    )
    .description('describe')
    .action(
        async ({ repos, monorepoDir, resetDir: isResetDir, packagesDir, yes }) => {
            const pwd = (await $`pwd`).toString().trim();
            const destinationMonorepoDirDir = path.join(pwd, monorepoDir);

            if (!yes && !(await approveRepos(repos))) {
                process.exit();
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
            await addBranchPerRepo(destinationMonorepoDirDir, repos, packagesDir);
            await mergeRepos(destinationMonorepoDirDir, repos);
        },
    );

program.parse();
