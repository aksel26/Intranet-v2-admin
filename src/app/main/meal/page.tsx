"use client";
import { ActionIcon, Box, Button, Center, Flex, Group, Input, Menu, NumberFormatter, Pagination, Stack, Table, Text } from "@mantine/core";
import React, { useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";
import { DatePickerInput } from "@mantine/dates";
const elements = Array.from({ length: 40 }, (_, index) => {
  return {
    position: index + 1,
    grade: "본부장",
    place: "땀땀땀",
    balance: 1500,
    expense: 75300,
    amount: 890000,
    name: "김현근2",
    etc: "12일 퇴사 예정",
    targetDay: "2024-11-23",
  };
});
function page() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const rows = elements.map((element) => (
    <Table.Tr key={element.position}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.grade}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.place}</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={12000} suffix=" 원" />
      </Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} justify={"space-between"} pb={50}>
      <Box>
        <Text fw={900} size="xl" mb={"xl"}>
          식대 내역 조회
        </Text>
        <Group justify="space-between" mb={"md"}>
          <Group gap={"xs"} align="end">
            <DatePickerInput type="range" label="작성일" placeholder="작성일 선택" value={value} onChange={setValue} />
            <Input.Wrapper label="성명">
              <Input placeholder="검색 대상의 성명을 입력해 주세요." radius="md" />
            </Input.Wrapper>

            <Button size="sm" radius={"md"}>
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

        <Table striped stickyHeader stickyHeaderOffset={50} highlightOnHover>
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
      </Box>

      <Group justify="center" my={30}>
        <Pagination total={10} radius="md" />
      </Group>
    </Flex>
  );
}

export default page;
