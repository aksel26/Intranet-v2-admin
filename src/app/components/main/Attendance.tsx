import * as api from "@/app/api/get/getApi";
import { Badge, Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TAttendance } from "@/app/type/attendance";
import { dateFormatFull } from "@/app/utils/dateFormat";
import { useRouter } from "next/navigation";
import { IconChevronRight } from "@tabler/icons-react";
const Attendance = () => {
  const [params] = useState({
    pageNo: 1,
    perPage: 50,
    sDate: dayjs().format("YYYY-MM-DD"),
    eDate: dayjs().format("YYYY-MM-DD"),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendances", params],
    queryFn: () => api.getAttendanceList(params),
  });

  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const attendances = data?.data.data.records;
    setAttendances(attendances?.filter((attendance: any) => attendance.attendance || attendance.leaveType).slice(0, 5));
  }, [data]);

  const router = useRouter();
  const movePage = () => router.push("/main/attendance");

  // Extracted components for better readability
  const LoadingView = () => (
    <Group justify="center" py={"lg"}>
      <Loader size={"sm"} />
    </Group>
  );

  const EmptyView = () => (
    <Text ta={"center"} c={"dimmed"} fz={"xs"} py={"lg"}>
      금일 근태 내역이 없어요.
    </Text>
  );

  const AttendanceItem = ({ record, index }: { record: TAttendance; index: number }) => (
    <Group key={index}>
      {record.leaveType && (
        <Badge size="md" variant="default" radius={"md"}>
          {record.leaveType}
        </Badge>
      )}
      {record.attendance && (
        <Badge size="md" variant="default" radius={"md"}>
          {record.attendance}
        </Badge>
      )}
      <Text fz={"sm"}>{record.userName}</Text>
      {!record?.leaveType?.includes("근무") && (
        <Text c={"dimmed"} fz={"sm"}>
          {record?.confirmYN === "N" ? "미승인" : "승인"}
        </Text>
      )}
      <Text c={"dimmed"} fz={"sm"}>
        {dateFormatFull(record?.checkInTime)}
      </Text>
    </Group>
  );

  const AttendanceList = () => (
    <Stack gap={"sm"} mt={"md"}>
      {attendances?.map((record: TAttendance, index: number) => (
        <AttendanceItem key={index} record={record} index={index} />
      ))}
    </Stack>
  );

  // Simplified componentBranch with early returns
  const renderContent = () => {
    if (isLoading) return <LoadingView />;
    if (attendances?.length === 0) return <EmptyView />;
    return <AttendanceList />;
  };

  return (
    <Paper shadow="lg" p="lg" radius={"lg"}>
      <Group justify="space-between">
        <Text fw={600}>금일 직원 근태 현황</Text>
        <Button variant="subtle" size="compact-xs" onClick={movePage} rightSection={<IconChevronRight size={14} />}>
          자세히 보기
        </Button>
      </Group>
      {renderContent()}
    </Paper>
  );
};

export default Attendance;
