"use client";

import { Button, NumberFormatter, Table, Text } from "@mantine/core";
import React, { memo, useCallback } from "react";
import { MealType } from "../../template/meal/MealType";

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

export const MealExpenses = memo(({ data, handleModifyNote }: any) => {
  const mealTypeTagRender = useCallback((category: string | undefined) => {
    return MealType(category);
  }, []);

  return data?.map((element: any, index: number) => (
    <Table.Tr fz={"xs"} key={element.mealIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.leaveType}</Table.Td>
      <Table.Td>{mealTypeTagRender(element.mealType)}</Table.Td>

      <Table.Td>{element.place}</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={element.amount} suffix=" 원" />
      </Table.Td>
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
      <Table.Td>{element.targetDay}</Table.Td>
    </Table.Tr>
  ));
});
