"use client";

import { NumberFormatter, Stack, Text } from "@mantine/core";
import { useCallback } from "react";

const HighlightText = ({ value }: { value: string | number | undefined }) => {
  return (
    <Text c={"black"} component="span" mr={3} fw={500}>
      {value}
    </Text>
  );
};
function SettlementBaseAmountSummary({ formValues }: any) {
  const periodOptions = useCallback((period: string) => {
    if (period === "H1") return "상반기";
    else if (period === "H2") return "하반기";
  }, []);
  return (
    <Stack gap={4}>
      <Text c="dimmed">
        <HighlightText value={periodOptions(formValues.period)} /> 예상 활동비는
      </Text>
      <Text c="dimmed">
        <NumberFormatter value={formValues.activityBudget} suffix=" 원" thousandSeparator style={{ fontWeight: 500, color: "black" }} /> 입니다.
      </Text>
    </Stack>
  );
}

export default SettlementBaseAmountSummary;
