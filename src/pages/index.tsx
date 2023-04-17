import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { ApiResponse, ApiTree } from "@/types";

export default function Home() {
  const [data, setData] = useState<ApiTree[]>([]);

  useEffect(() => {
    callHelloApiRoute();
  }, []);

  const callHelloApiRoute = async () => {
    const res = await fetch("/api/hello");
    const data: ApiResponse[] = await res.json();

    const convertToTree = (data: ApiResponse[]): ApiTree[] => {
      const map: Record<string, ApiTree> = {};
      data.forEach((item) => (map[item.id] = { ...item, children: [] }));
      const tree: ApiTree[] = [];
      data.forEach((item) => {
        if (item.parent) {
          map[item.parent].children.push(map[item.id]);
        } else {
          tree.push(map[item.id]);
        }
      });
      return tree;
    };
    console.log(convertToTree(data));
    setData(convertToTree(data));
  };

  const renderTree = (nodes: ApiTree[]) => (
    <ul className="list-disc list-inside ml-10">
      {nodes.map((node) => (
        <li key={node.id}>
          {node.name}
          {node.children &&
            node.children.length > 0 &&
            renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <main>
      <div>{renderTree(data)}</div>
    </main>
  );
}
