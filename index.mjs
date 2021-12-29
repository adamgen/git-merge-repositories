import 'zx/globals';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { resetDir } from './lib/reset-dir.mjs';
import { addRemotes } from './lib/add-remotes.mjs';
import { gitFetch } from './lib/git-fetch.mjs';
import { addBranchPerRepo } from './lib/add-branch-per-repo.mjs';
import { mergeRepos } from './lib/merge-repos.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program.version('0.0.1');

program
    .command('merge')
    .requiredOption('-r, --repos [string...]', 'Repository url')
    .requiredOption('-d, --dir [string]', 'Destination directory')
    .option('--reset-dir', 'Clear the destination directory before running')
    .description('describe')
    .action(async ({ repos, dir, isResetDir }) => {
        const destinationDir = path.join(__dirname, dir);

        await resetDir(destinationDir, isResetDir);
        await addRemotes(destinationDir, repos);
        await gitFetch(destinationDir, repos);
        await addBranchPerRepo(destinationDir, repos);
        await mergeRepos(destinationDir, repos);
    });

program.parse();
