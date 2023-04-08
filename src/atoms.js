import { atom } from "recoil";

export const locState = atom({
  key: "location",
  default: false,
});
export const bioState = atom({
  key: "biometric",
  default: false,
});
export const lectureState = atom({
  key: "lecture",
  default: -1,
});
