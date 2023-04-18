import { ApiTree } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type GridViewProps = {
  nodes: ApiTree[];
  parentID?: string;
  updateGridViewProps: (
    nodes: ApiTree,
    id: string,
    name: string,
    action: "ADD" | "REMOVE"
  ) => void;
};

const GridView = ({ nodes, parentID, updateGridViewProps }: GridViewProps) => {
  const imageFileTypes = ["png", "jpg", "jpeg", "gif", "svg", "webp"];

  const toggleShow = (id: string, name: string) => {
    const newNodes = nodes.find((node) => node.id === id);
    if (nodes && newNodes) {
      updateGridViewProps(newNodes, id, name, "ADD");
    }
  };

  return (
    <div className="flex w-11/12 mx-auto flex-wrap border-2 bg-gray-300 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100">
      <div className="border-2 w-full m-1 bg-gray-300 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100">
        <div className="flex flex-wrap bg-white text-black justify-start">
          {nodes.map((node) => (
            <div
              id={node.id}
              key={node.id}
              className={`${
                node.type === "folder" && node.children.length
                  ? `cursor-pointer`
                  : ` cursor-default`
              } w-2/12 text-center m-2`}
              onClick={(e) => {
                node.type === "folder" &&
                  node.children.length &&
                  toggleShow(node.id, node.name);
              }}
            >
              {node.type === "folder" ? (
                <Image
                  className="mx-auto"
                  src={
                    node.children.length > 0
                      ? "/contentsFolder.png"
                      : "/emptyFolder.png"
                  }
                  width={50}
                  height={50}
                  alt=""
                />
              ) : (
                <Image
                  className="mx-auto"
                  src={
                    node.ext && imageFileTypes.includes(node.ext)
                      ? "/fileImage.png"
                      : "/textFile.png"
                  }
                  width={50}
                  height={50}
                  alt=""
                />
              )}
              {node.name}
              {node.ext && `.${node.ext}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridView;
