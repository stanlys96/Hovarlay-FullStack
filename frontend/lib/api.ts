import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const baseAxios = axios.create({
  baseURL: API_BASE_URL,
});

export const fetcher = (url: string) =>
  baseAxios.get(url).then((res) => res?.data);