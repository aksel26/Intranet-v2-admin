"use client";
import { Alert, Button, Divider, Group, Stack, Text } from "@mantine/core";
import React from "react";
import IconInfo from "/public/icons/info-circle.svg";

export default function DeleteModal({ close }: any) {
  const deleteConfirm = () => {};
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
