import { getLocalRepositoryInfo } from './prepare';
import { createMergeRequest } from './createMergeRequest';
import { parseNamedArguments } from './utils/commandLine';
import config from '../config.json';
import GitlabApi from './lib/gitlabApi';

(async () => {
  const { projectName, sourceBranch } = await getLocalRepositoryInfo();
  const { title, description, draft: isDraft = true } = parseNamedArguments();

  const gitlabApiClient = new GitlabApi(config.gitlabBaseURL, config.personalAccessToken);

  createMergeRequest({
    gitlabApiClient,
    projectName,
    title,
    description,
    sourceBranch,
    targetBranch: config.targetBranch,
    approvalRules: config.approvalRules,
    isDraft: Boolean(isDraft),
  })
})()
