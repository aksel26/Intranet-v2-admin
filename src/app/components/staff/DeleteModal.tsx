"use client";

import { Alert, Button, Divider, Group, Stack, Text } from "@mantine/core";
import React from "react";
import IconInfo from "/public/icons/info-circle.svg";
function DeleteModal({ close }: any) {
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
        <Button variant="light" color="red" fullWidth>
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
