export interface ApiResponse {
  ext?: string;
  id: string;
  name: string;
  parent: string | null;
  type: "folder" | "file";
}

export interface ApiTree {
  id: string;
  name: string;
  parent: string | null;
  type: "folder" | "file";
  children: ApiTree[];
  ext?: string;
}

export type View = "list" | "grid";

export const imageFileTypes = ["png", "jpg", "jpeg", "gif", "svg", "webp"];

export const imageHandler = (ext: string | undefined) => {
  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "/fileImage.png";

    case "html":
      return "/fileHtml.png";

    case "doc":
    case "docx":
      return "/fileWord.png";

    case "xls":
    case "xlsx":
      return "/fileExcel.png";

    case "json":
    case "ts":
    case "js":
      return "/fileScript.png";

    default:
      return "/textFile.png";
  }
};
