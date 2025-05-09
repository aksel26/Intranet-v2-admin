"use client";

import { TActivitySettlement } from "@/app/type/activity";
import { Badge, Button, Checkbox, NumberFormatter, NumberInput, Table } from "@mantine/core";
import { IconCornerDownLeft } from "@tabler/icons-react";
import { memo } from "react";

export const ActivitySettlement = memo(({ data, setNewTotalBudget, handleModifyTotalBudget, setSelectedRows, selectedRows, handleModifyNote }: any) => {
  return data?.map((element: TActivitySettlement, index: number) => {
    const isSelected = !!selectedRows.find((item: TActivitySettlement) => item.activityStatsIdx === element.activityStatsIdx);
    return (
      <Table.Tr fz={"xs"} key={element.activityStatsIdx} bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}>
        <Table.Td>
          <Checkbox
            size="xs"
            radius="sm"
            aria-label="Select row"
            checked={isSelected}
            onChange={(event) => {
              const currentActivityStatsIdx = element.activityStatsIdx;
              if (event.currentTarget.checked) {
                // Add the current element's mealStatsIdx to selectedRows if checked
                setSelectedRows([...selectedRows, element]);
              } else {
                // Remove the current element's mealStatsIdx from selectedRows if unchecked
                setSelectedRows(selectedRows.filter((row: TActivitySettlement) => row.activityStatsIdx !== currentActivityStatsIdx));
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
            value={element.activityBudget}
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
        {/* <Table.Td>
        <Button variant="subtle" size="compact-xs" onClick={() => handleModifyBudget(element)}>
          <NumberFormatter thousandSeparator value={element.activityBudget} suffix=" 원" />
        </Button>
      </Table.Td> */}
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
    );
  });
});
