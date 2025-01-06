"use client";

import { TWelfareSettlement } from "@/app/type/welfare";
import { settlementStatus } from "@/app/utils/settlement";
import { Badge, Checkbox, NumberFormatter, Table } from "@mantine/core";
import React, { memo, useCallback } from "react";

export const WelfareSettlement = memo(({ data, setSelectedRows, selectedRows }: any) => {
  return data?.map((element: TWelfareSettlement, index: number) => (
    <Table.Tr key={element.welfareStatsIdx} bg={selectedRows.includes(element.welfareStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.welfareStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.welfareStatsIdx]
                : selectedRows.filter((position: any) => position !== element.welfareStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.welfareBudget} suffix=" 원" />
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

      <Table.Td>{element.note || ""}</Table.Td>
    </Table.Tr>
  ));
});
