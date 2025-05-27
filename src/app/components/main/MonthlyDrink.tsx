import { getMonthlyDrink } from "@/app/api/get/getApi";
import { monthList } from "@/app/utils/selectTimeList";
import { Button, Divider, Group, Loader, NumberFormatter, Paper, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import MonthlyDrinkDetails from "./MonthlyDrinkDetails";
import MonthlyDrinkUpdate from "./MonthlyDrinkUpdate";
const LoadingView = () => (
  <Group justify="center" py={"lg"}>
    <Loader size={"sm"} />
  </Group>
);

const MonthlyDrink = () => {
  const [params, setParams] = useState({ month: (dayjs().month() + 1).toString() });
  const [opened, { open, close }] = useDisclosure(false);
  const [openedUpdate, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["monthlyDrink", { month: params.month }],
    queryFn: () => getMonthlyDrink({ month: params.month }),
  });

  const selectMonth = (value: string | null) => {
    if (!value) return;
    setParams({ month: value });
    // setSelectMonth(value);
  };
  const config = data?.data.data.config;
  const drinksData = data?.data.data.countStats;
  const drinksDetails = data?.data.data.details;
  const totalCount = drinksData?.reduce((acc: number, drink: any) => acc + drink.count, 0);

  return (
    <Paper shadow="lg" p="lg" radius={"lg"}>
      <Group justify="space-between" mb={"sm"}>
        <Text fw={600}>Monthly Meeting 음료 취합</Text>
        <Button variant="subtle" size="compact-xs" onClick={openUpdate} rightSection={<IconChevronRight size={14} />}>
          설정
        </Button>
      </Group>

      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <Stack gap={5}>
            <Group gap={"xs"}>
              <Text fz={"xs"} c={"dimmed"}>
                해당 월 :
              </Text>
              <Select
                placeholder="적용 월을 선택해 주세요."
                size="xs"
                w={80}
                variant="unstyled"
                onChange={selectMonth}
                value={params.month}
                data={monthList().map((item) => ({ value: item.toString(), label: `${item}월` }))}
              />
              {/* <Text fz={"xs"}>{`${config.month} 월`}</Text> */}
            </Group>

            <Group gap={"xs"}>
              <Text fz={"xs"} c={"dimmed"}>
                작성기한 :
              </Text>
              {!config.dueDate ? (
                <Text fz={"xs"} c={"gray"}>
                  작성기한을 설정해 주세요
                </Text>
              ) : (
                <Text fz={"xs"}>{config.dueDate}</Text>
              )}
            </Group>
            <Group gap={"xs"}>
              <Text fz={"xs"} c={"dimmed"}>
                픽업 :
              </Text>
              {config.pickup.length < 1 ? (
                <Text fz={"xs"} c={"gray"}>
                  픽업 인원을 설정해 주세요
                </Text>
              ) : (
                config.pickup.map((item: any) => (
                  <Text key={item} fz={"xs"}>
                    {item}
                  </Text>
                ))
              )}
            </Group>
          </Stack>
          <Divider my={"xs"} />
          <Stack gap={"xs"}>
            {drinksData.map((drink: any) => (
              <Group key={drink.baverage} justify="space-between">
                <Text fz={"xs"} c={"dimmed"}>
                  {drink.baverage} :
                </Text>
                <NumberFormatter style={{ fontSize: "var(--mantine-font-size-xs)" }} value={drink.count} suffix=" 잔" />
              </Group>
            ))}
          </Stack>
          <Divider my={"xs"} />
          <Group justify="space-between">
            <Text fz={"xs"} c={"dimmed"}>
              총계
            </Text>
            <Button size="compact-sm" variant="light" rightSection={<IconChevronRight size={14} />} onClick={open}>
              <NumberFormatter style={{ fontWeight: 600, fontSize: "var(--mantine-font-size-xs)" }} value={totalCount} suffix=" 잔" />
            </Button>
          </Group>
        </>
      )}

      <MonthlyDrinkUpdate opened={openedUpdate} close={closeUpdate} />
      <MonthlyDrinkDetails opened={opened} close={close} details={drinksDetails} />
    </Paper>
  );
};

export default MonthlyDrink;
