// import Image from "next/image";
// import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ApiResponse, ApiTree, View } from "@/types";
import TreeView from "@/components/TreeView";
import GridView from "@/components/GridView";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<ApiTree[]>([]);
  const [toggleView, setToggleView] = useState<View>("list");
  const [gridViewProps, setGridViewProps] = useState<ApiTree[]>([]);
  const [parentIds, setParentIds] = useState<Record<string, string>[]>([
    { name: "Home", id: "a1" },
  ]);

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
    <main>
      <div className="md:w-4/5 w-10/12 mt-20 mx-auto border-2 pb-10 bg-gray-300 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100 shadow-xl">
        <div className="p-1 text-xl text-white mb-5 headerBarGrey leading-none bg-zinc-300 border-t-zinc-200 border-r-zinc-200 border-l-zinc-400 border-b-zinc-400">
          <h1>File Explorer</h1>
        </div>
        {toggleView === "list" ? (
          <>
            <div className="my-3 px-3  py-1 h-auto w-10/12 mx-auto bg-white  duration-100 text-black border-2 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100">
              {parentIds.map((id, n) => (
                <span key={id.id} className="py-1 h-auto ">
                  Home
                </span>
              ))}
            </div>
            <div className="flex w-11/12 mx-auto flex-wrap border-2 bg-gray-300 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100">
              <div className="border-2 w-full m-1 bg-gray-300 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100 max-h-96 overflow-scroll">
                <TreeView nodes={data} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="my-3 px-3  py-1 h-auto w-11/12 mx-auto bg-white  duration-100 text-black border-2 border-t-gray-500 border-r-gray-500 border-l-gray-100 border-b-gray-100 ">
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
            <GridView
              nodes={gridViewProps}
              updateGridViewProps={updateGridViewProps}
            />
          </>
        )}
      </div>
    </main>
  );
}
