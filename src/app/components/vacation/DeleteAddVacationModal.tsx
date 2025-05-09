import { deletedVacationGrant } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";

function DeleteAddVacationModal({ opened, close, details }: any) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => deletedVacationGrant(values),
  });

  const confirm = () => {
    mutate(
      { leaveExtraIdx: details.leaveExtraIdx },
      {
        onSuccess: (res) => {
          notification({ color: "green", message: "휴가/연차 부여 내역 삭제가 완료되었습니다.", title: "휴가/연차 부여 내역 삭제" });
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey;
              const targetKeys = ["vacations", "addVacationDetails", "vacationStats"];
              return Array.isArray(queryKey) && targetKeys.includes(queryKey[0]);
            },
          });
          close();
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
          notification({ color: "red", message: errorMessage, title: errorMessage });
        },
      }
    );
  };

  if (!details) return null;
  const { userName, leaveType, extraLeave, note } = details;
  return (
    <Modal opened={opened} onClose={close} title="휴가/연차 부여 내역 삭제" centered>
      <Stack gap={4}>
        <Group gap={"xl"}>
          <Stack gap={1}>
            <Text c={"dimmed"} fz={"sm"}>
              대상자
            </Text>
            <Text fz={"sm"}>{userName}</Text>
          </Stack>
          <Stack gap={1}>
            <Text c={"dimmed"} fz={"sm"}>
              유형
            </Text>
            <Text fz={"sm"}>{leaveType}</Text>
          </Stack>
          <Stack gap={1}>
            <Text c={"dimmed"} fz={"sm"}>
              개수
            </Text>
            <Text fz={"sm"}>{extraLeave}개</Text>
          </Stack>
          <Stack gap={1}>
            <Text c={"dimmed"} fz={"sm"}>
              내용
            </Text>
            <Text fz={"sm"}>{note}</Text>
          </Stack>
        </Group>
      </Stack>

      <Text fz={"sm"} mt={"lg"}>
        해당 휴가 건을 삭제하시겠습니까?
      </Text>
      <Group gap={"xs"} mt={"lg"} wrap="nowrap">
        <Button fullWidth color="red" variant="light" onClick={confirm} data-autofocus>
          삭제
        </Button>
        <Button fullWidth color="gray" variant="light" onClick={close}>
          취소
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteAddVacationModal;
