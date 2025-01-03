"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";

import { MEAL_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { Box, Button, Divider, Drawer, Flex, Group, ScrollArea, Stack, Table, Text, Title } from "@mantine/core";
import { DateInput, DatePickerInput, MonthPicker, MonthPickerInput, YearPickerInput } from "@mantine/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import React, { useEffect, useState } from "react";
import IconDownArrow from "/public/icons/chevron-down.svg";
import { MealSettlement } from "@/app/components/table/meal/MealSettlement";
import { useDisclosure } from "@mantine/hooks";
const MealExpenseHistory = React.lazy(() => import("@/app/components/meal/settlement/MealExpenseHistory"));

dayjs.locale("ko");

function page() {
  const queryClient = useQueryClient();

  const [date, setDate] = useState<Date | null>(dayjs().toDate());
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

  const selectDate = (e: any) => {
    setDate(e);
    const month = dayjs(e).month() + 1;
    const year = dayjs(e).year();
    setSearchParam((prev: any) => ({ ...prev, month: month, year: year }));
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

  const [selectedRowsDetail, setSelectedRowsDetail] = useState<any>();

  const [opened, { open: openExpensesDetail, close: closeExpensesDetail }] = useDisclosure(false);

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        식대 정산
      </Title>

      <Group justify="space-between" mb={"lg"} align="flex-end">
        <MonthPickerInput
          locale="ko"
          variant="unstyled"
          label="기간 선택"
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-xl)",
              fontWeight: 700,
            },
          }}
          rightSection={<IconDownArrow />}
          rightSectionPointerEvents="none"
          placeholder="조회하실 기간을 선택해 주세요."
          value={date}
          valueFormat="YYYY년   M월"
          onChange={selectDate}
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
            <MealSettlement
              data={mealSettlementData}
              selectedRows={selectedRows}
              setSelectedRowsDetail={setSelectedRowsDetail}
              setSelectedRows={setSelectedRows}
              openExpensesDetail={openExpensesDetail}
            />
          </TableBody>
        </Table>
      </ScrollArea>

      <MealExpenseHistory opened={opened} close={closeExpensesDetail} selectedRowsDetail={selectedRowsDetail} />
    </Flex>
  );
}

export default page;
