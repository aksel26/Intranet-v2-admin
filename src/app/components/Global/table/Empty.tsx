import { Stack, Table } from "@mantine/core";
import IconNoList from "/public/icons/no-list.svg";
import { memo } from "react";

export const Empty = memo(({ colSpan }: { colSpan: number }) => {
  return (
    <Table.Tr styles={{ tr: { borderBottom: "unset" } }}>
      <Table.Td colSpan={colSpan} mih={300}>
        <Stack justify="center" gap={"xs"} align="center" p={"xl"}>
          <IconNoList width={"30"} height={"30"} />
          <div className=" flex justify-center items-center h-full text-gray-500">데이터가 없습니다.</div>
        </Stack>
      </Table.Td>
    </Table.Tr>
  );
});
