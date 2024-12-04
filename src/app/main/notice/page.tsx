"use client";
import { ActionIcon, Button, Flex, Group, Input, Menu, ScrollArea, Table, Title } from "@mantine/core";
import React from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import { TableHeader } from "@/app/components/Global/table/Header";
import { TableBody } from "@/app/components/Global/table/Body";
import { NOTICE_HEADER } from "@/app/enums/tableHeader";
import { NoticeTable } from "@/app/components/notice/Notice";

const elements = Array.from({ length: 41 }, (_, index) => {
  return {
    position: index + 1,
    title: "제목",
    writer: "김현자",
    createdAt: "2024-01-10",
  };
});
function page() {
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        공지사항
      </Title>
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
          <Button>작성하기</Button>
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
        <Table striped={elements?.length < 1 ? false : true} stickyHeader highlightOnHover={elements?.length < 1 ? false : true}>
          <TableHeader columns={NOTICE_HEADER} />
          <TableBody data={elements} columns={NOTICE_HEADER}>
            <NoticeTable data={elements} />
          </TableBody>
        </Table>
      </ScrollArea>
    </Flex>
  );
}

export default page;
