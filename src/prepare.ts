import { exec, printIfErrorAndExit } from './utils/commandLine';
import { extractProjectNameFromSshRepositoryURL, removeTrailingNewline } from './utils/utility';

export async function getLocalRepositoryInfo() {
  const sourceBranch = await exec('git branch --show-current')
    .then(commandOutput => removeTrailingNewline(commandOutput.stdout))
    .catch(err => printIfErrorAndExit(err) as unknown as string);

  const projectName = await exec('git remote get-url origin')
    .then(commandOutput => extractProjectNameFromSshRepositoryURL(removeTrailingNewline(commandOutput.stdout)))
    .catch(err => printIfErrorAndExit(err) as unknown as string);

  return {
    sourceBranch,
    projectName,
  }
}
