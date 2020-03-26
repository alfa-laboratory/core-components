/**
 * !!!
 * Если что-то сломается в этом скрипте CI об этом не узнает и завершиться успешно!
 * !!!
 */

/* eslint-disable no-console */
const shell = require('shelljs');
const parseGitUrl = require('git-url-parse');

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
const tempOutputDir = shell.exec('git rev-parse HEAD', execOptions).stdout.trim();
/** Current git branch */
const sourceBranch = shell.exec('git rev-parse --abbrev-ref HEAD', execOptions).stdout.trim();
/** Git remote url */
const gitUrl = shell
    .exec(`git config --get remote.${defaultConfig.gitRemote}.url`, execOptions)
    .stdout.trim();
/** Parsed git url */
const parsedGitUrl = parseGitUrl(gitUrl);
const gitPagesUrl = `https://${parsedGitUrl.owner}.github.io/${parsedGitUrl.name}`;

console.log('Publish storybook demo for github');
console.log('=> Build storybook');
shell.exec(`yarn build-storybook -o ${tempOutputDir}`, { fatal: true });

// Prepare temporary gh-pages dir
console.log('=> Prepare temporary dir');
shell.rm('-rf', `./${ghMergeDir}`);
shell.mkdir(ghMergeDir);

// Go to the temporary directory and create a *new* Git repo
shell.cd(ghMergeDir);
shell.exec('git init', execOptions);
// Inside this git repo we'll pretend to be a new user
shell.exec(`git config user.name "${defaultConfig.gitUsername}"`, execOptions);
shell.exec(`git config user.email "${defaultConfig.gitEmail}"`, execOptions);

// Disable GPG signing
shell.exec('git config commit.gpgsign false', execOptions);

// Pull gh-page file
console.log('=> Pull storybook file');
shell.exec(`git pull -f -q ${gitUrl} ${defaultConfig.targetBranch}`, execOptions);

// Merge builded storybook
console.log('=> Merge builded storybook');

shell.cp('-rf', `../${tempOutputDir}`, `./`);

if (sourceBranch === 'master') {
    shell.rm('-rf', `./master`);
    shell.mv('-f', `./${tempOutputDir}`, `./master`);
}

// The first and only commit to this new Git repo contains all the
// files present with the commit message "Deploy to GitHub Pages".
console.log(`=> Commit changes with message: ${defaultConfig.commitMessage}`);
shell.exec('git add .', execOptions);
shell.exec(`git commit -m "${defaultConfig.commitMessage}"`, execOptions);

const storybookUrl = `${gitPagesUrl}/${sourceBranch === 'master' ? 'master' : tempOutputDir}/`;

console.log(`=> Storybook deployed to: ${storybookUrl}`);

// store storybook url
shell.exec(`echo ::set-output name=storybook_url::${storybookUrl}`);
