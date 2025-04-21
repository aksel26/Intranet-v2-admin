import { settleDone } from "@/app/api/post/postApi";
import { TWelfareSettlement } from "@/app/type/welfare";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, NumberFormatter, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const SettlementConfirm = ({ close, opened, selectedRows, setSelectedRows }: any) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: any) => settleDone(values),
  });

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "정산",
        message: "정산처리할 인원을 먼저 선택해 주세요.",
        color: "yellow",
      });
      return;
    }

    mutate(
      {
        welfareStatsIdxList: selectedRows.map((row: TWelfareSettlement) => row.welfareStatsIdx),
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["settlementWelfare"],
          });
          setSelectedRows([]);
          close();
          notification({
            title: "정산",
            message: "정산이 정상적으로 완료되었습니다.",
            color: "green",
          });
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
          notification({ color: "red", message: errorMessage, title: errorMessage });
        },
      }
    );
  };
  return (
    <Modal opened={opened} onClose={close} title="정산 확인" centered>
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
        <Text fz={"sm"}>정산완료 처리 하시겠습니까?</Text>
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

export default SettlementConfirm;
