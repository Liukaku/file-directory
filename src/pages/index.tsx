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
  const [toggleView, setToggleView] = useState<View>("list");
  const [gridViewProps, setGridViewProps] = useState<ApiTree[]>([]);
  const [parentIds, setParentIds] = useState<Record<string, string>[]>([
    { name: "Home", id: "a1" },
  ]);
  const loadingText = "Loading...";

  useEffect(() => {
    callHelloApiRoute();
    window.addEventListener("focus", (e) => {
      callHelloApiRoute();
    });
    const setInterValCall = setInterval(() => {
      callHelloApiRoute();
    }, 30000);
    return () => {
      window.removeEventListener("focus", (e) => {
        callHelloApiRoute();
      });
      clearInterval(setInterValCall);
    };
  }, []);

  // Call the API route and set the response to the data state
  const callHelloApiRoute = async () => {
    const res = await fetch("/api/hello");
    const data: ApiResponse[] = await res.json();

    // convert the flat array to a tree structure for easier rendering
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
    setData(convertToTree(data));
    setGridViewProps(convertToTree(data));
    setParentIds([{ name: "Home", id: "a1" }]);
  };

  // Update the grid view props when a folder is clicked
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

  // Update the grid view props when the nav bar is clicked
  const navBarClick = (id: string, n: number) => {
    if (n + 1 === parentIds.length) return;

    // find the target node in the tree
    const newNodes = (nodes: ApiTree[], id: string): ApiTree | undefined => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          return nodes[i];
        } else if (nodes[i].children && nodes[i].children.length > 0) {
          const result = newNodes(nodes[i].children, id);
          if (result) {
            return result;
          }
        }
      }
      return undefined;
    };
    const newDoesResult = newNodes(data, id);
    if (data && newDoesResult && id !== "a1") {
      updateGridViewProps(newDoesResult, id, "Home", "REMOVE");
    } else {
      setGridViewProps(data);
      setParentIds([{ name: "Home", id: "a1" }]);
    }
  };

  return (
    <main className="">
      <div className="md:w-2/5 w-10/12 mt-16 mx-auto border-2 pb-10 bg-gray-300 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100 shadow-xl">
        <div className="p-1 text-xl text-white mb-5 headerBarGrey leading-none bg-zinc-300 border-t-zinc-200 border-r-zinc-200 border-l-zinc-400 border-b-zinc-400">
          <h1>File Explorer</h1>
        </div>
        <>
          <div className="flex mx-auto w-11/12">
            <div className="my-3 px-3 mr-1 py-1 h-auto w-full bg-white  duration-100 text-black border-2 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100">
              {toggleView === "list" ? (
                <span key={1} className="py-1 h-auto border border-white  ">
                  Home
                </span>
              ) : (
                parentIds.map((id, n) => (
                  <span
                    key={id.id}
                    className="cursor-pointer hover:bg-teal-100 border border-white hover:border-teal-400 active:bg-teal-200 duration-200 ease-in-out py-1 h-auto "
                    onClick={() => {
                      navBarClick(id.id, n);
                    }}
                  >
                    {id.name}
                    {n + 1 !== parentIds.length && " / "}
                  </span>
                ))
              )}
            </div>
            <Toggle setToggleView={setToggleView} toggleView={toggleView} />
          </div>
          <div className="flex w-11/12 mx-auto flex-wrap border-2 bg-gray-300 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100">
            <div className="border-2 w-full m-1 bg-gray-300 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100 max-h-96 overflow-y-scroll overflow-x-hidden">
              <div className="py-1 bg-white">
                <AnimatePresence>
                  {data && data.length > 0 ? (
                    toggleView === "list" ? (
                      <AnimatePresence>
                        <TreeView nodes={data} />
                      </AnimatePresence>
                    ) : (
                      <GridView
                        nodes={gridViewProps}
                        updateGridViewProps={updateGridViewProps}
                      />
                    )
                  ) : (
                    <motion.div
                      className="1/12 mx-auto"
                      key={1}
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: 0,
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
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      </div>
    </main>
  );
}
