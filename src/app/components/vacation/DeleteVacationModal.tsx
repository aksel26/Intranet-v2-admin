import { deleteVacationDetail } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const ApprovalStatus = ({ element }: { element: any }) => {
  const { confirmYN, confirmDate, rejectDate } = element;
  if (confirmYN === "Y") {
    return (
      <Text fz={"xs"} c={"green.5"} miw={60}>
        승인완료
        <Text component="span" fz={"xs"} c={"dimmed"} ml={5}>
          ({confirmDate})
        </Text>
      </Text>
    );
  } else if (confirmYN === "N") {
    if (!rejectDate) {
      return (
        <Text fz={"xs"} c={"yellow.5"} miw={60}>
          승인 대기
        </Text>
      );
    } else {
      return (
        <Text fz={"xs"} c={"red.4"} miw={60}>
          반려
          <Text component="span" fz={"xs"} c={"dimmed"} ml={5}>
            ({rejectDate})
          </Text>
        </Text>
      );
    }
  }
};

function DeleteVacationModal({ opened, close, currentRow }: any) {
  console.log("🚀 ~ DeleteVacationModal ~ currentRow:", currentRow);

  const { mutate } = useMutation({
    mutationFn: (values: any) => deleteVacationDetail(values),
  });

  const queryClient = useQueryClient();

  const submit = () => {
    mutate(
      { commuteIdx: currentRow.commuteIdx },
      {
        onSuccess: () => {
          notification({
            title: "휴가 내역 삭제",
            message: "휴가 내역이 삭제되었습니다.",
            color: "green",
          });
          close();
          queryClient.invalidateQueries({ queryKey: ["vacationDetail"] });
        },
        onError: () => {
          notification({
            title: "휴가 내역 삭제",
            message: "휴가 내역 삭제 중 오류가 발생하였습니다.",
            color: "red",
          });
        },
      }
    );
  };

  if (!currentRow) return;

  const { leaveType, commuteDate, note, annualLeaveReduceUnit } = currentRow;
  return (
    <Modal opened={opened} onClose={close} title="휴가 내역 삭제" centered>
      <Stack gap={4}>
        <Group gap={"xl"}>
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              사용일자
            </Text>
            <Text fz={"sm"} ta={"center"}>
              {commuteDate}
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              유형
            </Text>
            <Text fz={"sm"} ta={"center"}>
              {`${leaveType} (${annualLeaveReduceUnit}개)`}
            </Text>
          </Stack>

          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              승인 상태
            </Text>
            <ApprovalStatus element={currentRow} />
          </Stack>
          <Stack gap={0}>
            <Text c={"dimmed"} fz={"sm"}>
              내용
            </Text>
            <Text fz={"sm"} ta={"center"}>
              {note || "-"}
            </Text>
          </Stack>
        </Group>
      </Stack>

      <Text fz={"sm"} mt={"lg"}>
        해당 휴가 건을 삭제하시겠습니까?
      </Text>
      <Group gap={"xs"} mt={"lg"} wrap="nowrap">
        <Button fullWidth color="red" variant="light" onClick={submit}>
          삭제
        </Button>
        <Button fullWidth color="gray" variant="light" onClick={close}>
          취소
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteVacationModal;
