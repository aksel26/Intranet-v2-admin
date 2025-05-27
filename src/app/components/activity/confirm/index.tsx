import { Alert, Button, Group, Modal, Stack, Table, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";

const ConfirmModal = ({ opened, close, selectedRows, handler }: any) => {
  const rows = selectedRows.map((element: any) => (
    <Table.Tr key={element.activityIdx}>
      <Table.Td>{element.payerName}</Table.Td>
      <Table.Td>{element.amount}</Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
      <Table.Td>{element.confirmYN === "N" ? "미승인" : `승인 (${dayjs(element.confirmDate).format("YYYY-MM-DD")})`}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Modal opened={opened} onClose={close} centered title="내역 확인">
      <Stack>
        <Alert variant="outline" color="yellow" radius="md" title="해당 내역을 승인 또는 승인 취소 하시겠습니까?" icon={<IconInfoCircle />}>
          <Text fz={"sm"} mt={"xs"}>
            총 {selectedRows.length}개 내역을 확인해 주세요.
          </Text>

          <Table fz={"xs"} withRowBorders={false} horizontalSpacing={0} mt={"xs"}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>성명</Table.Th>
                <Table.Th>금액</Table.Th>
                <Table.Th>일자</Table.Th>
                <Table.Th>상태</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Alert>
        <Group wrap="nowrap">
          <Button variant="light" onClick={() => handler("Y")} fullWidth data-autofocus>
            승인하기
          </Button>
          <Button variant="light" color="red" fullWidth onClick={() => handler("N")}>
            승인 취소하기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmModal;
