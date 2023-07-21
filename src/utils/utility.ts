export function extractProjectNameFromSshRepositoryURL(str: string) {
  const [, projectName] = str.match(/\/([^/]+)\.git$/) || [];
  return projectName;
}

export function removeTrailingNewline(str: string) {
  return str.replace(/\n$/, '');
}
