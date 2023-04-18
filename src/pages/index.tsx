// import Image from "next/image";
// import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ApiResponse, ApiTree, View } from "@/types";
import Image from "next/image";
import TreeView from "@/components/TreeView";
import GridView from "@/components/GridView";
import Toggle from "@/components/Toggle";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<ApiTree[]>([]);
  const [toggleView, setToggleView] = useState<View>("grid");
  const [gridViewProps, setGridViewProps] = useState<ApiTree[]>([]);
  const [parentIds, setParentIds] = useState<Record<string, string>[]>([
    { name: "Home", id: "a1" },
  ]);
  const loadingText = "Loading...";

  useEffect(() => {
    callHelloApiRoute();
    // window.addEventListener("focus", (e) => {
    //   callHelloApiRoute();
    // });
    // const setInterValCall = setInterval(() => {
    //   callHelloApiRoute();
    // }, 30000);
    // return () => {
    //   window.removeEventListener("focus", (e) => {
    //     callHelloApiRoute();
    //   });
    //   clearInterval(setInterValCall);
    // };
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
    setGridViewProps(convertToTree(data));
    setParentIds([{ name: "Home", id: "a1" }]);
  };

  const updateGridViewProps = (
    nodes: ApiTree,
    id: string,
    name: string,
    action: "ADD" | "REMOVE"
  ) => {
    setGridViewProps(nodes.children);
    if (action === "ADD") {
      setParentIds([...parentIds, { name: name, id: id }]);
    } else {
      const newIds = parentIds;
      const itemToRemoveIndex = parentIds.map((val) => val.id).indexOf(id) + 1;
      newIds.splice(itemToRemoveIndex, 1);
      setParentIds(newIds);
    }
  };

  const renderTree = (nodes: ApiTree[]) => (
    <ul className="list-disc list-inside ml-10">
      {nodes.map((node) => (
        <li key={node.id}>
          {node.name}
          {node.ext && `.${node.ext}`}
          {node.children &&
            node.children.length > 0 &&
            renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  const navBarClick = (id: string) => {
    const newNodes = data.find((node) => node.id === id);
    if (data && newNodes && id !== "a1") {
      updateGridViewProps(newNodes, id, "Home", "REMOVE");
    } else {
      setGridViewProps(data);
      setParentIds([{ name: "Home", id: "a1" }]);
    }
  };

  return (
    <main className="">
      <div className="md:w-4/5 w-10/12 mt-20 mx-auto border-2 pb-10 bg-gray-300 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100 shadow-xl">
        <div className="p-1 text-xl text-white mb-5 headerBarGrey leading-none bg-zinc-300 border-t-zinc-200 border-r-zinc-200 border-l-zinc-400 border-b-zinc-400">
          <h1>File Explorer</h1>
        </div>
        {data && data.length > 0 ? (
          toggleView === "list" ? (
            <>
              <div className="flex mx-auto w-11/12">
                <div className="my-3 px-3 mr-1 py-1 h-auto w-full bg-white  duration-100 text-black border-2 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100">
                  <span key={1} className="py-1 h-auto ">
                    Home
                  </span>
                </div>
                <Toggle setToggleView={setToggleView} toggleView={toggleView} />
              </div>
              <div className="flex w-11/12 mx-auto flex-wrap border-2 bg-gray-300 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100">
                <div className="border-2 w-full m-1 bg-gray-300 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100 max-h-96 overflow-scroll">
                  <div className="py-1 bg-white">
                    <AnimatePresence>
                      <TreeView nodes={data} />
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex mx-auto w-11/12">
                <div className="my-3 px-3 mr-1 py-1 h-auto w-full bg-white  duration-100 text-black border-2 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100 ">
                  {parentIds.map((id, n) => (
                    <span
                      key={id.id}
                      className="cursor-pointer hover:bg-cyan-100 py-1 h-auto "
                      onClick={() => {
                        navBarClick(id.id);
                      }}
                    >
                      {id.name}
                      {n + 1 !== parentIds.length && " / "}
                    </span>
                  ))}
                </div>
                <Toggle setToggleView={setToggleView} toggleView={toggleView} />
              </div>
              <GridView
                nodes={gridViewProps}
                updateGridViewProps={updateGridViewProps}
              />
            </>
          )
        ) : (
          <div className="">
            <div className="border-2 bg-white w-10/12 mx-auto m-1 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100">
              <div className="my-10">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{
                      duration: 0.3,
                      ease: "anticipate",
                      delay: 0.5,
                    }}
                  >
                    <Image
                      className="mx-auto"
                      src={"/sonic-running.gif"}
                      height={50}
                      width={50}
                      alt={""}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="text-black w-full text-center flex">
                  <div className="mx-auto">
                    <AnimatePresence>
                      <ul className="flex list-none mt-4">
                        {loadingText.split("").map((char, i) => {
                          return (
                            <motion.li
                              className="mx-1"
                              initial={{ y: -10 }}
                              animate={{ y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                duration: 0.3,
                                ease: "anticipate",
                                delay: 0 + i / 10,
                                repeat: Infinity,
                                repeatDelay: 2 + i / 30,
                              }}
                            >
                              {char}
                            </motion.li>
                          );
                        })}
                      </ul>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
