"use client";
import * as api from "@/app/api/get/getApi";
import DeleteModal from "@/app/components/notice/DeleteModal";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { NOTICE_DETAIL } from "@/app/enums/breadcrumbs";
import { convertFileUnit } from "@/app/utils/convertFileUnit";
import { Box, Button, Center, Divider, Flex, Group, Loader, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
function page() {
  const router = useRouter();
  const pathName = usePathname();
  const goBack = () => router.back();

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const { id } = useParams();

  const [openedPreview, { open: openPreviewModal, close: closePreviewModal }] = useDisclosure(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices", id],
    queryFn: () => api.getNoticesDetail({ noticeIdx: Number(id) }),
  });

  const [info, setInfo] = useState({
    title: "",
    content: "",
    createdAt: "",
    creatorName: "",
    imageUrl: "",
    imageName: "",
    imageSize: 0,
  });

  console.log("info:", info);
  useEffect(() => {
    console.log("data:", data);
    setInfo(data?.data.data[0]);
    sessionStorage.setItem("notice", JSON.stringify(data?.data.data));
  }, [data]);

  const modifyPage = () => router.push(`${pathName}/modify`);

  function createMarkup() {
    return { __html: info?.content };
  }
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={NOTICE_DETAIL} />

      <Stack gap={"lg"} mt={"md"}>
        <Group justify="space-between">
          <Stack>
            <Title order={3}>{info?.title}</Title>
            <Group>
              <Group>
                <Text fz={"sm"} c={"dimmed"}>
                  작성일
                </Text>
                <Text fz={"sm"} c={"dimmed"}>
                  {dayjs(info?.createdAt).format("YYYY-MM-DD")}
                </Text>{" "}
              </Group>
              <Text fz={"sm"} c={"dimmed"}>
                ·
              </Text>
              <Group>
                <Text fz={"sm"} c={"dimmed"}>
                  작성자
                </Text>
                <Text fz={"sm"} c={"dimmed"}>
                  {info?.creatorName}
                </Text>
              </Group>
            </Group>
          </Stack>
          <Group>
            <Button size="xs" variant="light" onClick={modifyPage}>
              수정하기
            </Button>
            <Button size="xs" variant="light" color="red" onClick={openDeleteModal}>
              삭제하기
            </Button>
          </Group>
        </Group>
        <Divider />

        {isLoading ? (
          <Center h={200}>
            <Loader size={30} />
          </Center>
        ) : (
          <>
            <Box dangerouslySetInnerHTML={createMarkup()} mih={200} />
            <Divider />
            <Text fz={"sm"}>첨부파일</Text>
            {info?.imageUrl ? (
              <Button onClick={openPreviewModal} fz={"sm"} variant="subtle" w={"max-content"}>
                {`${info?.imageName}, [${convertFileUnit(info?.imageSize)}]`}
              </Button>
            ) : (
              <Text fz={"sm"} c={"dimmed"}>
                첨부파일이 존재하지 않습니다.
              </Text>
            )}
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
      <Modal opened={openedPreview} onClose={closePreviewModal} title="미리보기">
        <img src={info?.imageUrl} alt="preview" />
      </Modal>
    </Flex>
  );
}

export default page;
