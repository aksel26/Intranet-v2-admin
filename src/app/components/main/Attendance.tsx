import React, { useState } from "react";
import * as api from "@/app/api/get/getApi";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Group, List, ListItem, Loader, Paper, Stack, Text } from "@mantine/core";
// import styles from "@/app/styles/list.module.css";
import { useRouter } from "next/navigation";
import { TNotice } from "@/app/type/notice";
import { TAttendance } from "@/app/type/attendance";
import { dateFormatFull } from "@/app/utils/dateFormat";
const Attendance = () => {
  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 5,
    sDate: dayjs().format("YYYY-MM-DD"),
    eDate: dayjs().format("YYYY-MM-DD"),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendances", params],
    queryFn: () => api.getAttendanceList(params),
  });

  const attendances = data?.data.data.records;

  const router = useRouter();
  const movePage = () => router.push("/main/attendance");
  return (
    <Paper shadow="lg" p="lg" radius={"lg"} h={"100%"}>
      <Group justify="space-between">
        <Text fw={600}>금일 직원 근태 현황</Text>
        <Button variant="subtle" size="compact-sm" onClick={movePage}>
          자세히 보기
        </Button>
      </Group>

      {isLoading ? (
        <Group justify="center" py={"lg"}>
          <Loader size={"sm"} />
        </Group>
      ) : (
        <Stack gap={"sm"} mt={"md"}>
          {attendances?.map((record: TAttendance, index: number) => {
            return (
              <Group key={index}>
                <Badge size="md" variant="default" radius={"md"}>
                  {record.leaveType}
                </Badge>
                {record.attendance && (
                  <Badge size="md" variant="default" radius={"md"}>
                    {record.attendance}
                  </Badge>
                )}
                <Text fz={"sm"}>{record.userName}</Text>
                {!record.leaveType.includes("근무") && (
                  <Text c={"dimmed"} fz={"sm"}>
                    {record.confirmYN === "N" ? "미승인" : "승인"}
                  </Text>
                )}
                <Text c={"dimmed"} fz={"sm"}>
                  {dateFormatFull(record.checkInTime)}
                </Text>
              </Group>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};

export default Attendance;
