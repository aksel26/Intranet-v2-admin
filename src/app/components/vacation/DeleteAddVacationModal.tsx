import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import React from "react";

function DeleteAddVacationModal({ opened, close }: any) {
  return (
    <Modal opened={opened} onClose={close} title="휴가 부여 내역 삭제" centered>
      <Stack gap={4}>
        <Group>
          <Text fz={"sm"}>휴가 종류</Text>
          <Text fz={"sm"}>수량 : 1개</Text>
          <Text fz={"sm"}>워크샵 경품</Text>
        </Group>
        <Group>
          <Text w={50} fz={"sm"} c={"dimmed"}>
            추가날짜
          </Text>
          <Text fz={"sm"} c={"dimmed"}>
            2024-12-21(화)
          </Text>
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

export default DeleteAddVacationModal;
