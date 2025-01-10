"use client";
import * as api from "@/app/api/get/getApi";
import DeleteModal from "@/app/components/notice/DeleteModal";
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { BREADSCRUMBS_NOTICE_DETAIL } from "@/app/enums/breadscrumbs";
import { Anchor, Box, Button, Flex, Group, Modal, Stack, Text, Textarea, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
function page() {
  const router = useRouter();

  const goBack = () => router.back();

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({ queryKey: ["notices", id], queryFn: () => api.getNoticesDetail({ noticeIdx: Number(id) }) });

  const [info, setInfo] = useState({ title: "", content: "", createdAt: "", creatorName: "" });

  useEffect(() => {
    setInfo(data?.data.data);
  }, [data]);

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadScrumb level={BREADSCRUMBS_NOTICE_DETAIL} />

      <Stack gap={"lg"} mt={"md"}>
        <Group justify="space-between">
          <Title order={3}>{info?.title}</Title>
          <Group>
            <Button size="xs" variant="light">
              수정하기
            </Button>
            <Button size="xs" variant="light" color="red" onClick={openDeleteModal}>
              삭제하기
            </Button>
          </Group>
        </Group>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Group justify="space-between">
              <Stack gap={4}>
                <Group>
                  <Text fz={"sm"} c={"dimmed"}>
                    작성자
                  </Text>
                  <Text fz={"sm"} c={"dimmed"}>
                    {info?.creatorName}
                  </Text>
                </Group>
              </Stack>
              <Group>
                <Stack gap={4}>
                  <Group>
                    <Text fz={"sm"} c={"dimmed"}>
                      작성일
                    </Text>
                    <Text fz={"sm"} c={"dimmed"}>
                      {dayjs(info?.createdAt).format("YYYY-MM-DD")}
                    </Text>
                  </Group>
                </Stack>
              </Group>
            </Group>

            <Textarea autosize value={info?.content} />

            <Box w={200} h={200}>
              <img src={data?.data.data.imageUrl} alt="preview" />
            </Box>
            {/* <Image alt="preview" width={"300"} height={"300"} src={data?.data.data.imageUrl} /> */}
            <Anchor href="https://mantine.dev/" target="_blank" underline="hover">
              첨부파일
            </Anchor>
          </>
        )}
        <Group justify="flex-end">
          <Button size="xs" variant="light" color="gray" onClick={goBack}>
            목록으로
          </Button>
        </Group>
      </Stack>

      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} centered title="공지사항 삭제">
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteModal close={closeDeleteModal} id={id} />
        </Suspense>
      </Modal>
    </Flex>
  );
}

export default page;
