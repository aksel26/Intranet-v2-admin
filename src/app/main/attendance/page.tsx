"use client";
import * as api from "@/app/api/get/getApi";
import AttachmentModal from "@/app/components/attendance/AttachmentModal";
import DeleteAttendance from "@/app/components/attendance/DeleteAttendance";
import ModifyAttendanceTime from "@/app/components/attendance/ModifyAttendanceTime";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { ATTENDANCE } from "@/app/enums/breadcrumbs";
import { ATTENDANCE_HEADER } from "@/app/enums/tableHeader";
import { dateFormatTime, dateFormatYYYYMMDD, durationTime } from "@/app/utils/dateFormat";
import { detectDevice } from "@/app/utils/detectDevice";
import notification from "@/app/utils/notification";
import { ActionIcon, Button, Checkbox, Flex, Group, Input, ScrollArea, Table, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { lazy, useEffect, useState } from "react";
import IconCalendar from "/public/icons/calendar.svg";
import IconRefresh from "/public/icons/refresh.svg";

const ModifyNote = lazy(() => import("@/app/components/attendance/ModifyNote"));

function page() {
  const queyrClient = useQueryClient();
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModify, { open: openModify, close: closeModify }] = useDisclosure(false);
  const [openedModifyNote, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [openedDeleteAttendance, { open: openDeleteAttendance, close: closeDeleteAttendance }] = useDisclosure(false);
  const [openedAttachmentModal, { open: openAttachmentModal, close: closeAttachmentModal }] = useDisclosure(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedRowsDetail, setselectedRowsDetail] = useState();

  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 20,
    sDate: dayjs().format("YYYY-MM-DD"),
    eDate: dayjs().format("YYYY-MM-DD"),
    userName: "",
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      dateRange: [null, null], // 빈 날짜 범위
      userName: "",
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendances", params],
    queryFn: () => api.getAttendanceList(params),
  });

  useEffect(() => {
    setAttendanceList(data?.data.data.records);
  }, [data]);

  const deleteAttendance = () => {
    if (selectedRows.length < 1)
      notification({
        color: "yellow",
        title: "내역 삭제",
        message: "대상 내역을 1개 이상을 선택해 주세요.",
      });
    else openDeleteAttendance();
  };

  const selectNote = (row: any) => {
    setselectedRowsDetail(row);
    openModifyNote();
  };

  const selectAttendanceTime = (row: any) => {
    setselectedRowsDetail(row);
    open();
  };
  const selectAttachment = (row: any) => {
    setselectedRowsDetail(row);
    openAttachmentModal();
  };

  const refresh = async () => {
    await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
  };

  const submitSearch = (values: any) => {
    if (values.dateRange[0] && values.dateRange[1]) {
      setParams({
        ...params,
        sDate: dayjs(values.dateRange[0]).format("YYYY-MM-DD"),
        eDate: dayjs(values.dateRange[1]).format("YYYY-MM-DD"),
        userName: values.userName,
      });
    } else {
      setParams({
        ...params,
        sDate: "",
        eDate: "",
        userName: values.userName,
      });
    }
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={ATTENDANCE} />
      <Group justify="space-between" my={"md"} align="center">
        <Group>
          <form onSubmit={form.onSubmit((values) => submitSearch(values))}>
            <Group>
              <DatePickerInput
                valueFormat="YYYY-MM-DD"
                firstDayOfWeek={0}
                type="range"
                locale="ko"
                allowSingleDateInRange
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
                {...form.getInputProps("dateRange")}
                clearable
              />
              <Input w={240} {...form.getInputProps("userName")} placeholder="검색 대상의 성영을 입력해 주세요." radius="md" />
              <Button variant="light" type="submit">
                조회
              </Button>
            </Group>
          </form>
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
              <Table.Tr fz={"xs"} key={index} bg={selectedRows.includes(attendance.commuteIdx) ? "var(--mantine-color-blue-light)" : undefined}>
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
                <Table.Td>{attendance.userName}</Table.Td>
                <Table.Td>{attendance.gradeName}</Table.Td>
                <Table.Td>{attendance.teamName}</Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.checkInTime)}</Table.Td>
                <Table.Td>{detectDevice(attendance.checkInLogAgent, attendance.checkInIpAddr)}</Table.Td>
                <Table.Td>{detectDevice(attendance.checkOutLogAgent, attendance.checkOutIpAddr)}</Table.Td>
                <Table.Td>{attendance.leaveType}</Table.Td>
                <Table.Td>{attendance.attendance || "-"}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="compact-xs" px={4} onClick={() => selectAttendanceTime(attendance)}>
                    {`${dateFormatTime(attendance.checkInTime)} - ${dateFormatTime(attendance.checkOutTime)}`}
                  </Button>
                </Table.Td>
                <Table.Td>{durationTime(attendance.workingMinutes)}</Table.Td>

                <Table.Td>{attendance.overtimeWorkingMinutes ? attendance.overtimeWorkingMinutes + " 분" : "-"}</Table.Td>
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
                <Table.Td>
                  {attendance.imageUrl ? (
                    <Button onClick={() => selectAttachment(attendance)} size="compact-xs" variant="light">
                      조회
                    </Button>
                  ) : (
                    <Text c={"dimmed"} fz={"xs"} ta={"center"}>
                      없음
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.updatedAt)}</Table.Td>
                <Table.Td>{dateFormatYYYYMMDD(attendance.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <ModifyAttendanceTime opened={opened} close={close} selectedRows={selectedRowsDetail} />

      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={openedModifyNote} selectedRows={selectedRowsDetail} />

      <DeleteAttendance openedDeleteAttendance={openedDeleteAttendance} closeDeleteAttendance={closeDeleteAttendance} selectedRows={selectedRows} />
      <AttachmentModal opened={openedAttachmentModal} close={closeAttachmentModal} info={selectedRowsDetail} />
    </Flex>
  );
}

export default page;
