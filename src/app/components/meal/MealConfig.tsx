import { NumberFormatter, Table } from "@mantine/core";
import { memo } from "react";

export const MealConfig = memo(({ data }: any) => {
  return data?.map((element: any, index: number) => (
    <Table.Tr key={element.mealStatsIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.mealBudget} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter value={30} suffix=" 일" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.mealBudget} suffix=" 원" />
      </Table.Td>
    </Table.Tr>
  ));
});
