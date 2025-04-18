"use client";
import * as api from "@/app/api/get/getApi";

import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import ModifyNote from "@/app/components/staff/ModifyNote";
import { StaffList } from "@/app/components/table/staff";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { STAFF } from "@/app/enums/breadcrumbs";
import { STAFF_TABLE_HEADER } from "@/app/enums/tableHeader";
import { ActionIcon, Button, Flex, Group, Input, Menu, Modal, ScrollArea, Select, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense, useEffect, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";

const JoinModal = React.lazy(() => import("@/app/components/staff/JoinModal"));
const EditModal = React.lazy(() => import("@/app/components/staff/EditModal"));
const DeleteModal = React.lazy(() => import("@/app/components/staff/DeleteModal"));

interface FormValues {
  userName?: string;
  gradeIdx?: number | null;
}

function page() {
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [openedModifyNote, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);

  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
    perPage: 50,
  });
  const form = useForm<FormValues>({
    initialValues: {
      userName: "",
      gradeIdx: null,
    },
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["staffs", searchParam], queryFn: () => api.getStaffs(searchParam) });
  const { data: gradeIds, isLoading: gradeIds_isLoading, isError: gradeIds_isError } = useQuery({ queryKey: ["gradeIds"], queryFn: () => api.getGradeIds() });

  const [gradeIdData, setGradeIdData] = useState();

  useEffect(() => {
    gradeIds &&
      setGradeIdData(gradeIds?.data.data.map((item: { gradeIdx: number; gradeName: string }) => ({ value: item.gradeIdx.toString(), label: item.gradeName })));
  }, [gradeIds]);

  const users = data?.data.data.users;

  const submitSearch = async (values: any) => {
    const submit = { ...values };
    submit.gradeIdx = Number(submit.gradeIdx) || null;
    setSearchParam(submit);
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

  const selectNote = (row: any) => {
    setSelectedRow(row);
    openModifyNote();
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      {/* <Title order={3} mb={"lg"}>
        직원 목록 조회
      </Title> */}

      <BreadCrumb level={STAFF} />
      <Group justify="space-between" mb={"md"} align="flex-end">
        <form onSubmit={form.onSubmit(submitSearch)}>
          <Group gap={"xs"} align="end">
            <Select
              // label={GRADE_NAME_LABEL}
              data={gradeIdData || []}
              clearable
              placeholder="직급 선택"
              key={form.key("gradeIdx")}
              {...form.getInputProps("gradeIdx")}
            />

            <Input.Wrapper>
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
        <Table striped={users?.length < 1 ? false : true} stickyHeader highlightOnHover={users?.length < 1 ? false : true}>
          <TableHeader columns={STAFF_TABLE_HEADER} />
          <TableBody data={users} columns={STAFF_TABLE_HEADER}>
            <StaffList data={users} selectNote={selectNote} handleOpenEdit={handleOpenEdit} />
          </TableBody>
        </Table>
      </ScrollArea>
      {/* {users?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />} */}

      <Modal size={"xl"} opened={modalOpened} onClose={close} title="직원 등록" centered>
        <Suspense fallback={<div>Loading...</div>}>
          <JoinModal close={close} />
        </Suspense>
      </Modal>
      <EditModal close={editClose} selectedRow={selectedRow} opened={editOpened} />
      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} centered title="직원 삭제">
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteModal close={closeDeleteModal} selectedRow={selectedRow} />
        </Suspense>
      </Modal>

      <ModifyNote opened={openedModifyNote} close={closeModifyNote} currentRow={selectedRow} />
    </Flex>
  );
}

export default page;
