import React, { useState } from "react";
import * as api from "@/app/api/get/getApi";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { Button, Group, List, ListItem, Loader, Paper, Text } from "@mantine/core";
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
  console.log("🚀 ~ Attendance ~ attendances:", attendances);
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
        <List spacing={0} size="sm" center>
          {attendances?.map((record: TAttendance) => {
            return (
              <ListItem
                w={"100%"}
                key={record.commuteIdx}
                px={"sm"}
                py={"xs"}
                // styles={{ itemWrapper: { width: "100%" }, itemLabel: { width: "100%" } }}
              >
                <Group align="center" justify="space-between" wrap="nowrap">
                  <Text c={"dimmed"} fz={"sm"}>
                    {record.leaveType}
                  </Text>
                  <Text c={"dimmed"} fz={"sm"}>
                    {record.attendance}
                  </Text>

                  <Text c={"dimmed"} fz={"sm"}>
                    {record.userName}
                  </Text>
                  <Text c={"dimmed"} fz={"sm"}>
                    {dateFormatFull(record.checkInTime)}
                  </Text>
                </Group>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default Attendance;
