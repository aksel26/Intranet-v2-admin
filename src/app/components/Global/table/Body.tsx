import { Table } from "@mantine/core";
import { Empty } from "./Empty";
import { memo } from "react";

export const TableBody = memo(({ children, data, columns }: any) => {
  if (data?.length === 0) {
    return (
      <Table.Tbody>
        <Empty colSpan={columns.length} />
      </Table.Tbody>
    );
  }

  return <Table.Tbody>{children}</Table.Tbody>;
});
