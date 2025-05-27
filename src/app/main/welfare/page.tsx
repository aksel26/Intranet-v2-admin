"use client";
import * as api from "@/app/api/get/getApi";
import PageList from "@/app/components/Global/PageList";
import { ActionIcon, Button, Flex, Group, Input, ScrollArea, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useState } from "react";
import IconCircleChecked from "/public/icons/circle-dashed-check.svg";
import IconDownload from "/public/icons/download.svg";
dayjs.locale("ko");

import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { Welfares } from "@/app/components/table/welfare";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import ConfirmModal from "@/app/components/welfare/confirm";
import ModifyNote from "@/app/components/welfare/modifyNote";
import { WELFARE } from "@/app/enums/breadcrumbs";
import { WELFARES_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { IconCalendar, IconRefresh } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function page() {
  const queyrClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedRowsDetail, setSelectedRowsDetail] = useState<any>();
  const [check, { open: openCheck, close: closeCheck }] = useDisclosure(false);
  const [modifyNoteOpened, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 20,
    sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    content: "",
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["welfares", params], queryFn: () => api.getWelfares(params) });

  const welfares = data?.data.data.welfare;

  const form = useForm({
    initialValues: {
      content: "",
      dateRange: [null, null], // 빈 날짜 범위
    },
  });

  const submitSearch = (values: any) => {
    if (values.dateRange[0] && values.dateRange[1]) {
      setParams({
        ...params,
        pageNo: 1,
        sDate: dayjs(values.dateRange[0]).format("YYYY-MM-DD"),
        eDate: dayjs(values.dateRange[1]).format("YYYY-MM-DD"),
        content: values.content,
      });
    } else {
      setParams({
        ...params,
        pageNo: 1,
        sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
        content: values.content,
      });
    }
  };

  const openConfirmModal = () => {
    if (selectedRows.length < 1) {
      notification({
        color: "yellow",
        title: "복지포인트 승인",
        message: "대상 내역을 1개 이상을 선택해 주세요.",
      });
    } else {
      openCheck();
    }
  };
  const refresh = async () => {
    await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
  };

  const handleModifyNote = (element: any) => {
    openModifyNote();
    setSelectedRowsDetail(element);
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={WELFARE} />
      <Group justify="space-between" mb={"md"} align="flex-end">
        <Group>
          <form onSubmit={form.onSubmit((values) => submitSearch(values))}>
            <Group>
              <DatePickerInput
                highlightToday
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
              <Input w={240} {...form.getInputProps("content")} placeholder="사용처 정보를 입력해 주세요." radius="md" />
              <Button variant="light" type="submit">
                조회
              </Button>
            </Group>
          </form>
          <ActionIcon variant="light" size={"lg"} onClick={refresh}>
            <IconRefresh size={18} strokeWidth={1.2} />
          </ActionIcon>
        </Group>
        <Group>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconCircleChecked width="15" height="15" />} onClick={openConfirmModal}>
            내역 승인/미승인
          </Button>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
            내려받기
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={welfares?.length < 1 ? false : true} stickyHeader highlightOnHover={welfares?.length < 1 ? false : true} verticalSpacing={1}>
          <TableHeader columns={WELFARES_HEADER} />
          <TableBody data={welfares} columns={WELFARES_HEADER}>
            <Welfares data={welfares} selectedRows={selectedRows} handleModifyNote={handleModifyNote} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
      {welfares?.length < 1 ? null : <PageList controls={setParams} totalPage={data?.data.data.totalPage} />}

      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={modifyNoteOpened} selectedRows={selectedRowsDetail} />
      <ConfirmModal opened={check} close={closeCheck} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
    </Flex>
  );
}

export default page;
