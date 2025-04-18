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
const elements = [
  { position: 6, mass: (Math.random() * 10).toFixed(0), symbol: "2025-01-12", name: "김랜덤" },
  { position: 7, mass: (Math.random() * 10).toFixed(0), symbol: "2025-01-14", name: "김랜덤" },
  { position: 39, mass: (Math.random() * 10).toFixed(0), symbol: "2025-01-02", name: "김랜덤" },
  { position: 56, mass: (Math.random() * 10).toFixed(0), symbol: "2025-01-05", name: "김랜덤" },
  { position: 58, mass: (Math.random() * 10).toFixed(0), symbol: "2025-01-29", name: "김랜덤" },
];
interface FormValues {
  userName?: string;
  userGender?: string | null;
  gradeIdx?: number | null;
  year: number | string | null;
}
function page() {
  const [opened, { open, close }] = useDisclosure(false);

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
  });

  const submitSearch = async (values: any) => {
    setSearchParam((prev) => ({ ...prev, userName: values.userName, year: values.year }));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vacations", searchParam],
    queryFn: () => api.getVacations(searchParam),
  });
  const summaries = data?.data.data.summaries;

  // 현재 연도부터 이전 3년까지의 연도 배열 생성
  const rows = elements.map((element, index) => (
    <Table.Tr key={element.name}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
    </Table.Tr>
  ));
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
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
            내려받기
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={summaries?.length < 1 ? false : true} stickyHeader highlightOnHover={summaries?.length < 1 ? false : true}>
          <TableHeader columns={VACATION_TABLE_HEADER} />
          <TableBody data={summaries} columns={VACATION_TABLE_HEADER}>
            <VacationTable data={summaries} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
      {/* {summaries?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />} */}

      <Drawer opened={opened} onClose={close} size="xl" position="right" title="연차/휴가 부여하기">
        {/* Drawer content */}
        <Text fz={"lg"} fw={600}>
          🥚 1년차 미만
        </Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>순번</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>입사일</Table.Th>
              <Table.Th>총 연차일</Table.Th>
              <Table.Th>기타 휴무</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Group justify="space-between" mt={"md"}>
          <Text fz={"lg"} fw={600}>
            🐥 1년차
          </Text>
          <Group>
            <NumberInput placeholder="일괄부여할 연차 개수를 입력하세요." w={300} />
            <Button>부여하기</Button>
          </Group>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>순번</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>입사일</Table.Th>
              <Table.Th>총 연차일</Table.Th>
              <Table.Th>기타 휴무</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Group justify="space-between" mt={"md"}>
          <Text fz={"lg"} fw={600}>
            📈 3년차
          </Text>
          <Group>
            <NumberInput placeholder="일괄부여할 연차 개수를 입력하세요." w={300} />
            <Button>부여하기</Button>
          </Group>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>순번</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>입사일</Table.Th>
              <Table.Th>총 연차일</Table.Th>
              <Table.Th>기타 휴무</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Drawer>
    </Flex>
  );
}

export default page;
