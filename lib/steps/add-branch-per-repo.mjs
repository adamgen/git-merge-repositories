import { walkRepos } from '../helpers/walk-repos.mjs';
import { chalk } from 'zx';

const mvDir = async (src, dest) => {
    const parentDirName = path.dirname(dest);
    if (!fs.existsSync(parentDirName)) {
        await $`mkdir -p ${parentDirName}`;
        console.log(chalk.green(`Make new dir ${parentDirName}`));
    }
    fs.renameSync(src, dest);
    console.log(chalk.green(`Renamed from ${src} to ${dest}`));
};

export const addBranchPerRepo = async (destinationDir, repos, packagesDir) => {
    await cd(destinationDir);
    const remotesStr = await $`git branch --remote`;
    const remotesList = remotesStr
        .toString()
        .trim()
        .split('\n')
        .map((s) => s.trim());

    await walkRepos(repos, async (repo, name) => {
        let relevantRemote;
        if (remotesList.includes(`${name}/master`)) {
            relevantRemote = `${name}/master`;
        } else if (remotesList.includes(`${name}/main`)) {
            relevantRemote = `${name}/main`;
        }

        if (!relevantRemote) {
            return console.log(
                chalk.red(
                    `Found no relevant branch (main or master) fro ${repo}`,
                ),
            );
        }
        await cd(destinationDir);

        const tempBranchName = `init-monorepo-${name}`;
        await $`git checkout __new-mono-branch`;
        await $`git checkout -b ${tempBranchName}`;
        await $`git pull ${relevantRemote.split(
            '/',
        )} --no-commit --allow-unrelated-histories`;

        const tempDir = `${destinationDir}_`;

        await $`mkdir ${tempDir}`;
        const packageDir = packagesDir
            ? path.join(tempDir, packagesDir, name)
            : path.join(tempDir, name);
        await mvDir(destinationDir, packageDir);
        await mvDir(`${packageDir}/.git`, `${tempDir}/.git`);
        await mvDir(tempDir, destinationDir);

        await cd(destinationDir);
        await $`git add -A`;
        await $`git commit -m"Change root dir for monorepo ${name}"`;
    });
};
