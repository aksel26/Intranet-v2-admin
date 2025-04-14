import { TWelfares } from "@/app/type/welfare";
import { Checkbox, NumberFormatter, Table } from "@mantine/core";
import dayjs from "dayjs";
import React, { memo } from "react";

export const Welfares = memo(({ data, handleModifyTotalBudget, setNewTotalBudget, setSelectedRows, selectedRows, openModifyNote }: any) => {
  return data?.map((element: TWelfares, index: number) => (
    <Table.Tr key={element.welfareIdx} bg={selectedRows.includes(element.welfareIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.welfareIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked ? [...selectedRows, element.welfareIdx] : selectedRows.filter((welfareIdx: any) => welfareIdx !== element.welfareIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>

      <Table.Td>{element.content}</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={element.amount || 0} suffix=" 원" />
      </Table.Td>
      <Table.Td>{element.payerName}</Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
      <Table.Td>
        <Checkbox
          checked={element.confirmYN === "Y" ? true : false}
          onChange={() => {}}
          size="sm"
          label={element.confirmDate ? dayjs(element.confirmDate).format("YYYY-MM-DD") : "미확정"}
        />
      </Table.Td>
    </Table.Tr>
  ));
});
