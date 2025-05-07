import { Alert, Button, Group, Modal, Stack, Table, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";

const ConfirmModal = ({ opened, close, selectedRows, handler }: any) => {
  const rows = selectedRows.map((element: any) => (
    <Table.Tr key={element.activityIdx}>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.amount || 0}</Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
      <Table.Td>{element.confirmYN === "N" ? "미확정" : `확정 (${dayjs(element.confirmDate).format("YYYY-MM-DD")})`}</Table.Td>
      <Table.Td>
        {element.payeeList.length < 1 ? (
          <Text fz={"xs"} c={"dimmed"}>
            내용 없음.
          </Text>
        ) : (
          <Group gap={"xs"}>
            {element.payeeList.map((list: any) => (
              <Text fz={"xs"} key={list.userIdx}>
                {`${list.userName} (${list.amount || 0})`}
              </Text>
            ))}
          </Group>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Modal opened={opened} onClose={close} centered title="내역 확인" size={"lg"}>
      <Stack>
        <Alert variant="outline" color="yellow" radius="md" title="해당 내역을 확정 또는 확정 취소 하시겠습니까?" icon={<IconInfoCircle />}>
          <Text fz={"sm"} mt={"xs"}>
            총 {selectedRows.length}개 내역을 확인해 주세요.
          </Text>
          <Table striped fz={"xs"} withRowBorders={false} horizontalSpacing={0} mt={"xs"}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>성명</Table.Th>
                <Table.Th>금액</Table.Th>
                <Table.Th>일자</Table.Th>
                <Table.Th>상태</Table.Th>
                <Table.Th>동반 결제자</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Alert>
        <Group wrap="nowrap">
          <Button variant="light" onClick={() => handler("Y")} fullWidth data-autofocus>
            확정하기
          </Button>
          <Button variant="light" color="red" fullWidth onClick={() => handler("N")}>
            확정 취소하기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmModal;
