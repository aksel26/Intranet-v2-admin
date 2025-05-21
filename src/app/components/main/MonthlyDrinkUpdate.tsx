import { Button, Drawer, Group, Modal, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import React from "react";
const names = "가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허".split("");

const drinks = [
  "HOT 아메리카노",
  "ICE 아메리카노",
  "HOT 디카페인 아메리카노",
  "ICE 디카페인 아메리카노",
  "바닐라크림 콜드브루",
  "ICE 자몽허니블랙티",
  "선택안함",
];
const MonthlyDrinkUpdate = ({ opened, close }: any) => {
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: Array.from({ length: 3 }, () => names[Math.floor(Math.random() * names.length)]).join(""),
    drink: drinks[Math.floor(Math.random() * drinks.length)],
  }));
  return (
    <Modal opened={opened} onClose={close} title="신청 내용 설정">
      <Stack gap={"sm"}>
        <Select label="월 선택" size="sm" placeholder="적용 월을 선택해 주세요." styles={{ label: { color: "var(--mantine-color-gray-5)" } }} />
        <Select label="픽업 인원 선택" size="sm" placeholder="픽업 인원을 선택해 주세요." styles={{ label: { color: "var(--mantine-color-gray-5)" } }} />
        <DatePickerInput label="기한 선택" placeholder="작성 기한을 설정해 주세요." styles={{ label: { color: "var(--mantine-color-gray-5)" } }} />
      </Stack>
      <Group wrap="nowrap" mt="md">
        <Button variant="light" onClick={close} fullWidth data-autofocus>
          저장하기
        </Button>
        <Button variant="light" color="gray" fullWidth onClick={close}>
          닫기
        </Button>
      </Group>
    </Modal>
  );
};

export default MonthlyDrinkUpdate;
