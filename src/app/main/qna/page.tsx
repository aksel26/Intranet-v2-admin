"use client";
import * as api from "@/app/api/get/getApi";
import { HEIGHT } from "@/app/enums/design";
import { QNA_HEADER } from "@/app/enums/tableHeader";
import { TQna } from "@/app/type/qna";
import { ActionIcon, Box, Button, Center, Flex, Group, Input, LoadingOverlay, Menu, Modal, ScrollArea, Stack, Table, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import NoList from "/public/icons/no-list.svg";

import SubmitQna from "@/app/components/qna/SubmitQna";
import { categoryTag, replyStatusTag } from "@/app/components/template/qna/category";
import { useDisclosure } from "@mantine/hooks";
function page() {
  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
  });
  const { data, isLoading, isError } = useQuery({ queryKey: ["qna", searchParam], queryFn: () => api.getQna(searchParam) });

  const [opened, { open, close }] = useDisclosure(false);

  const categoryTagRender = useCallback((category: string | undefined) => {
    return categoryTag(category);
  }, []);

  const replyStatusTagRender = useCallback((status: string) => {
    return replyStatusTag(status);
  }, []);

  const [selectQna, setSelectQna] = useState<TQna>();

  const openQna = (element: TQna) => {
    setSelectQna(element);
    open();
  };

  const rows = data?.data.data.qna.map((element: TQna, index: number) => (
    <Table.Tr key={element.qnaIdx} onClick={() => openQna(element)} styles={{ tr: { cursor: "pointer" } }}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.userCell}</Table.Td>
      <Table.Td>{categoryTagRender(element.category)}</Table.Td>
      <Table.Td>{element.text}</Table.Td>
      <Table.Td>{replyStatusTagRender(element.replySuccessYN)}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        문의내역
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
      {data?.data.data.qna.length < 1 ? (
        <Center h={400}>
          <Stack align="center">
            <NoList width="30" height="30" />
            <Text c={"dimmed"}>정산 내역 목록이 없습니다.</Text>
          </Stack>
        </Center>
      ) : (
        // <Box pos={"relative"} h={"50vh"}>
        //   <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ type: "bars" }} />
        <ScrollArea>
          <Table striped stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {QNA_HEADER.map((item: string, index: number) => (
                  <Table.Th key={index}>{item}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
        // </Box>
      )}
      {/* <Group justify="center">
        <Pagination total={10} radius="md" />
      </Group> */}

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group align="center">
            <Title order={5}>문의 내역</Title>
            {categoryTagRender(selectQna?.category)}
          </Group>
        }
        centered
      >
        <SubmitQna selectQna={selectQna} close={close} />
      </Modal>
    </Flex>
  );
}

export default page;
