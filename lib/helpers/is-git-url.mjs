// Credit https://github.com/jonschlinkert/is-git-url/blob/master/index.js

export const isGitUrl = (str) => {
    const regex =
        /^(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
    return regex.test(str);
};
