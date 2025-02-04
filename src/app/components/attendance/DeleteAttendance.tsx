import { deleteCommute } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Alert, Button, Group, Modal } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import IconInfo from "/public/icons/info-circle.svg";
function DeleteAttendance({ openedDeleteAttendance, closeDeleteAttendance, selectedRows }: any) {
  const { mutate } = useMutation({
    mutationFn: (values: any) => deleteCommute(values),
  });

  const queyrClient = useQueryClient();

  const deleteConfirm = () => {
    mutate(
      { commuteIdxList: selectedRows },
      {
        onSuccess: async (res) => {
          await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
          notification({
            color: "green",
            title: "출퇴근 내역 삭제",
            message: "출퇴근 내역이 삭제되었습니다.",
          });
          closeDeleteAttendance();
        },
        onError: (err) => {
          notification({
            color: "green",
            title: "출퇴근 내역 삭제",
            message: "출퇴근 내역 삭제 중 오류가 발생하였습니다.",
          });
          closeDeleteAttendance();
        },
      }
    );
  };
  return (
    <Modal opened={openedDeleteAttendance} onClose={closeDeleteAttendance} title="출석내역 삭제" centered>
      <Alert variant="outline" color="red" radius="md" title="출석 내역을 삭제합니다." icon={<IconInfo />}>
        삭제 후 되돌릴 수 없습니다.
      </Alert>
      <Group wrap="nowrap" mt={"md"}>
        <Button variant="light" color="red" fullWidth onClick={deleteConfirm}>
          삭제하기
        </Button>
        <Button variant="light" color="gray" fullWidth onClick={closeDeleteAttendance}>
          닫기
        </Button>
      </Group>
      {/* Modal content */}
    </Modal>
  );
}

export default DeleteAttendance;
