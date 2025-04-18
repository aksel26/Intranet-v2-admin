import { VacationsTable } from "@/app/type/vacationListTable";
import { Button, Checkbox, NumberFormatter, Table } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { memo } from "react";

export const VacationTable = memo(({ data, setSelectedRows, selectedRows }: any) => {
  const router = useRouter();
  const pathName = usePathname();

  const goDetail = (idx: number) => router.push(`${pathName}/${idx}`);

  return data?.map((element: VacationsTable, index: number) => (
    <Table.Tr fz={"xs"} key={element.leaveStatsIdx} bg={selectedRows.includes(element.leaveStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.leaveStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.leaveStatsIdx]
                : selectedRows.filter((leaveStatsIdx: number) => leaveStatsIdx !== element.leaveStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.hqName}</Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>
        <Button variant="subtle" size="compact-xs" onClick={() => goDetail(element.userIdx)}>
          {element.userName}
        </Button>
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.totalReceivedAnnualLeave || 0} suffix=" 일" />
      </Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={element.totalAnnualLeaveBalance || 0} suffix=" 일" />
      </Table.Td>
      <Table.Td>{element.lastLeaveDate}</Table.Td>
      <Table.Td>{element.note || "-"}</Table.Td>
      {/* <Table.Td>{element.note || "-"}</Table.Td> */}
    </Table.Tr>
  ));
});
