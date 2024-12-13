"use client";
import * as api from "@/app/api/get/getApi";
import PageList from "@/app/components/Global/PageList";
import { ActionIcon, Button, Flex, Group, Input, Menu, ScrollArea, Table, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useEffect, useRef, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";
import IconRefresh from "/public/icons/refresh.svg";

import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";

import { MEAL_EXPENSES_HEADER } from "@/app/enums/tableHeader";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { MealExpenses } from "@/app/components/table/meal/MealExpenses";

dayjs.locale("ko");

function page() {
  const [searchParam, setSearchParam] = useState<{
    sDate: string;
    eDate: string;
    userName: string | null;
  }>({
    sDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    eDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    userName: null,
  });
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([null, null]);

  const { data, isLoading, isError } = useQuery({ queryKey: ["meals", searchParam], queryFn: () => api.getMeals(searchParam) });

  const selectDate = (value: any) => setDateValue(value);

  const [mealsData, setMealsData] = useState([]);

  useEffect(() => {
    if (data?.data.data.meal.length === 0) {
      setMealsData([]);
    } else {
      setMealsData(data?.data.data.meal);
    }
  }, [data]);

  const userNameRef = useRef<HTMLInputElement>(null);

  const search = () => {
    let sDate = dayjs(dateValue[0]).format("YYYY-MM-DD");
    let eDate = dayjs(dateValue[1]).format("YYYY-MM-DD");
    // const eDate = dayjs(dateValue[1]).format("YYYY-MM-DD");
    let userName = null;
    if (userNameRef.current) {
      userName = userNameRef.current.value;
    }
    if (sDate === "Invalid Date" || eDate === "Invalid Date") {
      sDate = dayjs().startOf("month").format("YYYY-MM-DD");
      eDate = dayjs().endOf("month").format("YYYY-MM-DD");
    }

    setSearchParam((prev) => ({ ...prev, sDate: sDate, eDate: eDate, userName: userName }));
  };

  const router = useRouter();
  const refresh = () => router.refresh();
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        식대 내역 조회
      </Title>

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Group gap={"xs"} align="end">
          <DatePickerInput
            miw={100}
            valueFormat="MM월 D일 dddd"
            firstDayOfWeek={0}
            type="range"
            locale="ko"
            allowSingleDateInRange
            label="작성일"
            placeholder="작성일을 선택해 주세요."
            value={dateValue}
            onChange={selectDate}
            clearable
          />
          <Input.Wrapper label="성명">
            <Input w={250} placeholder="검색 대상의 성명을 입력해 주세요." radius="md" ref={userNameRef} />
          </Input.Wrapper>

          <Button size="sm" radius={"md"} onClick={search}>
            검색
          </Button>
        </Group>
        <Group>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
            내려받기
          </Button>
          <ActionIcon variant="light" size={"lg"} onClick={refresh}>
            <IconRefresh width="20" height="20" strokeWidth="1.5" />
          </ActionIcon>
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
      {mealsData?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}
    </Flex>
  );
}

export default page;
