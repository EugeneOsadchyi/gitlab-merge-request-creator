import { exec, printIfErrorAndExit } from './utils/commandLine';
import { extractProjectNameFromSshRepositoryURL, removeTrailingNewline } from './utils/utility';

export async function getLocalRepositoryInfo() {
  const sourceBranch = await exec('git branch --show-current')
    .then(commandOutput => {
      printIfErrorAndExit(commandOutput, -1);
      return removeTrailingNewline(commandOutput.stdout);
    });

  const projectName = await exec('git remote get-url origin')
    .then(commandOutput => {
      printIfErrorAndExit(commandOutput, -2);
      return extractProjectNameFromSshRepositoryURL(removeTrailingNewline(commandOutput.stdout));
    });

  return {
    sourceBranch,
    projectName,
  }
}
