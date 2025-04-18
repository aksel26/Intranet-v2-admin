import { Group, Loader, Table } from "@mantine/core";
import React from "react";

const Loading = ({ span }: { span: number }) => {
  return (
    <Table.Tbody>
      <Table.Tr mih={300} styles={{ tr: { background: "white" } }}>
        <Table.Td colSpan={span} mih={300}>
          <Group justify="center" py={"xl"}>
            <Loader size={"sm"} />
          </Group>
        </Table.Td>
      </Table.Tr>
    </Table.Tbody>
  );
};

export default Loading;
