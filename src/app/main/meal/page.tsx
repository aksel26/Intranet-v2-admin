"use client";
import { ActionIcon, Box, Button, Center, Flex, Group, Input, Menu, NumberFormatter, Pagination, Stack, Table, Text } from "@mantine/core";
import React, { useState } from "react";
import Adjust from "/public/icons/adjustments-alt.svg";
const elements = [
  { position: 1, mass: Math.random() * 100000, symbol: "정읍식당", name: "김현근 본부장" },
  { position: 2, mass: Math.random() * 100000, symbol: "포케", name: "박민수 본부장" },
  { position: 7, mass: Math.random() * 100000, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: Math.random() * 100000, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: Math.random() * 100000, symbol: "Ba", name: "Barium" },
  { position: 58, mass: Math.random() * 100000, symbol: "Ce", name: "Cerium" },
  { position: 58, mass: Math.random() * 100000, symbol: "Ce", name: "Cerium" },
  { position: 58, mass: Math.random() * 100000, symbol: "Ce", name: "Cerium" },
  { position: 58, mass: Math.random() * 100000, symbol: "Ce", name: "Cerium" },
  { position: 58, mass: Math.random() * 100000, symbol: "Ce", name: "Cerium" },
  { position: 58, mass: Math.random() * 100000, symbol: "Ce", name: "Cerium" },
];
function page() {
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={430000} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={12000} suffix=" 원" />
      </Table.Td>
      <Table.Td>2024-11-20</Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} justify={"space-between"} h={"100%"} pb={"md"}>
      <Box>
        <Text fw={900} size="xl" mb={"xl"}>
          식대 내역 조회
        </Text>
        <Group justify="space-between" mb={"md"}>
          <Group gap={"xs"}>
            <Input placeholder="검색할 내용을 입력해 주세요." radius="md" />
            <Button size="sm" radius={"md"}>
              검색
            </Button>
          </Group>
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon variant="light" size={"lg"}>
                <Adjust width="20" height="20" strokeWidth="1.5" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>정렬</Menu.Label>
              <Menu.Item>이름순</Menu.Item>
              <Menu.Item>금액순</Menu.Item>
              <Menu.Item>등록순</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>사용자</Table.Th>
              <Table.Th>사용처</Table.Th>
              <Table.Th>사용 금액</Table.Th>
              <Table.Th>잔액</Table.Th>
              <Table.Th>작성일</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>

      <Group justify="center">
        <Pagination total={10} radius="md" />
      </Group>
    </Flex>
  );
}

export default page;
