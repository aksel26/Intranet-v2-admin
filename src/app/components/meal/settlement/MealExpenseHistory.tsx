"use client";

import { getMealExpenses, getMealsSettlement } from "@/app/api/get/getApi";
import { Box, Center, Divider, Drawer, Group, NumberFormatter, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useEffect, useState } from "react";
import { MealType } from "../../template/meal/MealType";

function MealExpenseHistory({ opened, close, selectedRowsDetail }: any) {
  console.log("🚀 ~ MealExpenseHistory ~ selectedRowsDetail:", selectedRowsDetail);

  const [details, setDetails] = useState<any>();
  console.log("🚀 ~ MealExpenseHistory ~ details:", details);

  useEffect(() => {
    opened && setDetails(selectedRowsDetail);
  }, [selectedRowsDetail, opened]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mealExpenseHistory", { mealStatsIdx: details?.mealStatsIdx }],
    queryFn: () => getMealExpenses({ mealStatsIdx: details.mealStatsIdx }),
    enabled: opened,
  });
  console.log("🚀 ~ MealExpenseHistory ~ data:", data);

  const mealTypeTagRender = useCallback((category: string | undefined) => {
    return MealType(category);
  }, []);

  return (
    <Drawer
      offset={8}
      size="md"
      radius="md"
      opened={opened}
      onClose={close}
      title={
        <Group>
          <Title order={5}>사용내역 상세</Title>
          <Title order={5}>
            {selectedRowsDetail?.userName}
            <Text component="span" ml={8} fz={"sm"}>
              {selectedRowsDetail?.gradeName}
            </Text>
          </Title>
        </Group>
      }
      position="right"
      styles={{ body: { height: "calc(100% - 60px)", display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
    >
      {data?.data.data.length < 1 ? (
        <Center h={"100%"}>
          <Text c={"dimmed"}>사용내역이 없습니다.</Text>
        </Center>
      ) : (
        <ScrollArea h={"100%"}>
          <Stack gap={"xs"}>
            {data?.data.data.map((item: any, key: number) => {
              if (!item.amount) return null;
              else
                return (
                  <React.Fragment key={key}>
                    <Group>
                      <Text fz={"sm"}>{mealTypeTagRender(item.mealType)}</Text>
                      <Stack gap={0}>
                        <Text fz={"md"} fw={700}>
                          <NumberFormatter thousandSeparator value={item?.amount} suffix=" 원" />
                        </Text>
                        {/* <Text>12월 5일 수요일</Text> */}
                        <Group gap={"xs"}>
                          <Text c={"dimmed"} fz={"xs"}>
                            {item.place}
                          </Text>
                          <Divider orientation="vertical" />
                          <Text c={"dimmed"} fz={"xs"}>
                            {item.payerName}
                          </Text>
                          <Divider orientation="vertical" />

                          <Text c={"dimmed"} fz={"xs"}>
                            {item.targetDay}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>
                    <Divider />
                  </React.Fragment>
                );
            })}
          </Stack>
        </ScrollArea>
      )}

      <Box pt={"sm"}>
        <Stack gap={0}>
          <Divider label={<Title order={6}>사용합계</Title>} labelPosition="left" my={"xs"} />

          <Group justify="space-around">
            <Stack gap={1}>
              <Text fz={"sm"}>조식</Text>
              <Text fz={"sm"}>
                <NumberFormatter thousandSeparator value={details?.breakfastExpense} suffix=" 원" />
              </Text>
            </Stack>
            <Stack gap={1}>
              <Text fz={"sm"}>중식</Text>

              <Text fz={"sm"}>
                <NumberFormatter thousandSeparator value={details?.mealExpense} suffix=" 원" />
              </Text>
            </Stack>
            <Stack gap={1}>
              <Text fz={"sm"}>석식</Text>
              <Text fz={"sm"}>
                <NumberFormatter thousandSeparator value={details?.dinnerExpense} suffix=" 원" />
              </Text>
            </Stack>
          </Group>
        </Stack>
        <Stack gap={0}>
          <Divider label={<Title order={6}>정산금 합계</Title>} labelPosition="left" my={"xs"} />

          <Group justify="space-around">
            <Stack gap={1}>
              <Text fz={"sm"}>조식</Text>
              <Text fz={"sm"}>
                <NumberFormatter thousandSeparator value={details?.breakfastOverpay} suffix=" 원" />
              </Text>
            </Stack>
            <Stack gap={1}>
              <Text fz={"sm"}>중식</Text>
              <Text fz={"sm"}>
                <NumberFormatter thousandSeparator value={details?.mealOverpay} suffix=" 원" />
              </Text>
            </Stack>
            <Stack gap={1}>
              <Text fz={"sm"}>석식</Text>
              <Text fz={"sm"}>
                <NumberFormatter thousandSeparator value={details?.dinnerOverpay} suffix=" 원" />
              </Text>
            </Stack>
          </Group>
        </Stack>
        <Text pr={"xl"} fw={700} fz={"xl"} ta={"right"} mt={"md"}>
          <NumberFormatter thousandSeparator value={details?.totalOverpay} suffix=" 원" />
        </Text>
      </Box>
    </Drawer>
  );
}

export default MealExpenseHistory;
