import { Button, Divider, Group, NumberFormatter, Paper, ScrollArea, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import React from "react";
import MonthlyDrinkDetails from "./MonthlyDrinkDetails";
import MonthlyDrinkUpdate from "./MonthlyDrinkUpdate";
const MonthlyDrink = () => {
  const drinks = [
    { name: "HOT 아메리카노", value: 53 },
    { name: "ICE 아메리카노", value: 53 },
    { name: "HOT 디카페인 아메리카노", value: 53 },
    { name: "ICE 디카페인 아메리카노", value: 53 },
    { name: "바닐라크림 콜드브루", value: 53 },
    { name: "ICE 자몽허니블랙티", value: 53 },
    { name: "선택안함", value: 53 },
  ];
  const [opened, { open, close }] = useDisclosure(false);
  const [openedUpdate, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  return (
    <Paper shadow="lg" p="lg" radius={"lg"}>
      <Group justify="space-between" mb={"sm"}>
        <Text fw={600}>Monthly Meeting 음료 취합</Text>
        <Button variant="subtle" size="compact-xs" onClick={openUpdate} rightSection={<IconChevronRight size={14} />}>
          설정
        </Button>
      </Group>
      <Stack gap={5}>
        <Group gap={"xs"}>
          <Text fz={"xs"} c={"dimmed"}>
            해당 월 :
          </Text>
          <Text fz={"xs"}>6월</Text>
        </Group>

        <Group gap={"xs"}>
          <Text fz={"xs"} c={"dimmed"}>
            작성기한 :
          </Text>
          <Text fz={"xs"}>2025.05.02</Text>
        </Group>
        <Group gap={"xs"}>
          <Text fz={"xs"} c={"dimmed"}>
            픽업 :
          </Text>
          <Text fz={"xs"}>이재명</Text>
          <Text fz={"xs"}>김문수</Text>
          <Text fz={"xs"}>이준석</Text>
          <Text fz={"xs"}>권영국</Text>
          <Text fz={"xs"}>황교안</Text>
        </Group>
      </Stack>
      <Divider my={"xs"} />
      <Stack gap={"xs"}>
        {drinks.map((drink) => (
          <Group key={drink.name} justify="space-between">
            <Text fz={"xs"} c={"dimmed"}>
              {drink.name} :
            </Text>
            <NumberFormatter style={{ fontSize: "var(--mantine-font-size-xs)" }} value={53} suffix=" 잔" />
          </Group>
        ))}
      </Stack>
      <Divider my={"xs"} />
      <Group justify="space-between">
        <Text fz={"xs"} c={"dimmed"}>
          총계
        </Text>
        <Button size="compact-sm" variant="light" rightSection={<IconChevronRight size={14} />} onClick={open}>
          <NumberFormatter style={{ fontWeight: 600, fontSize: "var(--mantine-font-size-xs)" }} value={984} suffix=" 잔" />
        </Button>
      </Group>

      <MonthlyDrinkUpdate opened={openedUpdate} close={closeUpdate} />
      <MonthlyDrinkDetails opened={opened} close={close} />
    </Paper>
  );
};

export default MonthlyDrink;
