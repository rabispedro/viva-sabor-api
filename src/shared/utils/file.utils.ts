export class FileUtils {
  static extractFileTypeFromMime(filename: string) {
    return filename.replace(/\w*\//g, '');
  }
}
