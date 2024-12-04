"use client";

import { Alert, Button, Divider, Group, Stack, Text } from "@mantine/core";
import React from "react";
import IconInfo from "/public/icons/info-circle.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStaff } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
("@/app/api/post/postApi");
function DeleteModal({ close, selectedRow }: any) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: any) => deleteStaff(values),
  });

  const deleteConfirm = () => {
    const { userIdx } = selectedRow;
    mutate(
      { userIdx },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["staffs"] });
          close();
          notification({
            color: "green",
            message: "해당 직원정보가 삭제되었습니다.",
            title: "직원 삭제",
          });
        },
        onError: (error: any) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <Stack>
      <Alert variant="outline" color="red" radius="md" title="해당 직원을 삭제하시겠습니까?" icon={<IconInfo />}>
        삭제 후 되돌릴 수 없습니다.
        <Group mt={"sm"} gap={"xs"}>
          <Text size="xs" c={"gray.7"}>
            김현근2
          </Text>
          <Divider orientation="vertical" size={"sm"} />
          <Text size="xs" c={"gray.7"}>
            hkkim
          </Text>
          <Divider orientation="vertical" size={"sm"} />
          <Text size="xs" c={"gray.7"}>
            010-3232-2322
          </Text>
          <Divider orientation="vertical" size={"sm"} />
          <Text size="xs" c={"gray.7"}>
            asdf@asdf.com{" "}
          </Text>
        </Group>
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

export default DeleteModal;
