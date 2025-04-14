import { Table } from "@mantine/core";
import { memo } from "react";

// Memoized TableHeader component
export const TableHeader = memo(({ columns }: { columns: string[] }) => {
  return (
    <Table.Thead>
      <Table.Tr fz={"xs"}>
        {columns.map((column: string, index: number) => (
          <Table.Th fz={"xs"} key={index}>
            {column}
          </Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
  );
});
