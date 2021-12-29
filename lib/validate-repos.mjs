export const approveRepos = async (repos) => {
    console.log(chalk.blue(`Parsing repositories`));
    console.log(repos);
    const answer = await question('Approve? y/n');
    if (answer === 'n') {
        console.log(chalk.blue('Aborting...'));
        return false;
    } else if (answer !== 'y') {
        return await approveRepos(repos);
    }
    return true;
};
