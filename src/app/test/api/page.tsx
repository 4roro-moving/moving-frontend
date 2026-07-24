"use client";

import { useState } from "react";

import fetchInstance from "@/lib/api/fetchInstance";
import { ApiError } from "@/types/api";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const ApiTestPage = () => {
  const [method, setMethod] = useState<Method>("GET");
  const [endpoint, setEndpoint] = useState("/auth/me");
  const [bodyText, setBodyText] = useState("{}");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    setResult("");

    try {
      let data: unknown;

      if (method === "GET") {
        data = await fetchInstance.get(endpoint);
      } else if (method === "POST") {
        data = await fetchInstance.post(endpoint, JSON.parse(bodyText || "{}"));
      } else if (method === "PATCH") {
        data = await fetchInstance.patch(endpoint, JSON.parse(bodyText || "{}"));
      } else {
        data = await fetchInstance.delete(endpoint);
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      if (err instanceof ApiError) {
        setResult(
          `ApiError (status: ${err.status ?? "-"})\n${err.message}\n\ndata: ${JSON.stringify(err.data, null, 2)}`,
        );
      } else {
        setResult(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-16 p-40">
      <h1 className="text-xl font-bold">API Client 테스트 (임시)</h1>

      <div className="flex gap-8">
        <select
          value={method}
          onChange={(event) => setMethod(event.target.value as Method)}
          className="border p-8"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          value={endpoint}
          onChange={(event) => setEndpoint(event.target.value)}
          placeholder="/auth/me"
          className="flex-1 border p-8"
        />
      </div>

      {(method === "POST" || method === "PATCH") && (
        <textarea
          value={bodyText}
          onChange={(event) => setBodyText(event.target.value)}
          rows={6}
          placeholder='{"key": "value"}'
          className="border p-8 font-mono text-sm"
        />
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={isLoading}
        className="w-fit rounded bg-blue-500 px-16 py-8 text-white disabled:opacity-50"
      >
        {isLoading ? "요청 중..." : "요청 보내기"}
      </button>

      <pre className="rounded border bg-gray-50 p-16 text-sm whitespace-pre-wrap">
        {result || "결과가 여기에 표시됩니다."}
      </pre>
    </div>
  );
};

export default ApiTestPage;
