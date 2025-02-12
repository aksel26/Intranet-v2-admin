import { Checkbox, NumberFormatter, Table } from "@mantine/core";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { memo } from "react";

export const VacationTable = memo(({ data, setSelectedRows, selectedRows }: any) => {
  const router = useRouter();
  const pathName = usePathname();

  const goDetail = (idx: number) => router.push(`${pathName}/${idx}`);

  const moveToDetail = (index: number) => {
    router.push(`/main/attendance/vacation/${index}`);
  };

  return data?.map((element: any, index: number) => (
    <Table.Tr
      key={element.leaveStatsIdx}
      bg={selectedRows.includes(element.leaveStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}
      onClick={() => moveToDetail(element.userIdx)}
    >
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
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.hqName}</Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.userEmail}</Table.Td>

      <Table.Td>{element.totalAnnualLeave || 0} 일</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={element.annualLeaveBalance || 0} suffix=" 일" />
      </Table.Td>
      <Table.Td>{element.lastLeaveDate}</Table.Td>
      <Table.Td>{element.note || "-"}</Table.Td>
    </Table.Tr>
  ));
});
