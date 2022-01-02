import axios from 'axios';
import { getLocalVersion } from './get-local-version.mjs';

export const validateNpmVersion = async (str) => {
    try {
        const response = await axios.get(
            'https://registry.npmjs.org/git-merge-repositories',
        );
        const remoteLatest = response.data['dist-tags'].latest;

        const packageJsonVersion = getLocalVersion();
        if (packageJsonVersion !== remoteLatest) {
            console.log(chalk.yellow('Newer version available!'));
        }
    } catch (e) {
        console.log(
            chalk.red(`Can't validate npm version. Error: ${e.message}`),
        );
    }
};
