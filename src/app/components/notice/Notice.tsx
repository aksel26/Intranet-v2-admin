import { ActionIcon, Button, Table } from "@mantine/core";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import React, { memo, useMemo } from "react";

export const NoticeTable = memo(({ data }: any) => {
  const router = useRouter();
  const pathName = usePathname();

  const goDetail = (noticeIdx: number) => router.push(`${pathName}/${noticeIdx}`);

  const dateFormat = useMemo(
    () => (date: string) => {
      const formatDate = dayjs(date);
      return formatDate.format("YYYY-MM-DD");
    },
    []
  );

  return data?.map((element: any, index: number) => (
    <Table.Tr key={element.noticeIdx} onClick={() => goDetail(element.noticeIdx)} styles={{ tr: { cursor: "pointer" } }}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.title}</Table.Td>
      <Table.Td>{element.creatorName}</Table.Td>
      <Table.Td>{dateFormat(element.createdAt)}</Table.Td>
    </Table.Tr>
  ));
});
