"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";

import { MealSettlement } from "@/app/components/table/meal/MealSettlement";
import { MEAL_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import {
  Button,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import React, { useEffect, useState } from "react";
import IconDownArrow from "/public/icons/chevron-down.svg";
import IconInfo from "/public/icons/info-circle.svg";
const MealExpenseHistory = React.lazy(
  () => import("@/app/components/meal/settlement/MealExpenseHistory")
);

const MealBaseAmountDrawer = React.lazy(
  () => import("@/app/components/meal/settlement/MealBaseAmountDrawer")
);

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mealsSettlement", searchParam],
    queryFn: () => api.getMealsSettlement(searchParam),
  });

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
          await queryClient.invalidateQueries({
            queryKey: ["mealsSettlement"],
          });
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
          await queryClient.invalidateQueries({
            queryKey: ["mealsSettlement"],
          });
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

  const [opened, { open: openExpensesDetail, close: closeExpensesDetail }] =
    useDisclosure(false);

  const [baseAmountOpened, { open: openBaseAmount, close: closeBaseAmount }] =
    useDisclosure(false);

  return (
    <Flex
      direction={"column"}
      h={"100%"}
      styles={{ root: { overflow: "hidden" } }}
    >
      <Title order={3} mb={"lg"}>
        금액설정 및 정산
      </Title>

      <Group justify="space-between" align="flex-end">
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
            <Button
              size="sm"
              radius="md"
              color="red"
              onClick={handleSettlementCancel}
            >
              정산취소
            </Button>
          )}
          <Button size="sm" radius="md" onClick={handleSettlement}>
            정산완료
          </Button>
          <Button size="sm" radius="md">
            정산요청
          </Button>
          <Button size="sm" radius="md" onClick={openBaseAmount}>
            기본금액 설정
          </Button>
        </Group>
      </Group>
      <Group align="center" gap={"xs"} mb="lg">
        <ThemeIcon variant="transparent">
          <IconInfo width="20" height="20" />
        </ThemeIcon>

        <Stack gap={0}>
          <Text fz={"sm"}>총 금액</Text>

          <Text fz={"xs"} c={"dimmed"}>
            30(업무일) X 10,000(기본금액) = 300,0000원
          </Text>
        </Stack>
      </Group>

      <ScrollArea>
        <Table
          striped={mealSettlementData?.length < 1 ? false : true}
          stickyHeader
          highlightOnHover={mealSettlementData?.length < 1 ? false : true}
        >
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

      <MealExpenseHistory
        opened={opened}
        close={closeExpensesDetail}
        selectedRowsDetail={selectedRowsDetail}
      />

      <MealBaseAmountDrawer opened={baseAmountOpened} close={closeBaseAmount} />
    </Flex>
  );
}

export default page;
