import { Alert, Button, Group, Modal, Stack } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

const ConfirmModal = ({ opened, close, selectedRows, handler }: any) => {
  return (
    <Modal opened={opened} onClose={close} centered title="내역 확인">
      <Stack>
        <Alert variant="default" radius="md" title="해당 내역을 확정 하시겠습니까?" styles={{ title: { fontWeight: 500 } }} icon={<IconInfoCircle />}>
          총 {selectedRows.length}개 내역을 확정합니다.
        </Alert>
        <Group wrap="nowrap">
          <Button onClick={handler} fullWidth data-autofocus>
            확정하기
          </Button>
          <Button variant="light" color="gray" fullWidth onClick={close}>
            닫기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmModal;
