import { confirmWelfare } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Alert, Button, Group, Modal, Stack, Table, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";

const ConfirmModal = ({ opened, close, setSelectedRows, selectedRows }: any) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => confirmWelfare(values),
  });

  const confirm = (confirmStatus: string) => {
    mutate(
      { welfareIdxList: selectedRows.map((row: any) => row.welfareIdx), confirmYN: confirmStatus },
      {
        onSuccess: () => {
          notification({ title: "복지포인트 승인/미승인", message: "복지포인트 승인 내용이 변경되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["welfares"] });
          setSelectedRows([]);
          close();
        },
        onError: (error: any) => {
          console.log("🚀 ~ confirm ~ error:", error);
          notification({ title: "복지포인트 승인/미승인", message: "복지포인트 승인 내용 변경 중 문제가 발생하였습니다.", color: "red" });
        },
      }
    );
  };

  const rows = selectedRows.map((element: any) => (
    <Table.Tr key={element.welfareIdx}>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.amount || 0}</Table.Td>
      <Table.Td>{element.targetDay}</Table.Td>
      <Table.Td>{element.confirmYN === "N" ? "미승인" : `승인 (${dayjs(element.confirmDate).format("YYYY-MM-DD")})`}</Table.Td>
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
        <Alert variant="outline" color="yellow" radius="md" title="해당 내역을 승인 또는 승인 취소 하시겠습니까?" icon={<IconInfoCircle />}>
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
        <Group wrap="nowrap" justify="end">
          <Button onClick={() => confirm("Y")}>승인하기</Button>
          <Button variant="outline" onClick={() => confirm("T")}>
            가승인하기
          </Button>
          <Button variant="light" color="red" onClick={() => confirm("N")}>
            승인 취소하기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmModal;
