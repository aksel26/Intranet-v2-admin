"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import { ActionIcon, Alert, Button, Flex, Group, Input, Menu, Modal, ScrollArea, Stack, Table, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconCircleChecked from "/public/icons/circle-dashed-check.svg";
import IconDownload from "/public/icons/download.svg";
import IconInfo from "/public/icons/info-circle.svg";
dayjs.locale("ko");

import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { Welfares } from "@/app/components/table/welfare";
import { WELFARES_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { IconCalendar, IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  const confirmWelfare = () => {
    mutate(
      { welfareIdxList: selectedRows, confirmYN: "Y" },
      {
        onSuccess: () => {
          notification({ title: "복지포인트 확정", message: "복지포인트 확정이 완료되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["welfares"] });
          setSelectedRows([]);
          closeCheck();
        },
        onError: () => {
          notification({ title: "복지포인트 확정", message: "복지포인트 확정을 실패하였습니다.", color: "red" });
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
        sDate: dayjs(values.dateRange[0]).format("YYYY-MM-DD"),
        eDate: dayjs(values.dateRange[1]).format("YYYY-MM-DD"),
        userName: values.userName,
      });
    } else {
      setParams({
        ...params,
        sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
        userName: values.userName,
      });
    }
  };

  const refresh = async () => {
    await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        복지포인트 내역 조회
      </Title>
      <Group justify="space-between" mb={"md"} align="flex-end">
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
            <IconRefresh size={18} strokeWidth={1.2} />
          </ActionIcon>
        </Group>
        <Group>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconCircleChecked width="15" height="15" />} onClick={openCheck}>
            사용내역 확인
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
      {welfares?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}

      <Modal opened={check} onClose={closeCheck} centered title="내역 확인">
        <Stack>
          <Alert variant="outline" radius="md" title="해당 내역을 확정 하시겠습니까?" icon={<IconInfo />}>
            총 {selectedRows.length}개 내역을 확정합니다.
          </Alert>
          <Group wrap="nowrap">
            <Button onClick={confirmWelfare} fullWidth>
              확정하기
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={closeCheck}>
              닫기
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Flex>
  );
}

export default page;
