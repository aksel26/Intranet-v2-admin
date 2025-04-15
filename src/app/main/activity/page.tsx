"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import { ActionIcon, Alert, Button, Flex, Group, Input, Menu, Modal, ScrollArea, Stack, Table } from "@mantine/core";
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

import { ActivityTable } from "@/app/components/activity/ActivityTable";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { ACTIVITY } from "@/app/enums/breadcrumbs";
import { ACTIVITY_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { IconCalendar, IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FormValues {
  userName?: string;
  gradeIdx?: string | null;
  confirmYN?: number | null;
}

function page() {
  const queyrClient = useQueryClient();

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [check, { open: openCheck, close: closeCheck }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      userName: "",
      dateRange: [null, null], // 빈 날짜 범위
    },
  });

  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 20,
    sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    userName: "",
  });
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["activities", params],
    queryFn: () => api.getActivities(params),
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.confirmActivites(values),
  });

  const confirmWelfare = () => {
    mutate(
      { activityIdxList: selectedRows, confirmYN: "Y" },
      {
        onSuccess: () => {
          notification({
            title: "활동비 확정",
            message: "활동비 확정이 완료되었습니다.",
            color: "green",
          });

          queryClient.invalidateQueries({ queryKey: ["activities"] });
          setSelectedRows([]);
          closeCheck();
        },
        onError: () => {
          notification({
            title: "활동비 확정",
            message: "활동비 확정을 실패하였습니다.",
            color: "red",
          });
        },
      }
    );
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
        sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
        userName: values.userName,
      });
    }
  };

  const activities = data?.data.data.activity;

  const refresh = async () => {
    await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
  };
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={ACTIVITY} />

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
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon variant="light" size={"lg"}>
                <IconAdjust width="20" height="20" strokeWidth="1.5" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>정렬</Menu.Label>
              <Menu.Item>등록순</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={activities?.length < 1 ? false : true} stickyHeader highlightOnHover={activities?.length < 1 ? false : true}>
          <TableHeader columns={ACTIVITY_HEADER} />
          <TableBody data={activities} columns={ACTIVITY_HEADER}>
            <ActivityTable data={activities} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
      {activities?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}

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
