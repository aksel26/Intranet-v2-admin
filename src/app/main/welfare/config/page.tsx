"use client";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Menu,
  NumberFormatter,
  NumberInput,
  Paper,
  Popover,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import More from "/public/icons/dots.svg";
const elements = Array.from({ length: 41 }, (_, index) => {
  return { position: index + 1, grade: "본부장", balance: 1500, expense: 75300, amount: 500000, name: "김현근2", etc: "워크샵 경품 (복지포인트 2배 이벤트)" };
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
        <NumberFormatter thousandSeparator value={element.position === 3 ? 1000000 : element.amount} suffix=" 원" />
      </Table.Td>
      <Table.Td>{element.position === 3 ? element.etc : ""}</Table.Td>
      <Table.Td>
        <Popover width={300} position="bottom-end" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown bg="var(--mantine-color-body)">
            <Stack>
              <Group align="end">
                <TextInput size="sm" label="총 사용금액 수정" placeholder="금액을 입력해 주세요." styles={{ root: { flex: 1 } }} />
                <Button size="sm" variant="light">
                  수정
                </Button>
              </Group>

              <Group align="end">
                <TextInput size="sm" label="비고 내용 작성" placeholder="비고 내용을 입력해 주세요." styles={{ root: { flex: 1 } }} />
                <Button size="sm" variant="light">
                  저장
                </Button>
              </Group>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box pb={50}>
      <Text fw={900} size="xl" mb={"xl"}>
        복지포인트 설정
      </Text>
      <Stack mb={"xl"} gap={"sm"}>
        <Paper p="lg" withBorder radius={"lg"} px={"xl"} w={"max-content"}>
          <Stack gap={"lg"}>
            <Text size="md" fw={700}>
              복지포인트 기본금액 설정
            </Text>

            <Group align="end" gap={"xl"}>
              <Checkbox.Group
                defaultValue={["1년"]}
                label="적용 기간 설정"
                description="복지포인트가 설정한 기간에 일괄적으로 적용됩니다."
                withAsterisk
                styles={{ description: { marginBottom: 17 } }}
              >
                <Group mt="xs">
                  <Checkbox value="1년" label="1년" />
                  <Checkbox value="상반기" label="상반기" />
                  <Checkbox value="하반기" label="하반기" />
                </Group>
              </Checkbox.Group>
              <Divider orientation="vertical" size={"sm"} />
              <Group align="end" gap={"xl"}>
                <NumberInput
                  withAsterisk
                  label="복지포인트 금액"
                  description="설정될 복지포인트 기본 금액을 입력해 주세요."
                  placeholder="0,000원"
                  thousandSeparator=","
                  hideControls
                  suffix=" 원"
                  onChange={defaultPrice}
                />

                <Button radius={"md"}>저장</Button>
              </Group>
            </Group>
          </Stack>
        </Paper>
      </Stack>
      <Divider my="md" />

      <Table striped stickyHeader stickyHeaderOffset={50} highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>No.</Table.Th>
            <Table.Th>직급</Table.Th>
            <Table.Th>성명</Table.Th>
            <Table.Th>총 사용가능 금액</Table.Th>
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
