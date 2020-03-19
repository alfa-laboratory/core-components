/**
 * !!!
 * Если что-то сломается в этом скрипте CI об этом не узнает и завершиться успешно!
 * !!!
 */

/* eslint-disable no-console */
import { exec, rm, mkdir, cd, cp } from 'shelljs';
import parseGitUrl from 'git-url-parse';

/** Config for github */
const defaultConfig = {
    gitUsername: 'alfa-bot',
    gitEmail: 'ds@alfabank.ru',
    commitMessage: 'Deploy Storybook to GitHub Pages',
    gitRemote: 'origin',
    targetBranch: 'gh-pages',
};
/** Dir for merged storybook file */
const ghMergeDir = 'storybook-demo';
/** Custom option for shell.exec */
const execOptions = {
    silent: true,
    fatal: true,
};
/** Temporary dir for builded file = last git commit hash */
const tempOutputDir = exec('git rev-parse HEAD', execOptions).stdout.trim();
/** Current git branch */
const sourceBranch = exec('git rev-parse --abbrev-ref HEAD', execOptions).stdout.trim();
/** Git remote url */
const gitUrl = exec(
    `git config --get remote.${defaultConfig.gitRemote}.url`,
    execOptions,
).stdout.trim();
/** Parsed git url */
const parsedGitUrl = parseGitUrl(gitUrl);
const gitPagesUrl = `https://${parsedGitUrl.owner}.github.io/${parsedGitUrl.name}`;

console.log('Publish storybook demo for github');
console.log('=> Build storybook');
exec(`yarn build-storybook -o ${tempOutputDir}`, { fatal: true });

// Prepare temporary gh-pages dir
console.log('=> Prepare temporary dir');
rm('-rf', `./${ghMergeDir}`);
mkdir(ghMergeDir);

// Go to the temporary directory and create a *new* Git repo
cd(ghMergeDir);
exec('git init', execOptions);
// Inside this git repo we'll pretend to be a new user
exec(`git config user.name "${defaultConfig.gitUsername}"`, execOptions);
exec(`git config user.email "${defaultConfig.gitEmail}"`, execOptions);

// Disable GPG signing
exec('git config commit.gpgsign false', execOptions);

// Pull gh-page file
console.log('=> Pull storybook file');
exec(`git pull -f -q ${gitUrl} ${defaultConfig.targetBranch}`, execOptions);

// Merge builded storybook
console.log('=> Merge builded storybook');
cd('../');
if (sourceBranch === 'master') {
    cp('-rf', `./${tempOutputDir}`, `./${ghMergeDir}/master`);
} else {
    cp('-rf', `./${tempOutputDir}`, `./${ghMergeDir}`);
}
cd(ghMergeDir);

// The first and only commit to this new Git repo contains all the
// files present with the commit message "Deploy to GitHub Pages".
console.log(`=> Commit changes with message: ${defaultConfig.commitMessage}`);
exec('git add .', execOptions);
exec(`git commit -m "${defaultConfig.commitMessage}"`, execOptions);

// log output url
if (sourceBranch === 'master') {
    console.log(`=> Storybook deployed to: ${gitPagesUrl}/master/`);
} else {
    console.log(`=> Storybook deployed to: ${gitPagesUrl}/${tempOutputDir}/`);
}
