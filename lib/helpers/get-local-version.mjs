import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getLocalVersion = () => {
    try {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const packageJsonPath = path.join(
            dirname(dirname(__dirname)),
            'package.json',
        );
        const packageJsonContents = fs.readJSONSync(packageJsonPath);
        return packageJsonContents.version;
    } catch (e) {
        console.log(
            chalk.red(`Can't get local npm version. Error: ${e.message}`),
        );
    }
};
