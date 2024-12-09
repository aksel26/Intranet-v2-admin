"use client";

import { NumberFormatter, Table } from "@mantine/core";
import React, { memo } from "react";

// Define a type for the props
// type MealExpensesProps = {
//   data: Array<{
//     mealIdx: number;
//     gradeName: string;
//     userName: string;
//     place: string;
//     amount: number;
//     targetDay: string;
//   }>;
// };

export const MealExpenses = memo(({ data }: any) => {
  return data?.map((element: any, index: number) => (
    <Table.Tr key={element.mealIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>

      <Table.Td>{element.place}</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={element.amount} suffix=" 원" />
      </Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
    </Table.Tr>
  ));
});
