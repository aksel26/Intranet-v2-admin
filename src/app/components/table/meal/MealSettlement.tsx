"use client";

import { TMealSettlement } from "@/app/type/meal";
import { Anchor, Badge, Button, Checkbox, NumberFormatter, NumberInput, Table } from "@mantine/core";
import { IconCornerDownLeft } from "@tabler/icons-react";
import { memo } from "react";

export const MealSettlement = memo(
  ({ data, setSelectedRows, selectedRows, setSelectedRowsDetail, openExpensesDetail, handleModifyNote, setNewTotalBudget, handleModifyTotalBudget }: any) => {
    const handleExpensesDetail = (element: any) => {
      setSelectedRowsDetail(element);
      openExpensesDetail();
    };

    return data?.map((element: TMealSettlement, index: number) => (
      <Table.Tr fz={"xs"} key={element.mealStatsIdx} bg={selectedRows.includes(element.mealStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
        <Table.Td>
          <Checkbox
            size="xs"
            radius="sm"
            aria-label="Select row"
            checked={!!selectedRows.find((item: TMealSettlement) => item.mealStatsIdx === element.mealStatsIdx)}
            onChange={(event) => {
              const currentMealStatsIdx = element.mealStatsIdx;
              if (event.currentTarget.checked) {
                // Add the current element's mealStatsIdx to selectedRows if checked
                setSelectedRows([...selectedRows, element]);
              } else {
                // Remove the current element's mealStatsIdx from selectedRows if unchecked
                setSelectedRows(selectedRows.filter((row: TMealSettlement) => row.mealStatsIdx !== currentMealStatsIdx));
              }
            }}
          />
        </Table.Td>
        <Table.Td>{element.teamName}</Table.Td>
        <Table.Td>{element.gradeName}</Table.Td>
        <Table.Td>{element.userName}</Table.Td>
        <Table.Td w={180}>
          <NumberInput
            thousandSeparator
            value={element.mealBudget}
            suffix=" 원"
            variant="unstyled"
            hideControls
            w={120}
            size="xs"
            onChange={setNewTotalBudget}
            onKeyDown={(e) => handleModifyTotalBudget(e, element)}
            rightSection={<IconCornerDownLeft size={12} strokeWidth={1.2} color="gray" />}
            styles={{
              input: { fontSize: "var(--mantine-font-size-xs)", color: "var(--mantine-color-blue-7)" },
              section: { marginRight: 4 },
            }}
          />
        </Table.Td>
        <Table.Td>
          <Anchor fz={"sm"} onClick={() => handleExpensesDetail(element)}>
            <NumberFormatter style={{ fontSize: "var(--mantine-font-size-xs)" }} thousandSeparator value={element.mealExpense} suffix=" 원" />
          </Anchor>
        </Table.Td>
        <Table.Td>
          <NumberFormatter thousandSeparator value={element.mealBalance} suffix=" 원" />
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
  }
);
