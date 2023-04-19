import { ApiTree, imageFileTypes } from "@/types";
import { motion } from "framer-motion";
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
  const toggleShow = (id: string, name: string) => {
    const newNodes = nodes.find((node) => node.id === id);
    if (nodes && newNodes) {
      updateGridViewProps(newNodes, id, name, "ADD");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
        delay: 0,
      }}
      className="grid-cols-2 grid md:grid-cols-6 bg-white text-black md:justify-start justify-evenly max-h-96 overflow-y-scroll overflow-x-hidden"
    >
      {nodes.map((node) => (
        <div
          id={node.id}
          key={node.id}
          className={`${
            node.type === "folder" && node.children.length
              ? `cursor-pointer hover:underline hover:bg-zinc-100 active:bg-zinc-200 duration-100 ease-in-out`
              : ` cursor-default`
          } w-full md:w-fulltext-center  break-word items-center grid text-center`}
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
          <span className="w-10/12 mx-auto">
            {node.name}
            {node.ext && `.${node.ext}`}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

export default GridView;
