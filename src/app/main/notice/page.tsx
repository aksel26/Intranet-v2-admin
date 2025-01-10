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
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { BREADSCRUMBS_NOTICE } from "@/app/enums/breadscrumbs";

function page() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["notices"], queryFn: () => api.getNotices() });
  console.log("🚀 ~ page ~ data:", data);

  const [notices, setNotices] = useState([]);
  console.log("🚀 ~ page ~ notices:", notices);
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
      <BreadScrumb level={BREADSCRUMBS_NOTICE} />

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Group gap={"xs"} align="end">
          <Input.Wrapper label="성명">
            <Input
              w={250}
              placeholder="검색 대상의 성명을 입력해 주세요."
              radius="md"
              //    ref={userNameRef}
            />
          </Input.Wrapper>

          <Button
            size="sm"
            radius={"md"}
            // onClick={search}
          >
            검색
          </Button>
        </Group>
        <Group>
          <Button onClick={newNotice}>작성하기</Button>
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
