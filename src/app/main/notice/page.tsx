"use client";
import { ActionIcon, Button, Flex, Group, Input, Menu, ScrollArea, Table, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import { TableHeader } from "@/app/components/Global/table/Header";
import { TableBody } from "@/app/components/Global/table/Body";
import { NOTICE_HEADER } from "@/app/enums/tableHeader";
import { NoticeTable } from "@/app/components/notice/Notice";
import { usePathname, useRouter } from "next/navigation";
import PageList from "@/app/components/Global/PageList";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/app/api/get/getApi";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { NOTICE } from "@/app/enums/breadcrumbs";
import { useForm } from "@mantine/form";

function page() {
  const [params, setParams] = useState({
    pageNo: 1,
    perPage: 50,
    searchWord: "",
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices", params],
    queryFn: () => api.getNotices(params),
  });
  const router = useRouter();
  const pathName = usePathname();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      searchWord: "",
    },
  });

  const submitSearch = (values: any) => {
    setParams({
      ...params,
      pageNo: 1,
      searchWord: values.searchWord,
    });
  };

  const newNotice = () => {
    router.push(`${pathName}/new`);
  };

  const notices = data?.data.data.result;
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={NOTICE} />

      <Group justify="space-between" mb={"md"} align="flex-end">
        <form onSubmit={form.onSubmit((values) => submitSearch(values))}>
          <Group gap={"xs"} align="end">
            <Input w={250} placeholder="공지사항 제목을 입력해 주세요." radius="md" {...form.getInputProps("searchWord")} />

            <Button size="sm" radius={"md"} type="submit">
              검색
            </Button>
          </Group>
        </form>
        <Button onClick={newNotice}>작성하기</Button>
      </Group>
      <ScrollArea>
        <Table striped={notices?.length < 1 ? false : true} stickyHeader highlightOnHover={notices?.length < 1 ? false : true}>
          <TableHeader columns={NOTICE_HEADER} />
          <TableBody data={notices} columns={NOTICE_HEADER}>
            <NoticeTable data={notices} />
          </TableBody>
        </Table>
      </ScrollArea>
      {notices?.length < 1 ? null : <PageList controls={setParams} totalPage={data?.data.data.totalPage} />}
    </Flex>
  );
}

export default page;
