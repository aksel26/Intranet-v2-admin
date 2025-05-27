import { TWelfares } from "@/app/type/welfare";
import { Badge, Button, Checkbox, Group, NumberFormatter, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { memo } from "react";

const ConfirmBadge = ({ element }: { element: TWelfares }) => {
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

export const Welfares = memo(({ data, handleModifyNote, setNewTotalBudget, setSelectedRows, selectedRows, openModifyNote }: any) => {
  return data?.map((element: TWelfares, index: number) => {
    const isSelected = !!selectedRows.find((item: TWelfares) => item.welfareIdx === element.welfareIdx);

    return (
      <Table.Tr fz={"xs"} key={element.welfareIdx} bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}>
        <Table.Td>
          <Checkbox
            size="xs"
            radius="sm"
            aria-label="Select row"
            checked={isSelected}
            onChange={(event) => {
              const currentWelfareIdx = element.welfareIdx;
              if (event.currentTarget.checked) {
                // Add the current element's mealStatsIdx to selectedRows if checked
                setSelectedRows([...selectedRows, element]);
              } else {
                // Remove the current element's mealStatsIdx from selectedRows if unchecked
                setSelectedRows(selectedRows.filter((row: TWelfares) => row.welfareIdx !== currentWelfareIdx));
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
          {element.note ? (
            <Button size="compact-xs" variant="light" color="orange" onClick={() => handleModifyNote(element)}>
              조회
            </Button>
          ) : (
            <Button size="compact-xs" variant="light" onClick={() => handleModifyNote(element)}>
              등록
            </Button>
          )}
        </Table.Td>
        <Table.Td>
          <ConfirmBadge element={element} />
        </Table.Td>
      </Table.Tr>
    );
  });
});
