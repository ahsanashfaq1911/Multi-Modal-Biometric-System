// src/hooks/useSubmit.js
import useApi from "@/hooks/useApi";

const useSubmit = () => {
  const { request, loading, error, response } = useApi();

  const submit = async (url, data, method = "post") => {
    return await request(method, url, data);
  };

  return { submit, loading, error, response };
};

export default useSubmit;
