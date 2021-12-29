export const walkRepos = async (repos, callback) => {
    for (const repo of repos) {
        const matches = repo.match(/([^\/]+)\.git$/);
        try {
            const name = matches[1];
            await callback(repo, name);
        } catch (e) {
            throw new Error(`Can't parse repo name ${repo}`);
        }
    }
};
