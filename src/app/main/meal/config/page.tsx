"use client";
import {
  ActionIcon,
  Box,
  Button,
  Dialog,
  Divider,
  Group,
  Input,
  Menu,
  NumberFormatter,
  NumberInput,
  Pagination,
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import More from "/public/icons/dots.svg";
import { useDisclosure } from "@mantine/hooks";
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

  const [opened, { toggle, close }] = useDisclosure(false);

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
        <Menu shadow="md" closeOnItemClick={false}>
          <Menu.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Popover width={300} position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Menu.Item>금액 수정</Menu.Item>
              </Popover.Target>
              <Popover.Dropdown>
                <Group align="end">
                  <TextInput size="xs" label="총 사용금액 수정" placeholder="금액을 입력해 주세요." />
                  <Button size="xs" variant="light">
                    저장
                  </Button>
                </Group>
              </Popover.Dropdown>
            </Popover>

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
          <Group align="baseline" mb={"md"}>
            <Select
              maxDropdownHeight={200}
              styles={{ root: { fontWeight: 700 } }}
              w={100}
              size="md"
              checkIconPosition="right"
              data={["1월", "2월", "11월"]}
              variant="unstyled"
              defaultValue={"11월"}
            />
            <Text size="md" fw={700}>
              기본 식대 금액 설정
            </Text>
          </Group>
          <Group align="flex-end" gap={"xl"}>
            <NumberInput
              description="식대금액이 설정한 기간에 일괄적으로 적용됩니다."
              label="기본 제공 식대"
              placeholder="금액을 입력해 주세요."
              thousandSeparator=","
              hideControls
              suffix=" 원"
              onChange={defaultPrice}
            />

            <NumberInput label="업무일" thousandSeparator="," hideControls suffix=" 일" value={23} />

            <NumberInput
              label={"인원별 총 금액"}
              description="기본제공 식대 x 업무일"
              readOnly
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
