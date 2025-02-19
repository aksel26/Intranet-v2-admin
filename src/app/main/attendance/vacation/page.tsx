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

interface FormValues {
  userName?: string;
  userGender?: string | null;
  gradeIdx?: number | null;
  year: number | string | null;
}
function page() {
  const form = useForm<FormValues>({
    initialValues: {
      userName: "",
      year: dayjs().year().toString(),
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
    year: dayjs().year().toString(),
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

  const currentYear = dayjs().year();

  // 현재 연도부터 이전 3년까지의 연도 배열 생성
  const years = Array.from({ length: 4 }, (_, index) => {
    const year = currentYear - (3 - index);
    return {
      value: year.toString(),
      label: year.toString(),
    };
  });

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={VACATION_LIST} />
      <Group justify="space-between" align="flex-end" mt={"lg"} mb={"md"}>
        <form onSubmit={form.onSubmit(submitSearch)}>
          <Group gap={"xs"} align="end">
            <Select
              label="연도"
              data={years}
              comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
              key={form.key("year")}
              {...form.getInputProps("year")}
              styles={{ root: { width: 100 } }}
            />
            <Input.Wrapper label={STAFF_NAME_LABEL}>
              <Input w={250} placeholder="검색 대상의 성영을 입력해 주세요." radius="md" key={form.key("userName")} {...form.getInputProps("userName")} />
            </Input.Wrapper>

            <Button type="submit" size="sm" radius={"md"}>
              검색
            </Button>
          </Group>
        </form>

        <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
          내려받기
        </Button>
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
