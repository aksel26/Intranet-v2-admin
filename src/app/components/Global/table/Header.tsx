import { Table } from "@mantine/core";
import { memo } from "react";

// Memoized TableHeader component
export const TableHeader = memo(({ columns }: { columns: string[] }) => {
  return (
    <Table.Thead>
      <Table.Tr>
        {columns.map((column: string, index: number) => (
          <Table.Th key={index}>{column}</Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
  );
});
