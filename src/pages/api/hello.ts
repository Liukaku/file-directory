// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiResponse } from "@/util";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const funcT = async (): Promise<ApiResponse> => {
    const response = await fetch("https://dev.test.sega.co.uk/api/list", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "x-secret-api-key": `${process.env.API_KEY}`,
      },
    });
    const jsonData = await response.json();
    return jsonData;
  };
  funcT().then((response) => {
    res.status(200).json(response);
  });
}
