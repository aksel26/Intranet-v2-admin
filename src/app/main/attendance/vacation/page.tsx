"use client";

import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { VACATION_LIST } from "@/app/enums/breadcrumbs";
import { GRADE_NAME_LABEL, JOIN_DATE_LABEL, STAFF_NAME_LABEL } from "@/app/enums/staffInfo";
import { VACATION_TABLE_HEADER } from "@/app/enums/tableHeader";
import { ActionIcon, Button, Flex, Group, Input, Menu, NumberFormatter, ScrollArea, Select, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";
import { TableHeader } from "@/app/components/Global/table/Header";
import { TableBody } from "@/app/components/Global/table/Body";
import { VacationTable } from "@/app/components/vacation/VacationTable";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as api from "@/app/api/get/getApi";
import PageList from "@/app/components/Global/PageList";
const elements = Array.from({ length: 41 }, (_, index) => {
  return {
    position: index + 1,
    hqName: "HR",
    teamName: "HR Tech",
    userName: "김현자",
    gradeName: "본부장",
    userEmail: "asdfa@acghr.co.kr",
    vacationDay: 12,
    remailVacation: 2,
    joinDate: "2001-02-12",
    amount: 500000,
    name: "김현근2",
    etc: "워크샵 경품 (특별휴가 2개)",
  };
});

interface FormValues {
  userName?: string;
  userGender?: string | null;
  gradeIdx?: number | null;
}
function page() {
  const form = useForm<FormValues>({
    initialValues: {
      userName: "",
      userGender: null,
      gradeIdx: null,
    },
  });

  const submitSearch = async (values: any) => {
    console.log("🚀 ~ submitSearch ~ values:", values);
    // const temp = cleanObject(values, "gradeIdx");
    // const result = { ...temp, pageNo: 1 };
    // setSearchParam(result);
  };

  const router = useRouter();

  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
    userName: "",
    year: dayjs().year(),
  });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vacations", searchParam],
    queryFn: () => api.getVacations(searchParam),
  });
  console.log("🚀 ~ page ~ data:", data);

  const [vacation, setVacation] = useState([]);
  useEffect(() => {
    if (data?.data.data.summaries.length === 0) {
      setVacation([]);
    } else {
      setVacation(data?.data.data.summaries);
    }
  }, [data]);
  const moveToDetail = () => {
    router.push("/main/attendance/vacation/12");
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={VACATION_LIST} />
      <Group justify="space-between" align="flex-end" mt={"lg"} mb={"md"}>
        <form onSubmit={form.onSubmit(submitSearch)}>
          <Group gap={"xs"} align="end">
            <Select label={GRADE_NAME_LABEL} data={[]} clearable placeholder="직급 선택" key={form.key("gradeIdx")} {...form.getInputProps("gradeIdx")} />
            <DatePickerInput
              w={200}
              valueFormat="YYYY-MM-DD"
              firstDayOfWeek={0}
              type="range"
              locale="ko"
              allowSingleDateInRange
              label={JOIN_DATE_LABEL}
              placeholder="입사일 선택"
              // value={value}
              // onChange={selectDateRange}
              clearable
            />
            <Select
              clearable
              label={"성별"}
              data={[
                { label: "남", value: "M" },
                { label: "여", value: "W" },
              ]}
              placeholder="성별"
              key={form.key("userGender")}
              {...form.getInputProps("userGender")}
            />
            <Input.Wrapper label={STAFF_NAME_LABEL}>
              <Input w={250} placeholder="검색 대상의 성영을 입력해 주세요." radius="md" key={form.key("userName")} {...form.getInputProps("userName")} />
            </Input.Wrapper>

            <Button type="submit" size="sm" radius={"md"}>
              검색
            </Button>
          </Group>
        </form>
        <Group>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
            내려받기
          </Button>
          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="light" size={"lg"}>
                <IconAdjust width="20" height="20" strokeWidth="1.5" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>정렬</Menu.Label>
              <Menu.Item>직급</Menu.Item>
              <Menu.Item>생년월일</Menu.Item>
              <Menu.Item>입사일</Menu.Item>
              <Menu.Item>소속</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={vacation?.length < 1 ? false : true} stickyHeader highlightOnHover={vacation?.length < 1 ? false : true}>
          <TableHeader columns={VACATION_TABLE_HEADER} />
          <TableBody data={vacation} columns={VACATION_TABLE_HEADER}>
            <VacationTable data={vacation} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
      {vacation?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}
    </Flex>
  );
}

export default page;
