import { Group, Pagination } from "@mantine/core";
import React from "react";

function PageList({ totalPage, controls }: any) {
  const control = (page: number) => {
    controls((prev: any) => ({ ...prev, pageNo: page }));
  };
  return (
    <Group justify="center" my={"md"}>
      <Pagination size={"sm"} total={totalPage} radius="md" onChange={control} />
    </Group>
  );
}

export default PageList;
