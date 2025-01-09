"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import { ActionIcon, Alert, Button, Flex, Group, Input, Menu, Modal, ScrollArea, Select, Stack, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useEffect, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconCircleChecked from "/public/icons/circle-dashed-check.svg";
import IconDownload from "/public/icons/download.svg";
import IconInfo from "/public/icons/info-circle.svg";
dayjs.locale("ko");

import { ActivityTable } from "@/app/components/activity/ActivityTable";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { BREADSCRUMBS_ACTIVITY } from "@/app/enums/breadscrumbs";
import { GRADE_NAME_LABEL } from "@/app/enums/staffInfo";
import { NOTICE_HEADER } from "@/app/enums/tableHeader";
import { cleanObject } from "@/app/utils/cleanObject";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FormValues {
  userName?: string;
  gradeIdx?: string | null;
  confirmYN?: number | null;
}

function page() {
  const [value, setValue] = useState<[Date | null, Date | null]>([dayjs().startOf("month").toDate(), dayjs().endOf("month").toDate()]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [check, { open: openCheck, close: closeCheck }] = useDisclosure(false);
  const [searchParam, setSearchParam] = useState({
    sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    pageNo: 1,
    userName: "",
  });
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["activities", searchParam], queryFn: () => api.getActivities(searchParam) });
  console.log("🚀 ~ page ~ data:", data);
  const {
    data: gradeIds,
    isLoading: gradeIds_isLoading,
    isError: gradeIds_isError,
  } = useQuery({
    queryKey: ["gradeIds"],
    queryFn: () => {
      return api.getGradeIds();
    },
  });
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.confirmWelfare(values),
  });

  const [gradeIdData, setGradeIdData] = useState();
  useEffect(() => {
    gradeIds &&
      setGradeIdData(gradeIds?.data.data.map((item: { gradeIdx: number; gradeName: string }) => ({ value: item.gradeIdx.toString(), label: item.gradeName })));
  }, [gradeIds]);
  const confirmWelfare = () => {
    mutate(
      { welfareIdxList: selectedRows, confirmYN: "Y" },
      {
        onSuccess: () => {
          notification({ title: "활동비 확정", message: "활동비 확정이 완료되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["activities"] });
          setSelectedRows([]);
          closeCheck();
        },
        onError: () => {
          notification({ title: "활동비 확정", message: "활동비 확정을 실패하였습니다.", color: "red" });
        },
      }
    );
  };
  const form = useForm<FormValues>({
    initialValues: {
      userName: "",
      gradeIdx: null,
      confirmYN: null,
    },
  });

  const selectDateRange = (date: any) => {
    setValue(date);
    const sDate = dayjs(date[0]).format("YYYY-MM-DD");
    const eDate = dayjs(date[1]).format("YYYY-MM-DD");
    form.setFieldValue("sDate", sDate);
    form.setFieldValue("eDate", eDate || sDate);
  };

  const submitSearch = async (values: any) => {
    const temp = cleanObject(values, "gradeIdx");

    const result = { ...temp, pageNo: 1 };

    setSearchParam(result);
  };

  const [activity, setActivity] = useState([]);
  useEffect(() => {
    if (data?.data.data.activity.length === 0) {
      setActivity([]);
    } else {
      setActivity(data?.data.data.activity);
    }
  }, [data]);

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadScrumb level={BREADSCRUMBS_ACTIVITY} />

      <Group justify="space-between" mb={"md"} align="flex-end">
        <form onSubmit={form.onSubmit(submitSearch)}>
          <Group gap={"xs"} align="end">
            <DatePickerInput
              valueFormat="MM월 D일 dddd"
              firstDayOfWeek={0}
              miw={100}
              type="range"
              label="작성일"
              placeholder="작성일 선택"
              locale="ko"
              allowSingleDateInRange
              value={value}
              onChange={selectDateRange}
              defaultValue={[dayjs().startOf("month").toDate(), dayjs().endOf("month").toDate()]}
            />
            <Select
              label={GRADE_NAME_LABEL}
              data={gradeIdData || []}
              clearable
              placeholder="직급 선택"
              w={100}
              key={form.key("gradeIdx")}
              {...form.getInputProps("gradeIdx")}
            />
            <Input.Wrapper label="성명">
              <Input w={240} placeholder="검색 대상의 성명을 입력해 주세요." radius="md" key={form.key("userName")} {...form.getInputProps("userName")} />
            </Input.Wrapper>

            <Button size="sm" radius={"md"} type="submit">
              검색
            </Button>
          </Group>
        </form>
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
        <Table striped={activity?.length < 1 ? false : true} stickyHeader highlightOnHover={activity?.length < 1 ? false : true}>
          <TableHeader columns={NOTICE_HEADER} />
          <TableBody data={activity} columns={NOTICE_HEADER}>
            <ActivityTable data={activity} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
      {activity?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}

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
