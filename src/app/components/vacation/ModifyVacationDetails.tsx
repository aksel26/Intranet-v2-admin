import { Button, Group, Modal, NumberInput, Select, Stack, Text, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import React from "react";
import IconCalendar from "/public/icons/calendar.svg";
function ModifyVacationDetails({ opened, close }: any) {
  return (
    <Modal opened={opened} onClose={close} title="휴가/연차 수정하기" centered>
      <Stack mt={"xs"} gap={"md"} mb={"lg"}>
        <Group gap={"xs"}>
          <Text c={"dimmed"} fz={"sm"} w={50}>
            대상자
          </Text>
          <Text fz={"sm"} mb={4}>
            정진옥 팀장
          </Text>
        </Group>

        <DatePickerInput
          leftSection={<IconCalendar />}
          leftSectionPointerEvents="none"
          label="날짜"
          placeholder="날짜를 선택해 주세요."

          //   value={value}
          //   onChange={setValue}
        />
        <Select defaultValue={"연차"} data={["반반차", "연차", "반차", "Svelte"]} label="휴가 종류" />
        <Select placeholder="부여할 휴가 갯수를 입력하세요." label="승인자" />
        <Textarea label="내용 (특이사항)" description="휴가 수정 사유 등을 입력해 주세요." placeholder="휴가 수정 사유 등을 입력해 주세요." />
      </Stack>

      <Group wrap="nowrap">
        <Button fullWidth>수정</Button>
        <Button fullWidth color="gray" onClick={close}>
          취소
        </Button>
      </Group>
    </Modal>
  );
}

export default ModifyVacationDetails;
