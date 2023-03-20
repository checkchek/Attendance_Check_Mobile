import { getData } from "./storeData";

export const API_URL = "http://172.20.10.14:3003";

export async function getLectures() {
  const num = await getData("num");
  const res = await fetch(`${API_URL}/api/lectureList?num=${num}`);

  return res.json();
}

export async function postLogin(id, pw) {
  const result = await (
    await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        pw,
      }),
    })
  ).json();

  return result;
}

export async function getCheck(num, lecture) {
  const res = await (
    await fetch(`${API_URL}/api/check?num=${num}&lecture=${lecture}&week=1`)
  ).json();

  return res;
}

export async function getAttendanceList() {
  const num = await getData("num");

  const res = await fetch(`${API_URL}/api/attendance/${num}`);
  return res.json();
}

export async function getDataCheck(code, lectureId) {
  const res = await fetch(
    `${API_URL}/api/qr/auth?code=${code}&lectureId=${lectureId}`
  );
  const jsonData = await res.json();
  return jsonData;
}
1;
