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
    .requiredOption('-d, --dir [string]', 'Destination directory')
    .option(
        '--reset-dir',
        'Clear the destination directory before running. Very useful for debugging.',
    )
    .description('describe')
    .action(async ({ repos, dir, resetDir: isResetDir }) => {
        const pwd = (await $`pwd`).toString().trim();
        const destinationDir = path.join(pwd, dir);

        if (!(await approveRepos(repos))) {
            process.exit();
        }

        if (fs.existsSync(destinationDir)) {
            if (isResetDir) {
                await resetDir(destinationDir, isResetDir);
            } else {
                throw new Error(`Path exists on ${destinationDir}`);
            }
        } else {
            await resetDir(destinationDir, isResetDir);
        }

        await addRemotes(destinationDir, repos);
        await gitFetch(destinationDir, repos);
        await addBranchPerRepo(destinationDir, repos);
        await mergeRepos(destinationDir, repos);
    });

program.parse();
