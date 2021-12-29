import { walkRepos } from '../helpers/walk-repos.mjs';

export const mergeRepos = async (destinationDir, repos) => {
    await walkRepos(repos, async (repo, name) => {
        const tempBranchName = `init-monorepo-${name}`;

        await cd(destinationDir);
        await $`git checkout __new-mono-branch`;
        await $`git merge --allow-unrelated-histories ${tempBranchName} --no-commit`;
        try {
            await $`git commit -m"Merge ${name} into monorepo"`;
        } catch (e) {
            console.log(e.toString());
        }
    });
};
