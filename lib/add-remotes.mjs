import { walkRepos } from './walk-repos.mjs';

export const addRemotes = async (destinationDir, repos) => {
    await cd(destinationDir);
    await $`git init`;
    await $`git checkout -b __new-mono-branch`;
    await $`touch .gitkeep`;
    await $`git add .`;
    await $`git commit -m${'init'}`;
    await walkRepos(repos, async (repo, name) => {
        await $`git remote add ${name} ${repo}`;
    });
};
