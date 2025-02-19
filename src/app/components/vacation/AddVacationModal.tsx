import { Button, Group, Modal, NumberInput, Select, Stack, Text } from "@mantine/core";
import React from "react";

function AddVacationModal({ opened, close }: any) {
  return (
    <Modal opened={opened} onClose={close} title="휴가 부여하기" centered size={340}>
      <Text c={"dimmed"} fz={"sm"}>
        부여할 휴가 종류와 갯수를 선택해 주세요.
      </Text>
      <Stack mt={"xs"} gap={4}>
        <Group gap={"xs"}>
          <Text c={"dimmed"} fz={"sm"} w={50}>
            대상자
          </Text>
          <Text fz={"sm"} mb={4}>
            정진옥 팀장
          </Text>
        </Group>
        <Group gap={"xs"}>
          <Text c={"dimmed"} fz={"sm"} w={50}>
            적용년도
          </Text>
          <Text fz={"sm"} mb={4}>
            2025
          </Text>
        </Group>
      </Stack>

      <Stack my={"lg"}>
        <Select defaultValue={"연차"} data={["반반차", "연차", "반차", "Svelte"]} label="휴가 종류" />
        <NumberInput placeholder="부여할 휴가 갯수를 입력하세요." label="갯수" />
      </Stack>
      <Group wrap="nowrap">
        <Button fullWidth>확인</Button>
        <Button fullWidth color="gray">
          취소
        </Button>
      </Group>
    </Modal>
  );
}

export default AddVacationModal;
