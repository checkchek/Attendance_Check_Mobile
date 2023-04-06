import { getData } from "./storeData";

export const API_URL = "http://192.168.0.190:3003";

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

export async function getCheck(num, lectureId) {
  console.log("heh", lectureId);
  if (lectureId === -1) {
    return undefined;
  }

  const getWeek = (date) => {
    const currentDate = date.getTime();
    const firstDay = new Date("2023-03-02").getTime();
    const one = 84000000;
    return Math.floor((currentDate - firstDay) / one / 7) + 1;
  };
  const now = new Date();
  const week = getWeek(now);

  try {
    const res = await fetch(
      `${API_URL}/api/check?num=${num}&lectureId=${lectureId}&week=${week}`
    );
    const jsonData = await res.json();
    console.log(jsonData);
    return jsonData;
  } catch (e) {
    console.log(e);
  }
  return undefined;
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
