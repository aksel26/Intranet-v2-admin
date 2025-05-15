"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import { ActionIcon, Alert, Button, Flex, Group, Input, Modal, ScrollArea, Stack, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useState } from "react";
import IconCircleChecked from "/public/icons/circle-dashed-check.svg";
import IconDownload from "/public/icons/download.svg";
import IconInfo from "/public/icons/info-circle.svg";
dayjs.locale("ko");

import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { Welfares } from "@/app/components/table/welfare";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { WELFARE } from "@/app/enums/breadcrumbs";
import { WELFARES_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { IconCalendar, IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/app/components/welfare/confirm";

function page() {
  const queyrClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [check, { open: openCheck, close: closeCheck }] = useDisclosure(false);

  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 20,
    sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    userName: "",
  });

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["welfares", params], queryFn: () => api.getWelfares(params) });

  const welfares = data?.data.data.welfare;
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.confirmWelfare(values),
  });

  const confirmWelfare = (confirmStatus: string) => {
    mutate(
      { welfareIdxList: selectedRows.map((row: any) => row.welfareIdx), confirmYN: confirmStatus },
      {
        onSuccess: () => {
          notification({ title: "복지포인트 확정/미확정", message: "복지포인트 확정 내용이 변경되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["welfares"] });
          setSelectedRows([]);
          closeCheck();
        },
        onError: () => {
          notification({ title: "복지포인트 확정/미확정", message: "복지포인트 확정 내용 변경 중 문제가 발생하였습니다.", color: "red" });
        },
      }
    );
  };

  const form = useForm({
    initialValues: {
      userName: "",
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
        userName: values.userName,
      });
    } else {
      setParams({
        ...params,
        pageNo: 1,
        sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
        userName: values.userName,
      });
    }
  };

  const openConfirmModal = () => {
    if (selectedRows.length < 1) {
      notification({
        color: "yellow",
        title: "활동비 확정",
        message: "대상 내역을 1개 이상을 선택해 주세요.",
      });
    } else {
      openCheck();
    }
  };
  const refresh = async () => {
    await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
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
              <Input w={240} {...form.getInputProps("userName")} placeholder="검색 대상의 성명을 입력해 주세요." radius="md" />
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
            내역 확정/미확정
          </Button>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
            내려받기
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={welfares?.length < 1 ? false : true} stickyHeader highlightOnHover={welfares?.length < 1 ? false : true}>
          <TableHeader columns={WELFARES_HEADER} />
          <TableBody data={welfares} columns={WELFARES_HEADER}>
            <Welfares data={welfares} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
      {welfares?.length < 1 ? null : <PageList controls={setParams} totalPage={data?.data.data.totalPage} />}

      <ConfirmModal opened={check} close={closeCheck} selectedRows={selectedRows} handler={confirmWelfare} />
    </Flex>
  );
}

export default page;
