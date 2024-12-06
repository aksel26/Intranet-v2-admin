import { ActionIcon, Button, Table } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import React, { memo } from "react";

export const NoticeTable = memo(({ data }: any) => {
  const router = useRouter();
  const pathName = usePathname();

  const goDetail = (idx: number) => router.push(`${pathName}/${idx}`);

  return data?.map((element: any, index: number) => (
    <Table.Tr key={element.mealIdx} onClick={() => goDetail(index)} styles={{ tr: { cursor: "pointer" } }}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.title}</Table.Td>
      <Table.Td>{element.writer}</Table.Td>
      <Table.Td>{element.updatedAt}</Table.Td>
      <Table.Td>{element.createdAt}</Table.Td>
    </Table.Tr>
  ));
});
