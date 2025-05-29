import { confirmWelfare } from "@/app/api/post/postApi";
import { TWelfares } from "@/app/type/welfare";
import notification from "@/app/utils/notification";
import { Group, Select, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";

const ConfirmSelect = ({ element }: { element: TWelfares }) => {
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

export default ConfirmSelect;
