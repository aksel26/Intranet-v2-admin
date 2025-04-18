import { TActivity } from "@/app/type/activity";
import { Checkbox, NumberFormatter, Table } from "@mantine/core";
import dayjs from "dayjs";
import { memo } from "react";

export const ActivityTable = memo(({ data, setSelectedRows, selectedRows }: any) => {
  return data?.map((element: TActivity) => (
    <Table.Tr fz={"xs"} key={element.activityIdx} bg={selectedRows.includes(element.activityIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.activityIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.activityIdx]
                : selectedRows.filter((activityIdx: number) => activityIdx !== element.activityIdx)
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
          size="xs"
          label={element.confirmDate ? dayjs(element.confirmDate).format("YYYY-MM-DD") : "미확정"}
        />
      </Table.Td>
    </Table.Tr>
  ));
});
