import { ApiTree, imageFileTypes } from "@/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type TreeViewProps = {
  nodes: ApiTree[];
  parentID?: string;
  loading?: boolean;
};

const TreeView = ({ nodes, loading }: TreeViewProps) => {
  const [show, setShow] = useState(initialState());

  // Set initial state of folders to be closed, object structure to handle individual folder state
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
    <motion.ul
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.2,
        ease: "anticipate",
        delay: 0.0,
      }}
      className="list-disc list-inside pl-3 bg-white relative"
    >
      {nodes.map((node, i) => (
        <>
          <motion.li
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
              <div className="items-center grid">
                <Image
                  className="mx-3 object-contain"
                  src={
                    node.children.length > 0
                      ? "/contentsFolder.png"
                      : "/emptyFolder.png"
                  }
                  loading="eager"
                  width={20}
                  height={20}
                  alt=""
                />
              </div>
            ) : (
              <div className="items-center grid">
                <Image
                  className="mx-3 object-contain"
                  src={
                    node.ext && imageFileTypes.includes(node.ext)
                      ? "/fileImage.png"
                      : "/textFile.png"
                  }
                  loading="eager"
                  width={20}
                  height={20}
                  alt=""
                />
              </div>
            )}
            {node.name}
            {node.ext && `.${node.ext}`}
          </motion.li>

          {node.children && node.children.length > 0 && show[node.id] && (
            <AnimatePresence>
              <TreeView nodes={node.children} parentID={node.id} />
            </AnimatePresence>
          )}
        </>
      ))}
    </motion.ul>
  );
};

export default TreeView;
