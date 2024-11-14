"use client";
import { GRADE_NAME_LABEL, GRADE_NAME_LIST, JOIN_DATE_LABEL, STAFF_NAME_LABEL } from "@/app/enums/staffInfo";
import { STAFF_TABLE_HEADER } from "@/app/enums/tableHeader";
import { ActionIcon, Alert, Box, Button, Divider, Flex, Group, Input, Menu, Modal, Pagination, Popover, Select, Stack, Table, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import More from "/public/icons/dots.svg";
import IconDownload from "/public/icons/download.svg";
import IconInfo from "/public/icons/info-circle.svg";
import IconUserExclamation from "/public/icons/exclamation-circle.svg";
import { useDisclosure } from "@mantine/hooks";
import JoinModal from "@/app/components/staff/JoinModal";
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
    userId: "hkkim",
  };
});
function page() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const rows = elements.map((element) => (
    <Table.Tr key={element.position}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{`${element.hqName} ${element.teamName}`}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.userId}</Table.Td>
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
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>정보 수정</Menu.Item>
            <Menu.Item onClick={openDeleteModal} color="red">
              삭제
            </Menu.Item>
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
            <Select label={GRADE_NAME_LABEL} data={GRADE_NAME_LIST} defaultValue="위원" clearable />
            <DatePickerInput type="range" label={JOIN_DATE_LABEL} placeholder="입사일 선택" value={value} onChange={setValue} />
            <Select label={"성별"} data={["남", "여"]} placeholder="성별" />
            <Input.Wrapper label={STAFF_NAME_LABEL}>
              <Input placeholder="검색 대상의 성영을 입력해 주세요." radius="md" />
            </Input.Wrapper>

            <Button size="sm" radius={"md"}>
              검색
            </Button>
          </Group>
          <Group>
            <Button variant="light" size="sm" radius={"md"} onClick={open}>
              직원 등록
            </Button>
            <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
              내려받기
            </Button>
            <Menu shadow="md" position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="light" size={"lg"}>
                  <IconAdjust width="20" height="20" strokeWidth="1.5" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>정렬</Menu.Label>
                <Menu.Item>직급</Menu.Item>
                <Menu.Item>생년월일</Menu.Item>
                <Menu.Item>입사일</Menu.Item>
                <Menu.Item>소속</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <Table striped stickyHeader stickyHeaderOffset={50} highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {STAFF_TABLE_HEADER.map((item: string) => (
                <Table.Th>{item}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>

      <Group justify="center" my={30}>
        <Pagination total={10} radius="md" />
      </Group>
      <Modal opened={opened} onClose={close} title="직원 등록" centered>
        <JoinModal />
      </Modal>
      <Modal opened={deleteModal} onClose={closeDeleteModal} centered title="직원 삭제">
        <Stack>
          <Alert variant="outline" color="red" radius="md" title="해당 직원을 삭제하시겠습니까?" icon={<IconInfo />}>
            삭제 후 되돌릴 수 없습니다.
            <Group mt={"sm"} gap={"xs"}>
              <Text size="xs" c={"gray.7"}>
                김현근2
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                hkkim
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                010-3232-2322
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                asdf@asdf.com{" "}
              </Text>
            </Group>
          </Alert>
          <Group wrap="nowrap">
            <Button variant="light" color="red" fullWidth>
              삭제하기
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={closeDeleteModal}>
              닫기
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Flex>
  );
}

export default page;
