"use client";

import { TActivitesSettlement } from "@/app/type/welfare";
import { settlementStatus } from "@/app/utils/settlement";
import { Badge, Checkbox, NumberFormatter, Table } from "@mantine/core";
import { memo } from "react";

export const ActivitySettlement = memo(({ data, setSelectedRows, selectedRows }: any) => {
  return data?.map((element: TActivitesSettlement, index: number) => (
    <Table.Tr key={element.activityStatsIdx} bg={selectedRows.includes(element.activityStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.activityStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.activityStatsIdx]
                : selectedRows.filter((position: any) => position !== element.activityStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityBudget} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityExpense} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityBalance} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{settlementStatus(element.clearStatus)}</Badge>
      </Table.Td>

      <Table.Td>{element.note || ""}</Table.Td>
    </Table.Tr>
  ));
});
