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

function page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: () => api.getNotices(),
  });

  const [notices, setNotices] = useState([]);
  const router = useRouter();
  const pathName = usePathname();
  const newNotice = () => {
    router.push(`${pathName}/new`);
  };

  useEffect(() => {
    if (data?.data.data.notices.length === 0) {
      setNotices([]);
    } else {
      setNotices(data?.data.data.notices);
    }
  }, [data]);
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={NOTICE} />

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Group gap={"xs"} align="end">
          <Input.Wrapper label="공지사항 검색">
            <Input w={250} placeholder="공지사항 제목을 입력해 주세요." radius="md" />
          </Input.Wrapper>

          <Button size="sm" radius={"md"}>
            검색
          </Button>
        </Group>

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
      {notices?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}
    </Flex>
  );
}

export default page;
