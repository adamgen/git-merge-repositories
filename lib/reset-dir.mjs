import rimraf from 'rimraf';

export const resetDir = async (destinationDir) => {
    try {
        await $`mkdir ${destinationDir}`;
    } catch (e) {
        if (resetDir) {
            await rimraf.sync(destinationDir);
            await rimraf.sync(`${destinationDir}_`);
            await rimraf.sync(`${destinationDir}__`);
            await $`mkdir ${destinationDir}`;
        }
    }
};
