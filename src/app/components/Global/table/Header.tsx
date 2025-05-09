import { Group, Popover, Radio, Stack, Table } from "@mantine/core";
import { IconArrowsSort } from "@tabler/icons-react";
import { memo } from "react";

// Memoized TableHeader component
export const TableHeader = memo(({ columns, sort, value }: { value?: any; sort?: any; columns: string[] }) => {
  return (
    <Table.Thead>
      <Table.Tr fz={"xs"}>
        {columns.map((column: string, index: number) => {
          if (column === "최근 사용일") {
            return (
              <Table.Th fz={"xs"} key={index}>
                <Popover width={110} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <Group gap={"xs"} styles={{ root: { cursor: "pointer" } }}>
                      {column}
                      <IconArrowsSort size={15} color="gray" />
                    </Group>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Radio.Group
                      value={!value.orderby ? "all" : value.orderby}
                      onChange={(e) => sort(e)}
                      name="favoriteFramework"
                      label="정렬 방식 선택"
                      size="xs"
                    >
                      <Stack gap={8} mt={"xs"}>
                        <Radio size="xs" value="desc" label="최신순" />
                        <Radio size="xs" value="asc" label="나중순" />
                        <Radio size="xs" value="all" label="해제" />
                      </Stack>
                    </Radio.Group>
                  </Popover.Dropdown>
                </Popover>
              </Table.Th>
            );
          }
          return (
            <Table.Th fz={"xs"} key={index}>
              {column}
            </Table.Th>
          );
        })}
      </Table.Tr>
    </Table.Thead>
  );
});
