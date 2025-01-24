"use client";
import * as api from "@/app/api/get/getApi";
import DeleteAttendance from "@/app/components/attendance/DeleteAttendance";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { ATTENDANCE } from "@/app/enums/breadcrumbs";
import { ATTENDANCE_HEADER } from "@/app/enums/tableHeader";
import { dateFormatTime, dateFormatYYYYMMDD } from "@/app/utils/dateFormat";
import notification from "@/app/utils/notification";
import { ActionIcon, Button, Checkbox, Divider, Flex, Group, Modal, ScrollArea, Select, Stack, Table, Text, TextInput } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconCalendar from "/public/icons/calendar.svg";
import IconClock from "/public/icons/clock.svg";
import IconLink from "/public/icons/external-link.svg";
import IconRefresh from "/public/icons/refresh.svg";
import ModifyNote from "@/app/components/attendance/ModifyNote";
function page() {
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModify, { open: openModify, close: closeModify }] = useDisclosure(false);
  const [openedModifyNote, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [openedDeleteAttendance, { open: openDeleteAttendance, close: closeDeleteAttendance }] = useDisclosure(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedRowsDetail, setselectedRowsDetail] = useState();

  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 20,
    sDate: dayjs().format("YYYY-MM-DD"),
    eDate: dayjs().format("YYYY-MM-DD"),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendances", params],
    queryFn: () => api.getAttendanceList(params),
  });

  useEffect(() => {
    setAttendanceList(data?.data.data.records);
  }, [data]);

  const router = useRouter();
  const moveDetail = () => {
    router.push("/main/attendance/vacation/12");
  };

  const deleteAttendance = () => {
    if (selectedRows.length < 1)
      notification({
        color: "yellow",
        title: "내역 삭제",
        message: "대상 내역을 1개 이상을 선택해 주세요.",
      });
    else openDeleteAttendance();
  };
  const queyrClient = useQueryClient();
  const refresh = async () => {
    await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
  };

  const selectNote = (row: any) => {
    console.log("🚀 ~ selectNote ~ row:", row);
    setselectedRowsDetail(row);
    openModifyNote();
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={ATTENDANCE} />
      <Group justify="space-between" my={"md"} align="center">
        <Group>
          <DatePickerInput
            valueFormat="YYYY-MM-DD"
            firstDayOfWeek={0}
            type="range"
            locale="ko"
            allowSingleDateInRange
            variant="unstyled"
            leftSection={<IconCalendar />}
            placeholder="조회하실 기간을 선택해 주세요."
            size="sm"
            styles={{
              input: {
                fontSize: "var(--mantine-font-size-md)",
                fontWeight: 700,
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
            // value={value}
            // onChange={selectDateRange}
            clearable
          />
          <ActionIcon variant="light" size={"lg"} onClick={refresh}>
            <IconRefresh />
          </ActionIcon>
        </Group>

        <Group>
          <Button size="sm" radius="md">
            다운로드
          </Button>
          <Button size="sm" radius="md" variant="light" color="red" onClick={deleteAttendance}>
            내역 삭제
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={attendanceList?.length < 1 ? false : true} stickyHeader highlightOnHover={attendanceList?.length < 1 ? false : true}>
          <TableHeader columns={ATTENDANCE_HEADER} />
          <TableBody data={attendanceList} columns={ATTENDANCE_HEADER}>
            {attendanceList?.map((attendance: any, index: number) => (
              <Table.Tr key={index} bg={selectedRows.includes(attendance.commuteIdx) ? "var(--mantine-color-blue-light)" : undefined}>
                <Table.Td>
                  <Checkbox
                    aria-label="Select row"
                    size="xs"
                    checked={selectedRows.includes(attendance.commuteIdx)}
                    onChange={(event) =>
                      setSelectedRows(
                        event.currentTarget.checked
                          ? [...selectedRows, attendance.commuteIdx]
                          : selectedRows.filter((position) => position !== attendance.commuteIdx)
                      )
                    }
                  />
                </Table.Td>
                <Table.Td>{attendance.id}</Table.Td>
                <Table.Td>{attendance.gradeName}</Table.Td>
                <Table.Td>{attendance.userName}</Table.Td>
                <Table.Td>{attendance.teamName}</Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.checkInTime)}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={4} onClick={open}>
                    {dateFormatTime(attendance.checkInTime)}
                  </Button>
                </Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={8}>
                    {dateFormatTime(attendance.checkOutTime)}
                  </Button>
                </Table.Td>
                <Table.Td>{attendance.workHours || "-"}</Table.Td>
                <Table.Td>{attendance.overtimeWorkingMinutes || "-"}</Table.Td>
                <Table.Td>{attendance.lateStatus}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={8} rightSection={<IconLink strokeWidth="1.3" />} onClick={moveDetail}>
                    {attendance.attendance}
                  </Button>
                </Table.Td>
                <Table.Td>{attendance.earlyLeaveReason || "-"}</Table.Td>
                <Table.Td>{attendance.checkInDeviceType}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={8} onClick={() => selectNote(attendance)}>
                    {attendance.note || "-"}
                  </Button>
                </Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.updatedAt)}</Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <Modal opened={opened} onClose={close} title="출근시간 수정" centered>
        <Stack gap="md">
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              등록일시
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33 09:22:11
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              대상 날짜
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33 09:30:11
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              성명
            </Text>
            <Text fw={600} fz={"sm"}>
              이철호
            </Text>
          </Group>

          <TimeInput leftSection={<IconClock />} withSeconds label="변경 시간" />
          <Group wrap="nowrap">
            <Button fullWidth size="sm" variant="light">
              수정
            </Button>
            <Button fullWidth size="sm" color="gray" onClick={close}>
              닫기
            </Button>
          </Group>
        </Stack>
        {/* Modal content */}
      </Modal>

      <Modal opened={openedModify} onClose={closeModify} title="근태 정보 수정" centered>
        <Stack gap="md">
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              등록일시
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33 09:22:11
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              대상 날짜
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              성명
            </Text>
            <Text fw={600} fz={"sm"}>
              이철호
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              근태
            </Text>
            <Text fw={600} fz={"sm"}>
              병가
            </Text>
          </Group>

          <Divider />

          <Select
            label="근태 선택"
            placeholder="변경할 근태 종류를 선택해 주세요."
            data={["연차", "반차", "반반차", "병가", "보건휴가", "경조휴무", "특별휴무"]}
          />

          <TextInput
            label="근태 수정사유 입력"
            placeholder="근태 수정 사유를 입력해 주세요."
            // inputWrapperOrder={['label', 'error', 'input', 'description']}
          />
          <Group wrap="nowrap">
            <Button fullWidth size="sm" variant="light">
              수정
            </Button>
            <Button fullWidth size="sm" color="gray" onClick={closeModify}>
              닫기
            </Button>
          </Group>
        </Stack>
        {/* Modal content */}
      </Modal>
      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={openedModifyNote} selectedRows={selectedRowsDetail} />

      <DeleteAttendance openedDeleteAttendance={openedDeleteAttendance} closeDeleteAttendance={closeDeleteAttendance} selectedRows={selectedRows} />
    </Flex>
  );
}

export default page;
