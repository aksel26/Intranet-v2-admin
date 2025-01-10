"use client";
import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Alert, Button, Group, Stack } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import IconInfo from "/public/icons/info-circle.svg";

export default function DeleteModal({ close, id }: any) {
  const querylClient = useQueryClient();

  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.deleteNotice(values),
  });
  const deleteConfirm = () => {
    mutate(
      { noticeIdx: id },
      {
        onSuccess: (res) => {
          notification({
            color: "green",
            message: "공지사항이 삭제 되었습니다.",
            title: "공지사항 삭제",
          });
          close();
          router.back();
        },
        onError: (err) => {
          notification({
            color: "red",
            message: "공지사항 삭제 과정에 문제가 발생하였습니다..",
            title: "공지사항 삭제",
          });
        },
      }
    );
  };
  return (
    <Stack>
      <Alert variant="outline" color="red" radius="md" title="공지사항을 삭제하시겠습니까?" icon={<IconInfo />}>
        삭제 후 되돌릴 수 없습니다.
      </Alert>
      <Group wrap="nowrap">
        <Button variant="light" color="red" fullWidth onClick={deleteConfirm}>
          삭제하기
        </Button>
        <Button variant="light" color="gray" fullWidth onClick={close}>
          닫기
        </Button>
      </Group>
    </Stack>
  );
}
