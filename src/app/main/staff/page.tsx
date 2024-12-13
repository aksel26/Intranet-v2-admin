"use client";
import * as api from "@/app/api/get/getApi";

import { GRADE_NAME_LABEL, JOIN_DATE_LABEL, STAFF_NAME_LABEL } from "@/app/enums/staffInfo";
import { STAFF_TABLE_HEADER } from "@/app/enums/tableHeader";
import { TStaffs } from "@/app/type/staff";
import { cleanObject } from "@/app/utils/cleanObject";
import { genderFormat } from "@/app/utils/gender";
import { ActionIcon, Alert, Button, Divider, Flex, Group, Input, Menu, Modal, Popover, ScrollArea, Select, Stack, Table, Text, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import React, { Suspense, useEffect, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import More from "/public/icons/dots.svg";
import IconDownload from "/public/icons/download.svg";
import IconUserExclamation from "/public/icons/exclamation-circle.svg";

dayjs.locale("ko");

const JoinModal = React.lazy(() => import("@/app/components/staff/JoinModal"));
const EditModal = React.lazy(() => import("@/app/components/staff/EditModal"));
const DeleteModal = React.lazy(() => import("@/app/components/staff/DeleteModal"));

interface FormValues {
  userName?: string;
  userGender?: string | null;
  gradeIdx?: number | null;
}

function page() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  console.log("🚀 ~ page ~ value:", value);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
  });
  const form = useForm<FormValues>({
    initialValues: {
      userName: "",
      userGender: null,
      gradeIdx: null,
    },
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["staffs", searchParam], queryFn: () => api.getStaffs(searchParam) });
  console.log("🚀 ~ page ~ data:", data);
  const { data: gradeIds, isLoading: gradeIds_isLoading, isError: gradeIds_isError } = useQuery({ queryKey: ["gradeIds"], queryFn: () => api.getGradeIds() });

  const [gradeIdData, setGradeIdData] = useState();

  useEffect(() => {
    gradeIds &&
      setGradeIdData(gradeIds?.data.data.map((item: { gradeIdx: number; gradeName: string }) => ({ value: item.gradeIdx.toString(), label: item.gradeName })));
  }, [gradeIds]);

  const selectDateRange = (date: any) => {
    setValue(date);
    const sDate = dayjs(date[0]).format("YYYY-MM-DD");
    const eDate = dayjs(date[1]).format("YYYY-MM-DD");
    form.setFieldValue("joinSDate", sDate);
    form.setFieldValue("joinEDate", eDate || sDate);
  };

  const submitSearch = async (values: any) => {
    const temp = cleanObject(values, "gradeIdx");
    const result = { ...temp, pageNo: 1 };
    setSearchParam(result);
  };

  const [selectedRow, setSelectedRow] = useState();

  const handleOpenEdit = (row: any) => {
    editOpen();
    setSelectedRow(row);
  };

  const handleDeletStaffModal = (row: any) => {
    setSelectedRow(row);
    openDeleteModal();
  };

  const hq = (input: string | null) => {
    if (!input)
      return (
        <Text size="sm" c={"dimmed"}>
          미등록
        </Text>
      );
    else return input;
  };

  const rows = data?.data.data.users.map((element: TStaffs, index: number) => (
    <Table.Tr key={element.userIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{hq(element.hqName)}</Table.Td>
      <Table.Td>{hq(element.teamName)}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.id || ""}</Table.Td>
      <Table.Td>{element.adminRole === "Y" ? element.adminGradeIdx : "-"}</Table.Td>
      <Table.Td>{element.userCell}</Table.Td>
      <Table.Td>{element.userAddress}</Table.Td>
      <Table.Td>{element.userEmail}</Table.Td>
      <Table.Td>{genderFormat(element.userGender)}</Table.Td>
      <Table.Td>{element.userBirth}</Table.Td>
      <Table.Td>{element.joinDate}</Table.Td>
      <Table.Td>
        {element.comment ? (
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
        ) : (
          "-"
        )}
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={() => handleOpenEdit(element)}>정보 수정</Menu.Item>
            <Menu.Item onClick={() => handleDeletStaffModal(element)} color="red">
              삭제
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        직원 목록 조회
      </Title>
      <Group justify="space-between" mb={"md"} align="flex-end">
        <form onSubmit={form.onSubmit(submitSearch)}>
          <Group gap={"xs"} align="end">
            <Select
              label={GRADE_NAME_LABEL}
              data={gradeIdData || []}
              clearable
              placeholder="직급 선택"
              key={form.key("gradeIdx")}
              {...form.getInputProps("gradeIdx")}
            />
            <DatePickerInput
              w={240}
              valueFormat="YYYY-MM-DD"
              firstDayOfWeek={0}
              type="range"
              locale="ko"
              allowSingleDateInRange
              label={JOIN_DATE_LABEL}
              placeholder="입사일 선택"
              value={value}
              onChange={selectDateRange}
              clearable
            />
            <Select
              clearable
              label={"성별"}
              data={[
                { label: "남", value: "M" },
                { label: "여", value: "W" },
              ]}
              placeholder="성별"
              key={form.key("userGender")}
              {...form.getInputProps("userGender")}
            />
            <Input.Wrapper label={STAFF_NAME_LABEL}>
              <Input w={250} placeholder="검색 대상의 성영을 입력해 주세요." radius="md" key={form.key("userName")} {...form.getInputProps("userName")} />
            </Input.Wrapper>

            <Button type="submit" size="sm" radius={"md"}>
              검색
            </Button>
          </Group>
        </form>
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

      <ScrollArea>
        <Table striped stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {STAFF_TABLE_HEADER.map((item: string, index: number) => (
                <Table.Th key={index}>{item}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal size={"xl"} opened={modalOpened} onClose={close} title="직원 등록" centered>
        <Suspense fallback={<div>Loading...</div>}>
          <JoinModal close={close} />
        </Suspense>
      </Modal>
      <Modal size={"xl"} opened={editOpened} onClose={editClose} title="직원 정보 수정" centered>
        <Suspense fallback={<div>Loading...</div>}>
          <EditModal close={editClose} selectedRow={selectedRow} />
        </Suspense>
      </Modal>
      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} centered title="직원 삭제">
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteModal close={closeDeleteModal} selectedRow={selectedRow} />
        </Suspense>
      </Modal>
    </Flex>
  );
}

export default page;
