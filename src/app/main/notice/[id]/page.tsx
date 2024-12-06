"use client";
import DeleteModal from "@/app/components/notice/DeleteModal";
import { Anchor, Box, Button, Flex, Grid, GridCol, Group, Modal, Stack, Text, Textarea, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";

function page() {
  const router = useRouter();

  const goBack = () => router.back();

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        공지사항 상세보기
      </Title>

      <Stack gap={"lg"}>
        <Group justify="space-between">
          <Title order={3}> Dolor aliquip do nulla.</Title>
          <Group>
            <Button size="xs" variant="light">
              수정하기
            </Button>
            <Button size="xs" variant="light" color="red" onClick={openDeleteModal}>
              삭제하기
            </Button>
          </Group>
        </Group>

        <Group justify="space-between">
          <Stack gap={4}>
            <Group>
              <Text fz={"sm"} c={"dimmed"}>
                작성자
              </Text>
              <Text fz={"sm"} c={"dimmed"}>
                anim
              </Text>
            </Group>
            <Group>
              <Text fz={"sm"} c={"dimmed"}>
                참조
              </Text>
              <Text fz={"sm"} c={"dimmed"}>
                anim,elit
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
                  2024-11-11
                </Text>
              </Group>
              <Group>
                <Text fz={"sm"} c={"dimmed"}>
                  수정일
                </Text>
                <Text fz={"sm"} c={"dimmed"}>
                  2024-11-11
                </Text>
              </Group>
            </Stack>
          </Group>
        </Group>

        <Textarea
          autosize
          value={
            "Enim Lorem elit eu eiusmod veniam laborum occaecat minim culpa proident irure occaecat dolore officia dolor. Eu excepteur incididunt laborum duis in nulla officia commodo cupidatat veniam ipsum est. Voluptate cupidatat irure adipisicing incididunt amet laboris. Cillum elit voluptate nulla cupidatat. Cillum pariatur tempor ipsum quis irure dolore id aliquip amet officia.Laborum eiusmod fugiat esse cupidatat sit commodo Lorem ad magna. Deserunt mollit proident eu minim in dolore irure laborum eiusmod non dolor. Amet aute aliquip reprehenderit laborum anim anim incididunt ullamco deserunt laborum dolore adipisicing esse. Et eu non non ad anim non aliquip esse pariatur occaecat labore pariatur exercitation. Fugiat consectetur laborum mollit elit qui ut nisi ipsum dolore id est. Esse exercitation fugiat sint ipsum."
          }
        />
        <Anchor href="https://mantine.dev/" target="_blank" underline="hover">
          첨부파일
        </Anchor>
        <Group justify="flex-end">
          <Button size="xs" variant="light" color="gray" onClick={goBack}>
            목록으로
          </Button>
        </Group>
      </Stack>

      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} centered title="공지사항 삭제">
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteModal close={closeDeleteModal} />
        </Suspense>
      </Modal>
    </Flex>
  );
}

export default page;
