import React, { useEffect, useState } from "react";
import { View, Button, Text, TouchableOpacity } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { getAttendanceList, getCheck } from "./utils/apis";
import { getData } from "./utils/storeData";
import { useQuery } from "react-query";
import { getLectures } from "./utils/apis";
import styled from "styled-components";

const Wrapper = styled(View)`
  padding: 10px;
`;
const Title = styled(Text)`
  font-size: 21px;
  font-weight: bold;
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
`;
const Section = styled(View)`
  margin-bottom: 20px;
`;
const LectureList = styled(View)``;
const Lecture = styled(TouchableOpacity)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
const Item = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const AttendanceList = styled(View)`
  display: ${(props) => props.display};
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;
const Box = styled(Text)`
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: ${(props) => props.color};
  color: white;
`;
const H1 = styled(Text)`
  display: flex;
  font-size: 18px;
`;

export default function LectureListPage({ navigation }) {
  const [num, setNum] = useState();
  const { data: lectures, isLoading: lectureLoading } = useQuery(
    "lectures",
    getLectures
  );
  const { data: attendacne, isLoading: attendacneLoading } = useQuery(
    "attendance",
    getAttendanceList
  );
  const [curLecture, setCurLecture] = useState([]);

  const [isHidden, setIsHidden] = useState(true);
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
    if (authResult) {
      const res = await getCheck(num, lecture);
      if (res.result === "success") {
        alert("출석 완료");
      } else {
        alert("error");
      }
    } else {
      alert("인증 실패");
    }
  };

  console.log("Test")

 

  useEffect(() => {
    getData("num").then((v) => {
      setNum(v);
    });
  }, []);

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
        }
      }
    });

    setCurLecture(cLecture);
  }, [lectures]);
  console.log(curLecture);

  return (
    <Wrapper>
      <Section>
        <Title>현재 진행 중인 강의</Title>

        {curLecture.length !== 0 ? (
          curLecture.map((lecture, idx) => (
            <Item key={idx}>
              <H1>{lecture.name}</H1>
              <Button 
                title="위치 인증" 
                onPress={()=> navigation.navigate('QRcodescan')}
              />
              <Button
                title="본인 인증"
                onPress={() => onPressBio(lecture.name)}
              />
            </Item>
          ))
        ) : (
          <Text>현재 진행 중인 강의 없음</Text>
        )}
      </Section>
      <Section>
        <Title>내 강의 목록</Title>
        <LectureList>
          {lectureLoading
            ? null
            : lectures.lecture_list.map((lecture, idx) => (
                <Lecture key={idx}>
                  <Item>
                    <H1>{lecture.name}</H1>
                  </Item>
                  <Item>
                    <AttendanceList>
                      {attendacneLoading
                        ? null
                        : attendacne.result[lecture.name]?.map((v, idx) => (
                            <Box key={idx} color={valueToColor(v)}>
                              {idx + 1}
                            </Box>
                          ))}
                    </AttendanceList>
                  </Item>
                </Lecture>
              ))}
        </LectureList>
      </Section>
    </Wrapper>
  );
}
