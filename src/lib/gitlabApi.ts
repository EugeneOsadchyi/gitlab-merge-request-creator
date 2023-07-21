import fetch, { RequestInit } from 'node-fetch';

type MergeRequestParams = {
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  assigneeIds: number[];
  reviewerIds: number[];
  squash?: boolean;
  squashOnMerge?: boolean;
  removeSourceBranch?: boolean;
  isDraft?: boolean;
};

export default class GitlabApi {
  constructor(
    public gitlabBaseURL: string,
    public personalAccessToken: string,
  ) { }

  request(
    path: string,
    { params, body, ...options }: { params?: Record<string, string>, body?: string | Record<string, any>; } & Omit<RequestInit, 'body'> = {}
  ): Promise<any> {
    let url = this.gitlabBaseURL + '/v4' + path;

    const headers = {
      ...options.headers = {},
      'Authorization': `Bearer ${this.personalAccessToken}`,
      'Content-Type': 'application/json',
    };

    let queryParams = new URLSearchParams(params || {}).toString();
    if (queryParams) url += '?' + queryParams;

    const requestInit: RequestInit = {
      ...options,
      headers,
    };

    if (body) {
      requestInit.body = typeof body === 'string'
        ? body
        : JSON.stringify(body);
    }

    return fetch(url, requestInit)
      .then(async (res) => {
        return await res.json();
      });
  }

  currentUser() {
    return this.request('/user');
  }

  projects(search: string) {
    return this.request('/projects', {
      params: {
        search,
      },
    });
  }

  project(id: number) {
    return this.request(`/projects/${id}`);
  }

  projectMembers(projectId: number) {
    return this.request(`/projects/${projectId}/members`);
  }

  projectApprovalRules(projectId: number) {
    return this.request(`/projects/${projectId}/approval_rules`);
  }

  projectMergeRequests(projectId: number) {
    return this.request(`/projects/${projectId}/merge_requests`);
  }

  createMergeRequest(projectId: number, {
    title, description, sourceBranch, targetBranch, assigneeIds, reviewerIds,
    isDraft = false, squash = true, squashOnMerge = true, removeSourceBranch = true,
  }: MergeRequestParams): Promise<any> {
    return this.request(`/projects/${projectId}/merge_requests`, {
      method: 'POST',
      body: {
        'title': isDraft ? `Draft: ${title}` : title,
        'description': description,
        'source_branch': sourceBranch,
        'target_branch': targetBranch,
        'assignee_ids': assigneeIds,
        'reviewer_ids': reviewerIds,
        'squash_on_merge': squashOnMerge,
        'squash': squash,
        'remove_source_branch': removeSourceBranch,
      }
    });
  }
}
