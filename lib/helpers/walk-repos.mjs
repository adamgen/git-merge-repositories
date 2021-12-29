export const walkRepos = async (repos, callback) => {
    for (const repo of repos) {
        const matches = repo.match(/([^\/]+)\.git$/);
        let name;
        try {
            name = matches[1];
        } catch (e) {
            throw new Error(`Can't parse repo name ${repo}`);
        }
        await callback(repo, name);
    }
};
