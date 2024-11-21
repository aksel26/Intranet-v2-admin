"use client";
import PageList from "@/app/components/Global/PageList";
import { HEIGHT } from "@/app/enums/design";
import { Badge, Box, Button, Checkbox, Flex, Group, NumberFormatter, ScrollArea, Select, Table, Text, Title } from "@mantine/core";
import { useState } from "react";

const elements = Array.from({ length: 41 }, (_, index) => {
  return { position: index + 1, grade: "본부장", balance: 1500, expense: 75300, amount: 890000, name: "김현근2", etc: "정산완료" };
});

function page() {
  const [value, setValue] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const rows = elements.map((element) => (
    <Table.Tr key={element.position} bg={selectedRows.includes(element.position) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.position)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked ? [...selectedRows, element.position] : selectedRows.filter((position) => position !== element.position)
            )
          }
        />
      </Table.Td>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.grade}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.amount} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.expense} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.balance} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.etc === "정산완료" ? "blue" : "yellow"}>{element.etc || "미정산"}</Badge>
      </Table.Td>

      <Table.Td>
        {/* <Button variant="light" size="xs"> */}
        재택근무
        {/* </Button> */}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        복지포인트 정산
      </Title>

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Select
          defaultSearchValue="전체"
          data={["전체", "상반기", "하반기"]}
          variant="unstyled"
          styles={{ root: { fontWeight: 700 } }}
          size="md"
          checkIconPosition="right"
        />

        <Group>
          <Button size="sm" radius="md">
            정산완료
          </Button>
          <Button size="sm" radius="md">
            정산요청
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>No.</Table.Th>
              <Table.Th>직급</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>총 금액</Table.Th>
              <Table.Th>사용 금액</Table.Th>
              <Table.Th>잔액</Table.Th>
              <Table.Th>정산여부</Table.Th>
              <Table.Th>비고</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      <PageList totalPage={10} />
      {/* <Group justify="center">
        <Pagination total={10} radius="md" />
      </Group> */}
    </Flex>
  );
}

export default page;
