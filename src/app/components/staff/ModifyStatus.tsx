import { editStaffStatus } from "@/app/api/post/postApi";
import { TStaffs } from "@/app/type/staff";
import notification from "@/app/utils/notification";
import { Alert, Button, Divider, Group, Modal, Stack, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Suspense, useMemo } from "react";

type TModal = {
  opened: boolean;
  close: () => void;
  selectedRow: TStaffs | undefined;
  status: string;
};

const ModifyStatus = ({ opened, close, selectedRow, status }: TModal) => {
  const title = useMemo(() => {
    if (status === "N") {
      return "해당 직원을 퇴사 처리 하시겠습니까?";
    } else {
      return "해당 직원을 재직 처리 하시겠습니까?";
    }
  }, [status]);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => editStaffStatus(values),
  });
  const confirm = () => {
    mutate(
      { userIdx: selectedRow?.userIdx, userAvail: status },
      {
        onSuccess: () => {
          notification({
            title: "직원 상태 변경",
            message: "직원 상태가 변경되었습니다.",
            color: "green",
          });
          queryClient.invalidateQueries({
            queryKey: ["staffs"],
          });
          close();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
          notification({
            title: "직원 상태 변경",
            message: errorMessage,
            color: "red",
          });
        },
      }
    );
  };

  if (!selectedRow) return null;
  const { userName, id, userCell, userEmail } = selectedRow;
  return (
    <Modal opened={opened} onClose={close} centered title="직원 상태 변경">
      <Suspense fallback={<div>Loading...</div>}>
        <Stack>
          <Alert variant="outline" color={status === "Y" ? "blue" : "red"} radius="md" title={title} icon={<IconInfoCircle />}>
            <Group mt={"sm"} gap={"xs"}>
              <Text size="xs" c={"gray.7"}>
                {userName}
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                {id}
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                {userCell}
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                {userEmail}
              </Text>
            </Group>
          </Alert>
          <Group wrap="nowrap">
            <Button variant="light" color={status === "Y" ? "blue" : "red"} fullWidth onClick={confirm} data-autofocus>
              확인
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={close}>
              닫기
            </Button>
          </Group>
        </Stack>
      </Suspense>
    </Modal>
  );
};

export default ModifyStatus;
