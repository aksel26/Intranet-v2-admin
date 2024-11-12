"use client";
import { ActionIcon, Box, Button, Divider, Group, Input, Menu, NumberFormatter, NumberInput, Pagination, Paper, Stack, Table, Text } from "@mantine/core";
import React, { useState } from "react";
import More from "/public/icons/dots.svg";
const elements = Array.from({ length: 41 }, (_, index) => {
  return { position: index + 1, grade: "본부장", balance: 1500, expense: 75300, amount: 890000, name: "김현근2", etc: "12일 퇴사 예정" };
});
function page() {
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState(0);
  const defaultPrice = (e: any) => {
    setResult((prev) => e * 23);

    console.log("🚀 ~ defaultPrice ~ e:", e);
  };
  const rows = elements.map((element) => (
    <Table.Tr key={element.position}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.grade}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.amount} suffix=" 원" />
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
    <Box pb={50}>
      <Text fw={900} size="xl" mb={"xl"}>
        식대 설정
      </Text>
      <Stack mb={"xl"} gap={"sm"}>
        <Paper p="lg" withBorder radius={"lg"} px={"xl"} w={"max-content"}>
          <Text size="md" fw={700} mb={"md"}>
            기본 식대 금액 설정
          </Text>
          <Group align="flex-end" gap={"xl"}>
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
        </Paper>
      </Stack>
      <Divider my="md" />

      <Table striped stickyHeader stickyHeaderOffset={50} highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>No.</Table.Th>
            <Table.Th>직급</Table.Th>
            <Table.Th>성명</Table.Th>
            <Table.Th>총 금액</Table.Th>
            <Table.Th>비고</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
}

export default page;
