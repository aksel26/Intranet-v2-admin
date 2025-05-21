"use client";
import * as api from "@/app/api/get/getApi";
import PageList from "@/app/components/Global/PageList";
import { ActionIcon, Button, Flex, Group, Input, Menu, ScrollArea, Select, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useEffect, useRef, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";

import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";

import { MealExpenses } from "@/app/components/table/meal/MealExpenses";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { MEAL } from "@/app/enums/breadcrumbs";
import { MEAL_EXPENSES_HEADER } from "@/app/enums/tableHeader";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { IconCalendar, IconRefresh } from "@tabler/icons-react";

dayjs.locale("ko");

function page() {
  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 20,
    sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    userName: "",
  });

  const form = useForm({
    initialValues: {
      userName: "",
      dateRange: [null, null], // 빈 날짜 범위
    },
  });
  const { data, isLoading, isError } = useQuery({ queryKey: ["meals", params], queryFn: () => api.getMeals(params) });

  const [mealsData, setMealsData] = useState([]);

  useEffect(() => {
    if (data?.data.data.meal.length === 0) {
      setMealsData([]);
    } else {
      setMealsData(data?.data.data.meal);
    }
  }, [data]);

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

  const router = useRouter();
  const refresh = () => router.refresh();
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={MEAL} />

      <Group justify="space-between" mb={"md"} align="flex-end">
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
              <Select data={["조식", "중식", "석식"]} defaultValue={"중식"} w={80} />
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
        <Table striped={mealsData?.length < 1 ? false : true} stickyHeader highlightOnHover={mealsData?.length < 1 ? false : true}>
          <TableHeader columns={MEAL_EXPENSES_HEADER} />
          <TableBody data={mealsData} columns={MEAL_EXPENSES_HEADER}>
            <MealExpenses data={mealsData} />
          </TableBody>
        </Table>
      </ScrollArea>
      {mealsData?.length < 1 ? null : <PageList controls={setParams} totalPage={data?.data.data.totalPage} />}
    </Flex>
  );
}

export default page;
