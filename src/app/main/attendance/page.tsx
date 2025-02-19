"use client";
import * as api from "@/app/api/get/getApi";
import DeleteAttendance from "@/app/components/attendance/DeleteAttendance";
import ModifyAttendanceTime from "@/app/components/attendance/ModifyAttendanceTime";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { ATTENDANCE } from "@/app/enums/breadcrumbs";
import { ATTENDANCE_HEADER } from "@/app/enums/tableHeader";
import { dateFormatTime, dateFormatYYYYMMDD, durationTime } from "@/app/utils/dateFormat";
import notification from "@/app/utils/notification";
import { ActionIcon, Button, Checkbox, Flex, Group, Input, ScrollArea, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { lazy, useEffect, useState } from "react";
import IconCalendar from "/public/icons/calendar.svg";
import IconLink from "/public/icons/external-link.svg";
import IconRefresh from "/public/icons/refresh.svg";

const ModifyNote = lazy(() => import("@/app/components/attendance/ModifyNote"));

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

  const selectAttendanceTime = (row: any) => {
    console.log("🚀 ~ selectNote ~ row:", row);
    setselectedRowsDetail(row);
    open();
  };

  const selectDateRange = (value: [Date | null, Date | null]) => {
    if (value[0] && value[1]) {
      setParams({
        ...params,
        sDate: dayjs(value[0]).format("YYYY-MM-DD"),
        eDate: dayjs(value[1]).format("YYYY-MM-DD"),
      });
    }
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
            // variant="unstyled"
            leftSection={<IconCalendar />}
            placeholder="조회하실 기간을 선택해 주세요."
            size="sm"
            styles={{
              input: {
                fontSize: "var(--mantine-font-size-sm)",
                fontWeight: 500,
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
            // value={value}
            onChange={selectDateRange}
            clearable
          />
          <Input w={240} placeholder="검색 대상의 성영을 입력해 주세요." radius="md" />
          <Button variant="light">조회</Button>
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
                  <Button variant="subtle" size="sm" px={4} onClick={() => selectAttendanceTime(attendance)}>
                    {dateFormatTime(attendance.checkInTime)}
                  </Button>
                </Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={4} onClick={() => selectAttendanceTime(attendance)}>
                    {dateFormatTime(attendance.checkOutTime)}
                  </Button>
                </Table.Td>
                <Table.Td>{durationTime(attendance.workingMinutes)}</Table.Td>
                <Table.Td>{attendance.overtimeWorkingMinutes ? attendance.overtimeWorkingMinutes + " 분" : "-"}</Table.Td>
                <Table.Td>{attendance.lateStatus}</Table.Td>
                <Table.Td align="center">
                  {attendance.attendance ? (
                    <Button variant="subtle" size="sm" px={8} rightSection={<IconLink strokeWidth="1.3" />} onClick={moveDetail}>
                      {attendance.attendance}
                    </Button>
                  ) : (
                    "출근 전"
                  )}
                </Table.Td>
                <Table.Td>{attendance.leaveType}</Table.Td>
                {/* <Table.Td>{attendance.updateReason || "-"}</Table.Td> */}
                <Table.Td>{attendance.checkInDeviceType}</Table.Td>
                <Table.Td align="center">
                  {attendance.note ? (
                    <Button size="compact-xs" variant="light" color="orange" onClick={() => selectNote(attendance)}>
                      조회
                    </Button>
                  ) : (
                    <Button size="compact-xs" variant="light" onClick={() => selectNote(attendance)}>
                      등록
                    </Button>
                  )}
                </Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.updatedAt)}</Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.createdAt)}</Table.Td>
                <Table.Td>첨부파일</Table.Td>
              </Table.Tr>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <ModifyAttendanceTime opened={opened} close={close} selectedRows={selectedRowsDetail} />

      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={openedModifyNote} selectedRows={selectedRowsDetail} />

      <DeleteAttendance openedDeleteAttendance={openedDeleteAttendance} closeDeleteAttendance={closeDeleteAttendance} selectedRows={selectedRows} />
    </Flex>
  );
}

export default page;
