"use client";
import { ActionIcon, Button, Divider, Group, Input, Menu, NumberFormatter, NumberInput, Pagination, Stack, Table, Text } from "@mantine/core";
import React, { useState } from "react";
import More from "/public/icons/dots.svg";
const elements = [
  { position: 1, mass: Math.random() * 100000, symbol: "본부장", name: "김현근", etc: "11월 23일 퇴사예정" },
  { position: 2, mass: Math.random() * 100000, symbol: "본부장", name: "박민수", etc: "11월 1일부 육아휴직" },
  { position: 3, mass: Math.random() * 100000, symbol: "팀장", name: "박민숙" },
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
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState(0);
  const defaultPrice = (e: any) => {
    setResult((prev) => e * 23);

    console.log("🚀 ~ defaultPrice ~ e:", e);
  };
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={430000} suffix=" 원" />
      </Table.Td>
      <Table.Td>{element.etc}</Table.Td>
      <Table.Td>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>금액 수정</Menu.Item>
            <Menu.Item>비고 작성</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Text fw={900} size="xl" mb={"xl"}>
        식대 설정
      </Text>
      <Stack mb={"xl"} gap={"sm"}>
        <Text size="md" fw={700}>
          기본 식대 금액 설정
        </Text>
        <Group align="flex-end">
          <NumberInput label="기본 제공 식대" placeholder="금액을 입력해 주세요." thousandSeparator="," hideControls suffix=" 원" onChange={defaultPrice} />

          <NumberInput label="업무일" thousandSeparator="," hideControls suffix=" 일" value={23} />

          <NumberInput
            label={
              <Group>
                인원별 총 금액
                <Text c={"gray.7"} size="xs">
                  기본제공 식대 x 업무일
                </Text>
              </Group>
            }
            variant="unstyled"
            thousandSeparator=","
            hideControls
            suffix=" 원"
            value={result}
          />
          <Button radius={"md"}>저장</Button>
        </Group>
      </Stack>
      <Divider my="md" />

      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>No.</Table.Th>
            <Table.Th>사용자</Table.Th>
            <Table.Th>금액</Table.Th>
            <Table.Th>비고</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group justify="center">
        <Pagination total={10} radius="md" />
      </Group>
    </>
  );
}

export default page;
