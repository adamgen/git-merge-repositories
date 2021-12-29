export const walkRepos = async (repos, callback) => {
    for (const repo of repos) {
        const name = repo.match(/([^\/]+)\.git$/)[1];
        await callback(repo, name);
    }
}
