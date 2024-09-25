import { atom } from "recoil";

export const jobsList = atom<any[] | null>({
  key: "jobsList",
  default: null,
});
