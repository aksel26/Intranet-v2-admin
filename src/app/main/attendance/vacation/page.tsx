"use client";

import * as api from "@/app/api/get/getApi";
import PageList from "@/app/components/Global/PageList";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { VacationTable } from "@/app/components/vacation/VacationTable";
import { VACATION_LIST } from "@/app/enums/breadcrumbs";
import { STAFF_NAME_LABEL } from "@/app/enums/staffInfo";
import { VACATION_TABLE_HEADER } from "@/app/enums/tableHeader";
import { yearsList } from "@/app/utils/selectTimeList";
import { Button, Drawer, Flex, Group, Input, NumberInput, ScrollArea, Select, Table, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import IconDownload from "/public/icons/download.svg";
import AddVacationModal from "@/app/components/vacation/AddVacationModal";
import AddVacationModalDetails from "@/app/components/vacation/AddVacationModalDetails";

interface FormValues {
  userName?: string;
  userGender?: string | null;
  gradeIdx?: number | null;
  year: number | string | null;
}
function page() {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedAddDetails, { open: openAddDetails, close: closeAddDetails }] = useDisclosure(false);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      userName: "",
      year: dayjs().year().toString(),
    },
  });

  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
    perPage: 50,
    userName: "",
    year: dayjs().year().toString(),
    orderby: null,
  });
  console.log("🚀 ~ page ~ searchParam:", searchParam);

  const submitSearch = async (values: any) => {
    setSearchParam((prev) => ({ ...prev, userName: values.userName, year: values.year }));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vacations", searchParam],
    queryFn: () => api.getVacations(searchParam),
  });

  const summaries = data?.data.data.summaries;

  const sortOrder = (e: any) => {
    if (e === "all") {
      setSearchParam((prev: any) => ({ ...prev, sortby: null, orderby: null }));
    } else {
      setSearchParam((prev: any) => ({ ...prev, sortby: "lastLeaveDate", orderby: e }));
    }
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={VACATION_LIST} />
      <Group justify="space-between" align="flex-end" mb={"md"}>
        <form onSubmit={form.onSubmit(submitSearch)}>
          <Group gap={"xs"} align="end">
            <Select
              // label="연도"
              data={yearsList().map((item) => ({ value: item.toString(), label: `${item}년` }))}
              comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
              key={form.key("year")}
              {...form.getInputProps("year")}
              styles={{ root: { width: 100 } }}
            />
            <Input.Wrapper>
              <Input w={250} placeholder="검색 대상의 성영을 입력해 주세요." radius="md" key={form.key("userName")} {...form.getInputProps("userName")} />
            </Input.Wrapper>

            <Button type="submit" variant="light">
              검색
            </Button>
          </Group>
        </form>

        <Group>
          <Button size="sm" radius={"md"} onClick={open}>
            휴가 부여하기
          </Button>
          <Button size="sm" radius={"md"} onClick={openAddDetails}>
            휴가 부여 내역
          </Button>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
            내려받기
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={summaries?.length < 1 ? false : true} stickyHeader highlightOnHover={summaries?.length < 1 ? false : true}>
          <TableHeader columns={VACATION_TABLE_HEADER} sort={sortOrder} value={searchParam} />
          <TableBody data={summaries} columns={VACATION_TABLE_HEADER}>
            <VacationTable data={summaries} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>

      <AddVacationModal opened={opened} close={close} />
      <AddVacationModalDetails opened={openedAddDetails} close={closeAddDetails} />
      {/* {summaries?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />} */}
    </Flex>
  );
}

export default page;
