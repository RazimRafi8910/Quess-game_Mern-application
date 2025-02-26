import { useCallback, useEffect, useState } from "react";
import getBackendURL from "../utils/getBackend";
import getHttpErrorMessage from "../utils/getHttpErrorMessage";
import { toast } from "react-toastify";

interface ResponseType {
  success: boolean,
  message?: string,
  data?:unknown
}

type GetFetchParamsType = {
  url: string,
  body?: object | null,
  method?: string,
  headers?: object
}

type ReturnData<T> = {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => void
  getPostRequest: <D>(url: string, data: D) => Promise<ResponseType | undefined>
  getFetch:({url,method,body,headers}:GetFetchParamsType)=>Promise<ResponseType | undefined>
};

const backEndUrl = getBackendURL();

export default function useFetch<T = unknown>(url?:string | null,autoFetch = true ): ReturnData<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const handleGetFetch = useCallback(async () => {
    if (!url) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${backEndUrl}${url}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok || result?.success == false) {
        throw new Error(result.message || getHttpErrorMessage(response.status));
      }

      setData(result.data);
      
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  const getPostRequest = async<D = unknown>(url: string, data: D):Promise<ResponseType | undefined> => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${backEndUrl}${url}`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body:JSON.stringify(data),
        credentials: 'include'
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || getHttpErrorMessage(response.status));
      }

      if (result.success) {
        toast.success(result.message);
        return result as ResponseType;
      } else {
        throw new Error(result.message || "Unknown Error Occured");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      }
    } finally {
      setLoading(false)
    }
  }

  const getFetch = async ({url,method = 'GET',body,headers = {}}:GetFetchParamsType) => {
    setLoading(true);
    setError(null)
    try {
      const response = await fetch(`${backEndUrl}${url}`, {
        method: method?.toUpperCase(),
        headers: {
          'Content-type': 'application/json',
          ...headers,
        },
        body:body ? JSON.stringify(body) : undefined,
        credentials: 'include'
      });

      //to store the json response
      let result;
      
      try {
        result = await response.json();
      } catch (error) {
        throw new Error(getHttpErrorMessage(response.status));
      }

      if (!response.ok) {
        console.log(response.status);
        throw new Error(result?.message || getHttpErrorMessage(response.status));
      }

      if (result.success) {
        toast.success(result.message);
        return result as ResponseType;
      } else {
        throw new Error(result?.message || "Unknown Error Occured");
      }
    } catch (error) {
      if (error instanceof Error) {        
        console.error(error);
        setError(error.message);
        toast.error(error.message);
      }
      return undefined
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoFetch) {
      handleGetFetch();
    }
  }, [handleGetFetch]);

  return { loading, data, error, refresh: handleGetFetch, getPostRequest, getFetch };
}
