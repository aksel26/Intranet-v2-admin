"use client";
import { ActionIcon, Box, Button, Center, Flex, Group, Input, Menu, NumberFormatter, Pagination, Popover, Select, Stack, Table, Text } from "@mantine/core";
import React, { useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconUserExclamation from "/public/icons/exclamation-circle.svg";
import IconDownload from "/public/icons/download.svg";
import { DatePickerInput } from "@mantine/dates";
import More from "/public/icons/dots.svg";
const elements = Array.from({ length: 40 }, (_, index) => {
  return {
    position: index + 1,
    gradeName: "본부장",
    mobile: "010-3333-2222",
    address: "서울시 용산구 서빙고로 18",
    name: "김현근2",
    gender: "남",
    etc: "12일 퇴사 예정",
    targetDay: "2024-11-23",
    userBirth: "1924-11-23",
    hqName: "HR솔루션 본부",
    teamName: "HR Tech팀",
    userEmail: "asdf@asdf.com",
  };
});
function page() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const rows = elements.map((element) => (
    <Table.Tr key={element.position}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{`${element.hqName} ${element.teamName}`}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.mobile}</Table.Td>
      <Table.Td>{element.address}</Table.Td>
      <Table.Td>{element.userEmail}</Table.Td>
      <Table.Td>{element.gender}</Table.Td>
      <Table.Td>{element.userBirth}</Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
      <Table.Td>
        {
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon variant="subtle" color="red.4">
                <IconUserExclamation width="15" height="15" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">재택근무</Text>
              <Text size="xs">지각 : 3회</Text>
              <Text size="xs">육아휴직</Text>
            </Popover.Dropdown>
          </Popover>
        }
      </Table.Td>
      <Table.Td>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>정보 수정</Menu.Item>
            <Menu.Item color="red">삭제</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} justify={"space-between"} pb={50}>
      <Box>
        <Text fw={900} size="xl" mb={"xl"}>
          직원 목록 조회
        </Text>
        <Group justify="space-between" mb={"md"}>
          <Group gap={"xs"} align="end">
            <Select
              label="직급"
              //   placeholder="Pick value"
              data={["본부장", "팀장", "책임", "선임", "위원"]}
              defaultValue="위원"
              clearable
            />
            <DatePickerInput type="range" label="입사일" placeholder="입사일 선택" value={value} onChange={setValue} />
            <Input.Wrapper label="성명">
              <Input placeholder="검색 대상의 성영을 입력해 주세요." radius="md" />
            </Input.Wrapper>

            <Button size="sm" radius={"md"}>
              검색
            </Button>
          </Group>
          <Group>
            <Button variant="light" size="sm" radius={"md"}>
              등록
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
              <Table.Th>No.</Table.Th>
              <Table.Th>소속</Table.Th>
              <Table.Th>직급</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>연락처</Table.Th>
              <Table.Th>주소</Table.Th>
              <Table.Th>이메일</Table.Th>
              <Table.Th>성별</Table.Th>
              <Table.Th>생년월일</Table.Th>
              <Table.Th>입사일</Table.Th>
              <Table.Th>특이사항</Table.Th>
              <Table.Th />
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
