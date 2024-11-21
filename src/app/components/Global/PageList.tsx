import { Group, Pagination } from "@mantine/core";
import React from "react";

function PageList({ totalPage }: any) {
  return (
    <Group justify="center" my={"md"}>
      <Pagination total={totalPage} radius="md" />
    </Group>
  );
}

export default PageList;
