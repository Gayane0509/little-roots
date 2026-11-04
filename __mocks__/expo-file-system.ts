// In-memory stand-in for the native file system; `files` and `folders` let tests inspect what exists.
export const files = new Set<string>();
export const folders = new Set<string>();

type Part = string | { uri: string };
const join = (parts: Part[]) => parts.map((part) => (typeof part === 'string' ? part : part.uri)).join('/');

export class Directory {
  uri: string;
  constructor(...parts: Part[]) { this.uri = join(parts); }
  get exists() { return folders.has(this.uri) || [...files].some((file) => file.startsWith(`${this.uri}/`)); }
  create() { folders.add(this.uri); }
  delete() {
    folders.forEach((folder) => { if (folder === this.uri || folder.startsWith(`${this.uri}/`)) folders.delete(folder); });
    files.forEach((file) => { if (file.startsWith(`${this.uri}/`)) files.delete(file); });
  }
}

export class File {
  uri: string;
  constructor(...parts: Part[]) { this.uri = join(parts); }
  get exists() { return files.has(this.uri); }
  get extension() { return this.uri.match(/\.[^./]+$/)?.[0] ?? ''; }
  async copy(destination: File) { files.add(destination.uri); }
  delete() { files.delete(this.uri); }
}

export const Paths = { document: 'file:///docs' };
