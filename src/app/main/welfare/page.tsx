"use client";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  Input,
  Menu,
  Modal,
  NumberFormatter,
  Pagination,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";
import IconCircleChecked from "/public/icons/circle-dashed-check.svg";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import IconInfo from "/public/icons/info-circle.svg";
const elements = Array.from({ length: 40 }, (_, index) => {
  return {
    position: index + 1,
    grade: "본부장",
    place: "맘맘테이블",
    balance: 5400,
    expense: 2323000,
    amount: 434000,
    name: "정진옥",
    etc: "12일 퇴사 예정",
    targetDay: "2024-11-23",
    payee: "박민숙 또는 본인",
  };
});
function page() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [check, { open: openCheck, close: closeCheck }] = useDisclosure(false);
  const rows = elements.map((element) => (
    <Table.Tr key={element.position}>
      <Table.Td>
        <Checkbox
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
      <Table.Td>{element.payee}</Table.Td>

      <Table.Td>{element.place}</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={12000} suffix=" 원" />
      </Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
      <Table.Td>
        <Checkbox size="xs" label="2024-11-14" />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} justify={"space-between"} pb={50}>
      <Box>
        <Text fw={900} size="xl" mb={"xl"}>
          복지포인트 내역 조회
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
            <Button variant="light" size="sm" radius={"md"} rightSection={<IconCircleChecked width="15" height="15" />} onClick={openCheck}>
              사용내역 확인
            </Button>
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
              <Table.Th />
              <Table.Th>No.</Table.Th>
              <Table.Th>직급</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>결제자</Table.Th>
              <Table.Th>사용처</Table.Th>
              <Table.Th>사용 금액</Table.Th>
              <Table.Th>작성일</Table.Th>
              <Table.Th>확정여부</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>

      <Group justify="center" my={30}>
        <Pagination total={10} radius="md" />
      </Group>
      <Modal opened={check} onClose={closeCheck} centered title="내역 확인">
        <Stack>
          <Alert variant="outline" radius="md" title="해당 내역을 확정 하시겠습니까?" icon={<IconInfo />}>
            총 5개 내역을 확정합니다.
          </Alert>
          <Group wrap="nowrap">
            <Button variant="light" fullWidth>
              확인
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={closeCheck}>
              닫기
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Flex>
  );
}

export default page;
