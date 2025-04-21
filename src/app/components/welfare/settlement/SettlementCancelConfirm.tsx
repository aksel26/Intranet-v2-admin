import { settleCancel } from "@/app/api/post/postApi";
import { TWelfareSettlement } from "@/app/type/welfare";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, NumberFormatter, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SettlementCancelConfirm = ({ close, opened, selectedRows, setSelectedRows }: any) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: any) => settleCancel(values),
  });

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "정산취소",
        message: "정산취소 처리할 인원을 먼저 선택해 주세요.",
        color: "yellow",
      });
      return;
    }

    mutate(
      { welfareStatsIdxList: selectedRows.map((row: TWelfareSettlement) => row.welfareStatsIdx) },
      {
        onSuccess: () => {
          notification({
            title: "복지포인트 정산",
            message: "복지포인트 정산취소가 완료되었습니다.",
            color: "green",
          });

          queryClient.invalidateQueries({ queryKey: ["settlementWelfare"] });
          setSelectedRows([]);
          close();
        },
        onError: () => {
          notification({
            title: "복지포인트 정산",
            message: "복지포인트 정산취소를 실패하였습니다.",
            color: "red",
          });
        },
      }
    );
  };
  return (
    <Modal opened={opened} onClose={close} title="정산취소" centered>
      <Stack>
        {selectedRows.map((row: TWelfareSettlement, index: number) => (
          <Group key={row.welfareStatsIdx}>
            <Text c={"dimmed"} fz={"sm"}>
              {index + 1}.
            </Text>
            <Text fz={"sm"}>{row.teamName || "-"}</Text>
            <Text fz={"sm"}>{row.gradeName}</Text>
            <Text fz={"sm"}>{row.userName}</Text>
            <NumberFormatter style={{ fontSize: "var(--mantine-font-size-sm)" }} value={row.totalOverpay} thousandSeparator suffix=" 원" />
          </Group>
        ))}
        <Text fz={"sm"}>정산취소 처리 하시겠습니까?</Text>
      </Stack>
      <Group wrap="nowrap" mt={"md"}>
        <Button fullWidth onClick={handleSettlement} data-autofocus>
          확인
        </Button>
        <Button color={"gray"} fullWidth onClick={close}>
          닫기
        </Button>
      </Group>
    </Modal>
  );
};

export default SettlementCancelConfirm;
