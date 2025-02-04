"use client";

import { NumberFormatter, Stack, Text } from "@mantine/core";
import { useCallback } from "react";

function SettlementBaseAmountSummary({ formValues }: any) {
  const periodOptions = useCallback((period: string) => {
    if (period === "H1") return "상반기";
    else if (period === "H2") return "하반기";
  }, []);
  return (
    <Stack gap={"xs"}>
      <Text component="span">{formValues.user.label} 님의</Text>
      <Text component="span">{periodOptions(formValues.period)} 예상 배정금액은</Text>
      <Text>
        <Text component="span" fw={600} mr={5}>
          <NumberFormatter value={formValues.activityBudget} suffix=" 원" thousandSeparator />
        </Text>
        입니다.
      </Text>
    </Stack>
  );
}

export default SettlementBaseAmountSummary;
