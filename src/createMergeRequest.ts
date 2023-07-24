import GitlabApi from './lib/gitlabApi';

async function main({
  gitlabApiClient,
  projectName,
  approvalRules,
  title,
  description,
  sourceBranch,
  targetBranch,
  isDraft = true,
}: {
  gitlabApiClient: GitlabApi;
  projectName: string;
  approvalRules: string[];
  title: string;
  description?: string;
  sourceBranch: string;
  targetBranch: string;
  isDraft?: boolean;
}) {
  const project = await getProjectByName(gitlabApiClient, projectName);
  const reviewerIds = await getMergeRequestReviewerIds(gitlabApiClient, project.id, approvalRules);
  const assigneeIds = await getMergeRequestAssigneeIds(gitlabApiClient);

  const mergeRequest = await createMergeRequest(gitlabApiClient, {
    projectId: project.id,
    title,
    description: description || project['merge_requests_template'] || '',
    assigneeIds,
    reviewerIds,
    sourceBranch,
    targetBranch,
    isDraft,
  });

  if (mergeRequest.message) {
    console.error(mergeRequest);
    process.exit(1);
  }

  console.log(mergeRequest.web_url);
}

async function getProjectByName(client: GitlabApi, projectName: string): Promise<any> {
  const projects = await client.projects(projectName);
  const project = await getProject(client, projects[0].id);
  return project;
}

async function getProject(client: GitlabApi, id: number) {
  const project = await client.project(id);
  return project;
}

async function getEligibleApproverIds(client: GitlabApi, projectId: number, ruleName: string): Promise<number[]> {
  const rules = await client.projectApprovalRules(projectId);
  const rule = rules.find((r: { name: string; }) => r.name == ruleName);

  if (!rule) throw new Error(`Project rule '${ruleName}' was not found`);

  return rule['eligible_approvers'].map((app: { id: number; }) => app.id);
}

async function getMergeRequestReviewerIds(client: GitlabApi, projectId: number, approvalRules: string[]): Promise<number[]> {
  const currentUser = await client.currentUser();
  const eligibleApprovers = await Promise.all(
    approvalRules.map(rule => getEligibleApproverIds(client, projectId, rule)
  ))
    .then(results => ([] as number[]).concat.apply([], results))
    .then(results => Array.from(new Set(results)));

  return eligibleApprovers.filter((id: number) => id !== currentUser.id);
}

async function getMergeRequestAssigneeIds(client: GitlabApi): Promise<number[]> {
  const currentUser = await client.currentUser();
  return [currentUser.id];
}

async function createMergeRequest(
  client: GitlabApi,
  {
    projectId,
    title,
    description,
    assigneeIds,
    reviewerIds,
    sourceBranch,
    targetBranch,
    isDraft = true,
  }: {
    projectId: number;
    title: string;
    description: string;
    assigneeIds: number[];
    reviewerIds: number[];
    sourceBranch: string;
    targetBranch: string;
    isDraft: boolean;
  },
) {
  const mergeRequest = await client.createMergeRequest(projectId, {
    title,
    description,
    sourceBranch,
    targetBranch,
    assigneeIds,
    reviewerIds,
    isDraft,
  });

  return mergeRequest;
}

export {
  main as createMergeRequest,
}
