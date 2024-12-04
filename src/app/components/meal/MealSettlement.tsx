"use client";

import { Badge, Checkbox, NumberFormatter, Table } from "@mantine/core";
import { memo } from "react";

export const MealSettlement = memo(({ data, setSelectedRows, selectedRows }: any) => {
  return data?.map((element: any, index: number) => (
    <Table.Tr key={element.mealStatsIdx} bg={selectedRows.includes(element.mealStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.mealStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.mealStatsIdx]
                : selectedRows.filter((mealStatsIdx: number) => mealStatsIdx !== element.mealStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.mealBudget} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.mealExpense} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.mealBalance} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{element.clearStatus === "not_yet" ? "미정산" : "정산완료"}</Badge>
      </Table.Td>

      <Table.Td>{element.note}</Table.Td>
    </Table.Tr>
  ));
});
