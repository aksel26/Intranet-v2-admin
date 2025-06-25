import { dateFormatFull, dateFormatTime, dateFormatYYYYMMDD, durationTime } from "@/app/utils/dateFormat";
import { detectDevice } from "@/app/utils/detectDevice";
import { Badge, Box, Button, Checkbox, Group, Indicator, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import { memo } from "react";

export const AttendanceTable = memo(({ data, selectedRows, setSelectedRows, selectNote, selectAttendanceTime }: any) => {
  const displayAttendance = (element: any) => {
    const { leave, attendance } = element;
    if (leave.length < 1 && !attendance) {
      return "-";
    } else if (leave.length > 0) {
      return (
        <Group gap={"xs"}>
          {leave.map((item: any) => (
            <Group key={item.leaveTypeIdx} gap={4} wrap="nowrap" align="center">
              <Badge variant="light" size="sm" color="gray" radius={"sm"} key={item.leaveTypeIdx}>
                {item.leaveType}
              </Badge>
              <Text fz={10} hidden={item.confirmYN === "Y"} component="span" c={"yellow"}>
                (미)
              </Text>
            </Group>
          ))}
        </Group>
      );
    }
  };

  return data?.map((element: any, index: number) => (
    <Table.Tr fz={"xs"} key={index} bg={selectedRows.includes(element.commuteIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          size="xs"
          checked={selectedRows.includes(element.commuteIdx)}
          onChange={(event) => setSelectedRows(event.currentTarget.checked ? [...selectedRows, element.commuteIdx] : selectedRows.filter((position: any) => position !== element.commuteIdx))}
        />
      </Table.Td>
      <Table.Td w={70}>{element.userName}</Table.Td>
      <Table.Td w={55}>{element.gradeName}</Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td w={90}>{dateFormatYYYYMMDD(element.commuteDate)}</Table.Td>
      <Table.Td w={85}>{detectDevice(element.checkInLogAgent, element.checkInIpAddr)}</Table.Td>
      <Table.Td w={85}>{detectDevice(element.checkOutLogAgent, element.checkOutIpAddr)}</Table.Td>
      <Table.Td w={70}>{element.attendance || "-"}</Table.Td>
      <Table.Td w={100}>{displayAttendance(element)}</Table.Td>
      <Table.Td>
        {!element.checkInTime && !element.checkOutTime ? (
          <Button variant="subtle" color="gray" size="compact-xs" px={4} onClick={() => selectAttendanceTime(element)}>
            출근 전
          </Button>
        ) : element.checkInTime && !element.checkOutTime ? (
          <Button variant="subtle" size="compact-xs" px={4} onClick={() => selectAttendanceTime(element)} color={dayjs(element.checkInTime).isBefore(dayjs(), "day") ? "red" : undefined}>
            {`${dateFormatTime(element.checkInTime)} / 퇴근 기록 없음`}
          </Button>
        ) : (
          <Button variant="subtle" size="compact-xs" px={4} onClick={() => selectAttendanceTime(element)}>
            {`${dateFormatTime(element.checkInTime)} - ${dateFormatTime(element.checkOutTime)}`}
          </Button>
        )}
      </Table.Td>
      <Table.Td w={90}>
        <Text fz={"xs"} c={element?.attendance?.includes("조기") ? "red.5" : "black"}>
          {durationTime(element.workingMinutes)}
        </Text>
      </Table.Td>

      <Table.Td w={90}>{element.overtimeWorkingMinutes ? element.overtimeWorkingMinutes + " 분" : "-"}</Table.Td>
      <Table.Td w={65} align="center">
        {element.note || element.updateReason || element.earlyLeaveReason ? (
          <Button size="compact-xs" variant="light" color="orange" onClick={() => selectNote(element)}>
            조회
          </Button>
        ) : (
          <Button size="compact-xs" variant="light" onClick={() => selectNote(element)}>
            등록
          </Button>
        )}
      </Table.Td>
      <Table.Td w={145}>{dateFormatFull(element?.lastUpdatedAt?.time) || "-"}</Table.Td>
      <Table.Td w={145}>{dateFormatFull(element.firstUpdatedAt) || "-"}</Table.Td>
    </Table.Tr>
  ));
});
