import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import React from "react";

function DeleteVacationModal({ opened, close }: any) {
  return (
    <Modal opened={opened} onClose={close} title="휴가 내역 삭제" centered>
      <Stack gap={4}>
        <Group justify="space-between">
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              회계년도
            </Text>
            <Text fz={"sm"} ta={"center"}>
              2024
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              반차
            </Text>
            <Text fz={"sm"} ta={"center"}>
              0.5개
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              내용
            </Text>
            <Text fz={"sm"} ta={"center"}>
              워크샵 경품
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              승인 상태
            </Text>
            <Text fz={"sm"} ta={"center"}>
              승인
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              사용일자
            </Text>
            <Text fz={"sm"} ta={"center"}>
              2024-12-21(화)
            </Text>
          </Stack>
        </Group>
      </Stack>

      <Text fz={"sm"} mt={"lg"}>
        해당 휴가 건을 삭제하시겠습니까?
      </Text>
      <Group gap={"xs"} mt={"lg"} wrap="nowrap">
        <Button fullWidth color="red" variant="light">
          삭제
        </Button>
        <Button fullWidth color="gray" variant="light" onClick={close}>
          취소
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteVacationModal;
