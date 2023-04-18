import { ApiTree } from "@/types";
import React, { useEffect, useState } from "react";

type TreeViewProps = {
  nodes: ApiTree[];
  parentID?: string;
};

const TreeView = ({ nodes }: TreeViewProps) => {
  const [show, setShow] = useState(initialState());

  function initialState() {
    const state = nodes.reduce((acc, node) => {
      if (node.type === "folder") {
        acc[node.id] = false;
      }
      return acc;
    }, {} as Record<string, boolean>);
    return state;
  }

  const toggleShow = (id: string) => {
    setShow({ ...show, [id]: !show[id] });
  };

  return (
    <ul className="list-disc list-inside ml-10">
      {nodes.map((node) => (
        <>
          <li
            id={node.id}
            key={node.id}
            className={`${
              node.type === "folder"
                ? `cursor-pointer text-red-300`
                : `text-white cursor-default`
            }`}
            onClick={(e) => {
              node.type === "folder" && toggleShow(node.id);
              // console.log(e.target?.id);
            }}
          >
            {node.name}
            {node.ext && `.${node.ext}`}
          </li>

          {node.children && node.children.length > 0 && show[node.id] && (
            <div>
              <TreeView nodes={node.children} parentID={node.id} />
            </div>
          )}
        </>
      ))}
    </ul>
  );
};

export default TreeView;
