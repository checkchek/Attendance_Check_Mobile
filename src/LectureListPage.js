import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { getAttendanceList, getCheck } from "./utils/apis";
import { getData } from "./utils/storeData";
import { useQuery } from "react-query";
import { getLectures } from "./utils/apis";
import styled from "styled-components";
import { bioState, lectureState, locState } from "./atoms";
import { useRecoilState } from "recoil";
import { ScrollView } from "react-native-gesture-handler";

const Wrapper = styled(View)`
  flex: 1;
  padding: 15px;
`;
const Title = styled(Text)`
  font-size: 21px;
  font-weight: bold;
  overflow: hidden;
  margin-bottom: 20px;
`;
const Section = styled(View)`
  padding: 10px;
  border: 1px;
  border-radius: 15px;
  margin-top: 30px;
  margin-bottom: 50px;
`;
const LectureList = styled(View)``;
const Lecture = styled(View)`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;
const Item = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const AttendanceList = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;
`;
const Box = styled(Text)`
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  justifyContent: center;
  alignItems: center;
  background-color: ${(props) => props.color};
  color: white;
  border-radius: 10px;
  overflow: hidden;
`;
const H1 = styled(Text)`
  display: flex;
  font-size: 18px;
  margin-bottom: 15px;
`;
const H2 = styled(Text)`
  display: flex;
  font-size: 18px;
  margin-bottom: 15px;
  background-color: #1D79CC;
  width: 400px;
  color: white;
  padding: 10px;
`;
const Buttons = styled(View)`
  display: flex;
  flex-direction: row;
`;

export default function LectureListPage({ navigation }) {
  const [num, setNum] = useState();
  const {
    data: lectures,
    isLoading: lectureLoading,
    refetch: lectureRefetch,
  } = useQuery("lectures", getLectures);
  const {
    data: attendacne,
    isLoading: attendacneLoading,
    refetch: attendanceRefetch,
  } = useQuery("attendance", getAttendanceList);

  const [curLecture, setCurLecture] = useState();
  const [bioCheck, setBioCheck] = useRecoilState(bioState);
  const [locCheck, setLocCheck] = useRecoilState(locState);
  const [lectureId, setLectureId] = useRecoilState(lectureState);
  const [check, setCheck] = useState(false);

  const getWeek = (date) => {
    const currentDate = date.getTime();
    const firstDay = new Date("2023-03-02").getTime();
    const one = 84000000;
    return Math.floor((currentDate - firstDay) / one / 7) + 1;
  };
  const week = getWeek(new Date());

  useEffect(() => {
    if (
      curLecture &&
      curLecture.length !== 0 &&
      num &&
      curLecture[0].attendance[num]
    ) {
      if (curLecture[0].attendance[num][week - 1] !== -1) {
        setCheck(true);
      }
    }
  }, [curLecture, num]);

  useEffect(() => {
    // check api
    if (bioCheck && locCheck) {
      (async () => {
        const checkResult = await getCheck(num, lectureId);
        if (checkResult.result == "success") {
          setCheck(true);
          attendanceRefetch();
        } else {
          alert("출석 실패");
        }
      })();
    }
  }, [bioCheck, locCheck]);

  const valueToColor = (val) => {
    switch (val) {
      case -1:
        return "gray";
      case 0:
        return "green";
      case 1:
        return "yellow";
      case 2:
        return "red";
      default:
        return "gray";
    }
  };

  const onPressBio = async (lecture) => {
    const authResult = await LocalAuthentication.authenticateAsync();
    console.log(authResult);
    if (authResult.success) {
      alert("본인 인증 완료");
      setBioCheck(true);
    } else {
      alert("인증 실패");
    }
  };

  const onPressLoc = () => {
    navigation.navigate("QRcodescan");
  };

  useEffect(() => {
    getData("num").then((v) => {
      setNum(v);
    });
  });

  const numToDay = (num) => {
    switch (num) {
      case 1:
        return "mon";
      case 2:
        return "tue";
      case 3:
        return "wed";
      case 4:
        return "thu";
      case 5:
        return "fri";
      case 6:
        return "sat";
      case 7:
        return "sun";

      default:
        return "err";
    }
  };

  useEffect(() => {
    if (!lectures) {
      return;
    }

    const cLecture = [];
    let today = new Date();
    const day = numToDay(2);
    const time = 1530;
    // const day = numToDay(today.getDay());
    // const time = Number(
    //   String(today.getHours()) + ("0" + today.getMinutes()).slice(-2)
    // );

    lectures.lecture_list.map((lec) => {
      // 수업 요일 검사
      if (lec.days.includes(day)) {
        // 수업 시간 검사
        const startTime = Number(
          lec.startTime.split(":")[0] + lec.startTime.split(":")[1]
        );
        const endTime = Number(
          lec.endTime.split(":")[0] + lec.endTime.split(":")[1]
        );
        if (startTime <= time && time <= endTime) {
          cLecture.push(lec);
          setLectureId(lec.id);
        }
      }
    });

    setCurLecture(cLecture);
  }, [lectures]);

  return (
    <Wrapper>
      <Section style={check ? { backgroundColor: "#27ae60" } : undefined}>
        <Title>현재 진행 중인 강의</Title>
        {curLecture && curLecture.length !== 0 ? (
          curLecture.map((lecture, idx) => (
            <Item key={idx}>
              <H1>{lecture.name}</H1>
              <Buttons>
                <Button title="위치 인증" onPress={onPressLoc} />
                <Button
                  title="본인 인증"
                  onPress={() => onPressBio(lecture.name)}
                />
              </Buttons>
            </Item>
          ))
        ) : (
          <Text>현재 진행 중인 강의 없음</Text>
        )}
      </Section>
      <Section>
        <Title>내 강의 목록</Title>
        <ScrollView>
          <LectureList>
            {!lectureLoading && num
              ? lectures.lecture_list.map((lecture, idx) => (
                  <Lecture key={idx}>
                    <Item>
                      <H2>{lecture.name}</H2>
                    </Item>
                    <Item>
                      <AttendanceList>
                        {attendacneLoading
                          ? null
                          : attendacne
                              .find((atList) => atList.name === lecture.name)
                              ?.attendance[num]?.map((v, idx) => (
                                <Box color={valueToColor(v)} key={idx}>
                                  {idx + 1}
                                </Box>
                              ))}
                      </AttendanceList>
                    </Item>
                  </Lecture>
                ))
              : null}
          </LectureList>
        </ScrollView>
      </Section>
    </Wrapper>
  );
}

