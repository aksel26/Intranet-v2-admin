"use client";

import { TWelfareSettlement } from "@/app/type/welfare";
import { settlementStatus } from "@/app/utils/settlement";
import { Badge, Button, Checkbox, NumberFormatter, NumberInput, Table } from "@mantine/core";
import { IconCornerDownLeft } from "@tabler/icons-react";
import { memo } from "react";

export const WelfareSettlement = memo(({ data, handleModifyTotalBudget, setNewTotalBudget, setSelectedRows, selectedRows, openModifyNote }: any) => {
  return data?.map((element: TWelfareSettlement, index: number) => {
    const isSelected = !!selectedRows.find((item: TWelfareSettlement) => item.welfareStatsIdx === element.welfareStatsIdx);
    return (
      <Table.Tr fz={"xs"} key={element.welfareStatsIdx} bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}>
        <Table.Td>
          <Checkbox
            size="xs"
            radius="sm"
            aria-label="Select row"
            checked={isSelected}
            onChange={(event) => {
              const currentWelfareStatsIdx = element.welfareStatsIdx;
              if (event.currentTarget.checked) {
                // Add the current element's mealStatsIdx to selectedRows if checked
                setSelectedRows([...selectedRows, element]);
              } else {
                // Remove the current element's mealStatsIdx from selectedRows if unchecked
                setSelectedRows(selectedRows.filter((row: TWelfareSettlement) => row.welfareStatsIdx !== currentWelfareStatsIdx));
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
            value={element.welfareBudget}
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
          <NumberFormatter thousandSeparator value={element.welfareExpense} suffix=" 원" />
        </Table.Td>
        <Table.Td>
          <NumberFormatter thousandSeparator value={element.welfareBalance} suffix=" 원" />
        </Table.Td>
        <Table.Td>
          <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{settlementStatus(element.clearStatus)}</Badge>
        </Table.Td>

        <Table.Td>
          {element.note ? (
            <Button size="compact-xs" variant="light" color="orange" onClick={() => openModifyNote(element)}>
              조회
            </Button>
          ) : (
            <Button size="compact-xs" variant="light" onClick={() => openModifyNote(element)}>
              등록
            </Button>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });
});
