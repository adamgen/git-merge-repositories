import axios from 'axios';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const validateNpmVersion = async (str) => {
    try {
        const response = await axios.get(
            'https://registry.npmjs.org/git-merge-repositories',
        );
        const remoteLatest = response.data['dist-tags'].latest;

        const __dirname = dirname(fileURLToPath(import.meta.url));
        const packageJsonPath = path.join(
            dirname(dirname(__dirname)),
            'package.json',
        );
        const packageJsonContents = fs.readJSONSync(packageJsonPath);
        const packageJsonVersion = packageJsonContents.version;
        if (packageJsonVersion !== remoteLatest) {
            console.log(chalk.yellow('Newer version available!'));
        }
    } catch (e) {
        console.log(
            chalk.red(`Can't validate npm version. Error: ${e.message}`),
        );
    }
};
