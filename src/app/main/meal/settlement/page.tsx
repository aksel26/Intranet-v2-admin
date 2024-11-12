"use client";
import { ActionIcon, Badge, Button, Divider, Group, Input, Menu, NumberFormatter, NumberInput, Pagination, Stack, Table, Text } from "@mantine/core";
import React, { useState } from "react";
import More from "/public/icons/dots.svg";
import { MonthPickerInput } from "@mantine/dates";

const elements = [
  { position: 1, mass: Math.random() * 100000, symbol: "본부장", name: "김현근", etc: "정산완료" },
  { position: 2, mass: Math.random() * 100000, symbol: "위원", name: "김현곤", etc: "정산완료" },
  { position: 3, mass: Math.random() * 100000, symbol: "본부장", name: "박민수", etc: "미정산" },
  { position: 4, mass: Math.random() * 100000, symbol: "팀장", name: "박민숙" },
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
  const [value, setValue] = useState<Date | null>(null);

  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={430000} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.etc === "정산완료" ? "blue" : "yellow"}>{element.etc || "미정산"}</Badge>
      </Table.Td>
      <Table.Td>
        <Button variant="light" size="xs">
          정산요청
        </Button>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Text fw={900} size="xl" mb={"xl"}>
        식대 정산
      </Text>
      <MonthPickerInput label="월 선택" placeholder="조회하실 월을 선택해 주세요." value={value} onChange={setValue} mb={"xl"} w={200} />
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>No.</Table.Th>
            <Table.Th>성명</Table.Th>
            <Table.Th>금액</Table.Th>
            <Table.Th>정산여부</Table.Th>
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
