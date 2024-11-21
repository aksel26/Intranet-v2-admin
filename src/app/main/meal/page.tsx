"use client";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Menu,
  NumberFormatter,
  Pagination,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import React, { useRef, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/app/api/get/getApi";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { HEIGHT } from "@/app/enums/design";
import PageList from "@/app/components/Global/PageList";
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

  const rows = data?.data.data.meal?.map((element: any, index: number) => (
    <Table.Tr key={element.mealIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>

      <Table.Td>{element.place}</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={element.amount} suffix=" 원" />
      </Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
    </Table.Tr>
  ));
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

      {/* <Box pos="relative" mih={isLoading ? "50vh" : 0}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} /> */}
      <ScrollArea>
        <Table striped stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>직급</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>사용처</Table.Th>
              <Table.Th>사용 금액</Table.Th>
              <Table.Th>작성일</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      <PageList totalPage={data?.data.data.totalPage} />
    </Flex>
  );
}

export default page;
