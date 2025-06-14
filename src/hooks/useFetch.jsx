// src/hooks/useFetch.js
import { useEffect } from "react";
import useApi from "@/hooks/useApi";

const useFetch = (url, autoRun = true) => {
  const { request, loading, error, response } = useApi();

  useEffect(() => {
    if (autoRun && url) {
      request("get", url);
    }
  }, [url]);

  return { data: response, loading, error, refetch: () => request("get", url) };
};

export default useFetch;
