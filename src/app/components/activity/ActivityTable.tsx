import { TActivity } from "@/app/type/activity";
import { Badge, Checkbox, Group, NumberFormatter, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import { memo } from "react";

const ConfirmBadge = ({ element }: { element: TActivity }) => {
  const { confirmYN, confirmDate } = element;
  const innerText = confirmYN === "Y" ? "확정" : "미확정";
  if (confirmYN === "Y") {
    return (
      <Group>
        <Badge variant="light">{innerText} </Badge>
        <Text fz={"xs"} c={"dimmed"}>
          {dayjs(confirmDate).format("YYYY-MM-DD")}
        </Text>
      </Group>
    );
  } else {
    return (
      <Badge variant="light" color="yellow">
        {innerText}
      </Badge>
    );
  }
};

export const ActivityTable = memo(({ data, setSelectedRows, selectedRows }: any) => {
  return data?.map((element: TActivity) => {
    const isSelected = !!selectedRows.find((item: TActivity) => item.activityIdx === element.activityIdx);
    return (
      <Table.Tr fz={"xs"} key={element.activityIdx} bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}>
        <Table.Td>
          <Checkbox
            size="xs"
            radius="sm"
            aria-label="Select row"
            checked={isSelected}
            onChange={(event) => {
              const currentActivityIdx = element.activityIdx;
              if (event.currentTarget.checked) {
                // Add the current element's mealStatsIdx to selectedRows if checked
                setSelectedRows([...selectedRows, element]);
              } else {
                // Remove the current element's mealStatsIdx from selectedRows if unchecked
                setSelectedRows(selectedRows.filter((row: TActivity) => row.activityIdx !== currentActivityIdx));
              }
            }}
          />
        </Table.Td>
        <Table.Td>{element.teamName}</Table.Td>
        <Table.Td>{element.gradeName}</Table.Td>
        <Table.Td>{element.userName}</Table.Td>

        <Table.Td>{element.content}</Table.Td>

        <Table.Td>
          <NumberFormatter thousandSeparator value={element.amount || 0} suffix=" 원" />
        </Table.Td>
        <Table.Td>{element.payerName}</Table.Td>
        <Table.Td>{element.targetDay}</Table.Td>
        <Table.Td>
          <ConfirmBadge element={element} />
        </Table.Td>
      </Table.Tr>
    );
  });
});
