import { confirmWelfare } from "@/app/api/post/postApi";
import { TWelfares } from "@/app/type/welfare";
import notification from "@/app/utils/notification";
import { Button, Checkbox, Group, NumberFormatter, Select, Table, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { memo } from "react";

const ConfirmBadge = ({ element }: { element: TWelfares }) => {
  const queryClient = useQueryClient();
  const { confirmYN, confirmDate, tempConfirmDate } = element;
  const { mutate } = useMutation({
    mutationFn: (values: any) => confirmWelfare(values),
  });

  const updateConfirm = (value: string | null, element: TWelfares) => {
    mutate(
      { welfareIdxList: [element.welfareIdx], confirmYN: value },
      {
        onSuccess: () => {
          notification({ title: "복지포인트 승인/미승인", message: "복지포인트 승인 내용이 변경되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["welfares"] });
        },
        onError: () => {
          notification({ title: "복지포인트 승인/미승인", message: "복지포인트 승인 내용 변경 중 문제가 발생하였습니다.", color: "red" });
        },
      }
    );
  };
  return (
    <Group>
      <Select
        styles={{ input: { color: confirmYN === "N" ? "var(--mantine-color-gray-5)" : "black" } }}
        data={[
          { label: "승인", value: "Y" },
          { label: "가승인", value: "T" },
          { label: "미승인", value: "N" },
        ]}
        value={confirmYN}
        onChange={(value) => updateConfirm(value, element)}
        variant="unstyled"
        w={80}
        fz={"xs"}
        size="xs"
      />
      {confirmDate && (
        <Text fz={"xs"} c={"dimmed"}>
          {dayjs(confirmDate).format("YYYY-MM-DD")}
        </Text>
      )}
      {tempConfirmDate && (
        <Text fz={"xs"} c={"dimmed"}>
          {dayjs(tempConfirmDate).format("YYYY-MM-DD")}
        </Text>
      )}
    </Group>
  );
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
          {/* <ConfirmBadge element={element} /> */}
        </Table.Td>
      </Table.Tr>
    );
  });
});
