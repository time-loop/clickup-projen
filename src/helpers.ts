/**
 * Strips out ^ and ~ characters from package names in favor of specific
 * versions.
 * @param theDeps A list of dependencies (and possibly their versions)
 * @returns A list of dependencies pinned to a version
 */
export function getPinnedDeps(theDeps: string[]): string[] {
  return theDeps.map((d) => {
    return d.replace(new RegExp(/~|\^/), '');
  });
}
