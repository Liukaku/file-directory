import { ApiTree, imageFileTypes } from "@/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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
    <ul className="list-disc list-inside pl-3 bg-white">
      {nodes.map((node) => (
        <>
          <li
            id={node.id}
            key={node.id}
            className={`${
              node.type === "folder" ? `cursor-pointer` : `cursor-default`
            } text-black  border-l border-l-black border-dashed flex py-1`}
            onClick={(e) => {
              node.type === "folder" && toggleShow(node.id);
            }}
          >
            {node.type === "folder" ? (
              <Image
                className="mx-3"
                src={
                  node.children.length > 0
                    ? "/contentsFolder.png"
                    : "/emptyFolder.png"
                }
                width={20}
                height={20}
                alt=""
              />
            ) : (
              <Image
                className="mx-3"
                src={
                  node.ext && imageFileTypes.includes(node.ext)
                    ? "/fileImage.png"
                    : "/textFile.png"
                }
                width={20}
                height={20}
                alt=""
              />
            )}
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
