"use client";
import * as api from "@/app/api/get/getApi";
import DeleteAttendance from "@/app/components/attendance/DeleteAttendance";
import ModifyAttendanceTime from "@/app/components/attendance/ModifyAttendanceTime";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { AttendanceTable } from "@/app/components/table/attendance";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { ATTENDANCE } from "@/app/enums/breadcrumbs";
import { ATTENDANCE_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { ActionIcon, Button, Flex, Group, Input, ScrollArea, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { lazy, useState } from "react";
import IconCalendar from "/public/icons/calendar.svg";
import IconRefresh from "/public/icons/refresh.svg";

const ModifyNote = lazy(() => import("@/app/components/attendance/ModifyNote"));

function page() {
  const queyrClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModifyNote, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [openedDeleteAttendance, { open: openDeleteAttendance, close: closeDeleteAttendance }] = useDisclosure(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedRowsDetail, setselectedRowsDetail] = useState();

  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 50,
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

  const attendances = data?.data.data.records;

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={ATTENDANCE} />
      <Group justify="space-between" mb={"md"} align="center">
        <Group>
          <form onSubmit={form.onSubmit((values) => submitSearch(values))}>
            <Group>
              <DatePickerInput
                valueFormat="YYYY-MM-DD"
                firstDayOfWeek={0}
                type="range"
                locale="ko"
                highlightToday
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
        <Table striped={attendances?.length < 1 ? false : true} stickyHeader highlightOnHover={attendances?.length < 1 ? false : true}>
          <TableHeader columns={ATTENDANCE_HEADER} />
          <TableBody data={attendances} columns={ATTENDANCE_HEADER}>
            <AttendanceTable
              data={attendances}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectNote={selectNote}
              selectAttendanceTime={selectAttendanceTime}
            />
          </TableBody>
        </Table>
      </ScrollArea>
      {/* {attendances?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />} */}

      <ModifyAttendanceTime opened={opened} close={close} selectedRows={selectedRowsDetail} />
      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={openedModifyNote} selectedRows={selectedRowsDetail} />
      <DeleteAttendance openedDeleteAttendance={openedDeleteAttendance} closeDeleteAttendance={closeDeleteAttendance} selectedRows={selectedRows} />
    </Flex>
  );
}

export default page;
