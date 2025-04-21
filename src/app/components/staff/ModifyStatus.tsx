import React, { Suspense, useMemo } from "react";
import { Alert, Button, Divider, Group, Modal, Stack, Text } from "@mantine/core";
import { TStaffs } from "@/app/type/staff";
import { IconInfoCircle } from "@tabler/icons-react";

type TModal = {
  opened: boolean;
  close: () => void;
  selectedRow: TStaffs | undefined;
  status: string;
};

const ModifyStatus = ({ opened, close, selectedRow, status }: TModal) => {
  const title = useMemo(() => {
    if (status === "재직") {
      return "해당 직원을 퇴사 처리 하시겠습니까?";
    } else {
      return "해당 직원을 재직 처리 하시겠습니까?";
    }
  }, [status]);

  if (!selectedRow) return null;
  const { userName, id, userCell, userEmail } = selectedRow;
  return (
    <Modal opened={opened} onClose={close} centered title="직원 삭제">
      <Suspense fallback={<div>Loading...</div>}>
        <Stack>
          <Alert variant="outline" color={status === "퇴사" ? "blue" : "red"} radius="md" title={title} icon={<IconInfoCircle />}>
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
            <Button variant="light" color={status === "퇴사" ? "blue" : "red"} fullWidth onClick={() => console.log("?")}>
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
