import { walkRepos } from '../helpers/walk-repos.mjs';

export const gitFetch = async (destinationDir, repos) => {
    await cd(destinationDir);
    await walkRepos(repos, async (repo, name) => {
        await $`git fetch ${name}`;
    });
};
