"use client";

import { TActivitySettlement } from "@/app/type/activity";
import { Badge, Button, Checkbox, NumberFormatter, Table } from "@mantine/core";
import { memo, useState } from "react";
import ModifyActivityBudget from "../../activity/settlement/template/ModifyActivityBudget";

export const ActivitySettlement = memo(({ data, setSelectedRows, selectedRows, handleModifyNote }: any) => {
  const [openedRowId, setOpenedRowId] = useState<number | null>(null);
  const [openedBudgetRowId, setOpenedBudgetRowId] = useState<number | null>(null);
  const handleRowClick = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenedRowId(openedRowId === id ? null : id);
  };

  const handleRowClickBudget = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenedBudgetRowId(openedBudgetRowId === id ? null : id);
  };

  return data?.map((element: TActivitySettlement, index: number) => (
    <Table.Tr key={element.activityStatsIdx} bg={selectedRows.includes(element.activityStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={!!selectedRows.find((item: TActivitySettlement) => item.activityStatsIdx === element.activityStatsIdx)}
          onChange={(event) => {
            const currentActivityStatsIdx = element.activityStatsIdx;
            console.log("🚀 ~ MealSettlement ~ currentMealStatsIdx:", currentActivityStatsIdx);
            console.log(event.currentTarget.checked);
            if (event.currentTarget.checked) {
              // Add the current element's activityStatsIdx to selectedRows if checked
              setSelectedRows([...selectedRows, element]);
            } else {
              // Remove the current element's activityStatsIdx from selectedRows if unchecked
              setSelectedRows(selectedRows.filter((row: TActivitySettlement) => row.activityStatsIdx !== currentActivityStatsIdx));
            }
          }}
        />
      </Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <Button variant="subtle" size="compact-sm" onClick={(e) => handleRowClickBudget(element.activityStatsIdx, e)}>
          <NumberFormatter thousandSeparator value={element.activityBudget} suffix=" 원" />
        </Button>
        <ModifyActivityBudget opened={openedBudgetRowId === element.activityStatsIdx} element={element} close={() => setOpenedBudgetRowId(null)} />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityExpense} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityBalance} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.totalOverpay} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{element.clearStatus === "not_yet" ? "미정산" : "정산완료"}</Badge>
      </Table.Td>

      <Table.Td>
        {element.note ? (
          <Button size="compact-xs" variant="light" color="orange" onClick={() => handleModifyNote(element)}>
            조회
          </Button>
        ) : (
          <Button size="compact-xs" variant="light" onClick={() => handleModifyNote(element)}>
            등록
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));
});
