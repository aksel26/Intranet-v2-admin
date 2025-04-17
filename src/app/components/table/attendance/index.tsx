import { dateFormatTime, dateFormatYYYYMMDD, durationTime } from "@/app/utils/dateFormat";
import { detectDevice } from "@/app/utils/detectDevice";
import { Button, Checkbox, Table, Text } from "@mantine/core";
import { memo } from "react";

export const AttendanceTable = memo(({ data, selectedRows, setSelectedRows, selectNote, selectAttendanceTime, selectAttachment }: any) => {
  return data?.map((element: any, index: number) => (
    <Table.Tr fz={"xs"} key={index} bg={selectedRows.includes(element.commuteIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          size="xs"
          checked={selectedRows.includes(element.commuteIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked ? [...selectedRows, element.commuteIdx] : selectedRows.filter((position: any) => position !== element.commuteIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td>{dateFormatYYYYMMDD(element.checkInTime)}</Table.Td>
      <Table.Td>{detectDevice(element.checkInLogAgent, element.checkInIpAddr)}</Table.Td>
      <Table.Td>{detectDevice(element.checkOutLogAgent, element.checkOutIpAddr)}</Table.Td>
      <Table.Td>{element.leaveType}</Table.Td>
      <Table.Td>{element.element || "-"}</Table.Td>
      <Table.Td>
        <Button variant="subtle" size="compact-xs" px={4} onClick={() => selectAttendanceTime(element)}>
          {`${dateFormatTime(element.checkInTime)} - ${dateFormatTime(element.checkOutTime)}`}
        </Button>
      </Table.Td>
      <Table.Td>{durationTime(element.workingMinutes)}</Table.Td>

      <Table.Td>{element.overtimeWorkingMinutes ? element.overtimeWorkingMinutes + " 분" : "-"}</Table.Td>
      <Table.Td align="center">
        {element.note ? (
          <Button size="compact-xs" variant="light" color="orange" onClick={() => selectNote(element)}>
            조회
          </Button>
        ) : (
          <Button size="compact-xs" variant="light" onClick={() => selectNote(element)}>
            등록
          </Button>
        )}
      </Table.Td>
      <Table.Td>
        {element.imageUrl ? (
          <Button onClick={() => selectAttachment(element)} size="compact-xs" variant="light">
            조회
          </Button>
        ) : (
          <Text c={"dimmed"} fz={"xs"}>
            없음
          </Text>
        )}
      </Table.Td>
      <Table.Td>{dateFormatYYYYMMDD(element.updatedAt)}</Table.Td>
      <Table.Td>{dateFormatYYYYMMDD(element.createdAt)}</Table.Td>
    </Table.Tr>
  ));
});
