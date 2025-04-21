"use client";
import * as api from "@/app/api/get/getApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";

import { MealSettlement } from "@/app/components/table/meal/MealSettlement";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { MEAL_CONFIG } from "@/app/enums/breadcrumbs";
import { MEAL_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { monthList, yearsList } from "@/app/utils/selectTimeList";
import { Button, Flex, Group, ScrollArea, Select, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";

const MealExpenseHistory = React.lazy(() => import("@/app/components/meal/settlement/MealExpenseHistory"));
const MealBaseAmountDrawer = React.lazy(() => import("@/app/components/meal/settlement/MealBaseAmountDrawer"));
const ModifyNote = React.lazy(() => import("@/app/components/meal/settlement/ModifyNote"));
const SettlementCancelConfirm = React.lazy(() => import("@/app/components/meal/settlement/SettlementCancelConfirm"));
const SettlementConfirm = React.lazy(() => import("@/app/components/meal/settlement/SettlementConfirm"));

function page() {
  const [opened, { open: openExpensesDetail, close: closeExpensesDetail }] = useDisclosure(false);
  const [baseAmountOpened, { open: openBaseAmount, close: closeBaseAmount }] = useDisclosure(false);
  const [modifyNoteOpened, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [settlementOpened, { open: openSettlement, close: closeSettlement }] = useDisclosure(false);
  const [settlementCancelOpened, { open: openSettlementCancel, close: closeSettlementCancel }] = useDisclosure(false);

  const [month, setMonth] = useState((dayjs().month() + 1).toString());
  const [year, setYear] = useState(dayjs().year().toString());

  const [selectedRowsDetail, setSelectedRowsDetail] = useState<any>();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mealsSettlement", searchParam],
    queryFn: () => api.getMealsSettlement(searchParam),
  });

  const handleSettlementCancel = () => {
    openSettlementCancel();
  };

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        color: "yellow",
        message: "1명 이상이 선택되어야 합니다.",
        title: "정산완료",
      });
      return;
    }

    openSettlement();
  };

  const mealStats = data?.data.data.mealStats;

  const selectYear = (e: any) => {
    setSearchParam((prev: any) => ({
      ...prev,
      year: e,
    }));
    setYear(e);
  };

  const selectMonth = (e: any) => {
    setSearchParam((prev: any) => ({
      ...prev,
      month: e,
    }));
    setMonth(e);
  };

  const handleModifyNote = (element: any) => {
    openModifyNote();
    setSelectedRowsDetail(element);
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={MEAL_CONFIG} />

      <Group justify="space-between" align="flex-end" mb={"md"}>
        <Group>
          <Select
            data={yearsList().map((item) => ({ value: item.toString(), label: `${item}년` }))}
            comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
            value={year}
            onChange={selectYear}
          />

          <Select
            allowDeselect={false}
            data={monthList().map((item) => ({ value: item.toString(), label: `${item}월` }))}
            comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
            onChange={selectMonth}
            value={month}
          />
        </Group>

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
          <Button size="sm" radius="md" onClick={openBaseAmount}>
            기본금액 설정
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={mealStats?.length < 1 ? false : true} stickyHeader highlightOnHover={mealStats?.length < 1 ? false : true}>
          <TableHeader columns={MEAL_SETTLEMENT_HEADER} />
          <TableBody data={mealStats} columns={MEAL_SETTLEMENT_HEADER}>
            <MealSettlement
              data={mealStats}
              selectedRows={selectedRows}
              setSelectedRowsDetail={setSelectedRowsDetail}
              setSelectedRows={setSelectedRows}
              openExpensesDetail={openExpensesDetail}
              handleModifyNote={handleModifyNote}
            />
          </TableBody>
        </Table>
      </ScrollArea>

      <MealExpenseHistory opened={opened} close={closeExpensesDetail} selectedRowsDetail={selectedRowsDetail} />
      <MealBaseAmountDrawer opened={baseAmountOpened} close={closeBaseAmount} />
      <ModifyNote close={closeModifyNote} opened={modifyNoteOpened} selectedRows={selectedRowsDetail} />
      <SettlementConfirm close={closeSettlement} opened={settlementOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      <SettlementCancelConfirm close={closeSettlementCancel} opened={settlementCancelOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
    </Flex>
  );
}

export default page;
