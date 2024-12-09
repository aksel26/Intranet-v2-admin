"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";

import { MEAL_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { Button, Flex, Group, ScrollArea, Table, Title } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useEffect, useState } from "react";
import IconDownArrow from "/public/icons/chevron-down.svg";
import { MealSettlement } from "@/app/components/table/meal/MealSettlement";
dayjs.locale("ko");
function page() {
  const queryClient = useQueryClient();

  const [value, setValue] = useState<Date | null>(dayjs().toDate());
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [mealSettlementData, setMealSettlementData] = useState([]);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["mealsSettlement", searchParam], queryFn: () => api.getMealsSettlement(searchParam) });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.settlement(values),
  });
  const { mutate: settlementCancel } = useMutation({
    mutationFn: (values: any) => postApi.settlementCancel(values),
  });

  const selectMonth = (e: any) => {
    setValue(e);
    const year = dayjs(e).year();
    const month = dayjs(e).month() + 1;
    setSearchParam((prev: any) => ({ ...prev, year: year, month: month }));
  };

  const handleSettlementCancel = () => {
    settlementCancel(
      {
        mealStatsIdxList: selectedRows,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
          setSelectedRows([]);
          notification({
            title: "정산",
            message: "정산취소가 완료되었습니다.",
            color: "green",
          });
        },
      }
    );
  };

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "정산",
        message: "정산처리할 인원을 먼저 선택해 주세요.",
        color: "yellow",
      });
      return;
    }
    mutate(
      {
        mealStatsIdxList: selectedRows,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
          setSelectedRows([]);
          notification({
            title: "정산",
            message: "정산이 정상적으로 완료되었습니다.",
            color: "green",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (data?.data.data.mealStats.length === 0) {
      setMealSettlementData([]);
    } else {
      setMealSettlementData(data?.data.data.mealStats);
    }
  }, [data]);

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        식대 정산
      </Title>

      <Group justify="space-between" mb={"lg"} align="flex-end">
        <MonthPickerInput
          locale="ko"
          variant="unstyled"
          label="월 선택"
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-xl)",
              fontWeight: 700,
            },
          }}
          rightSection={<IconDownArrow />}
          rightSectionPointerEvents="none"
          placeholder="조회하실 월을 선택해 주세요."
          value={value}
          valueFormat="M월"
          onChange={selectMonth}
          w={100}
        />
        <Group>
          {selectedRows.length >= 1 && (
            <Button size="sm" radius="md" color="red" onClick={handleSettlementCancel}>
              정산취소
            </Button>
          )}
          <Button size="sm" radius="md" onClick={handleSettlement}>
            정산완료
          </Button>
          <Button size="sm" radius="md">
            정산요청
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={mealSettlementData?.length < 1 ? false : true} stickyHeader highlightOnHover={mealSettlementData?.length < 1 ? false : true}>
          <TableHeader columns={MEAL_SETTLEMENT_HEADER} />
          <TableBody data={mealSettlementData} columns={MEAL_SETTLEMENT_HEADER}>
            <MealSettlement data={mealSettlementData} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
    </Flex>
  );
}

export default page;
