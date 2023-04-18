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
