"use client";

import { TActivitySettlement } from "@/app/type/activity";
import { Badge, Button, Checkbox, NumberFormatter, Table } from "@mantine/core";
import { memo, useState } from "react";

export const ActivitySettlement = memo(({ data, handleModifyBudget, setSelectedRows, selectedRows, handleModifyNote }: any) => {
  return data?.map((element: TActivitySettlement, index: number) => (
    <Table.Tr fz={"xs"} key={element.activityStatsIdx} bg={selectedRows.includes(element.activityStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
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
        <Button variant="subtle" size="compact-xs" onClick={() => handleModifyBudget(element)}>
          <NumberFormatter thousandSeparator value={element.activityBudget} suffix=" 원" />
        </Button>
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
