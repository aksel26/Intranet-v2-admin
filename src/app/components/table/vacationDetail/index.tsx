import { TVacationDetail } from "@/app/type/vacationDetail";
import { dateFormatYYYYMMDD } from "@/app/utils/dateFormat";
import { Button, Group, Table, Text } from "@mantine/core";
import { memo } from "react";

const ApprovalStatus = ({ element }: { element: any }) => {
  const { confirmYN, confirmDate, rejectDate } = element;
  if (confirmYN === "Y") {
    return (
      <Text fz={"xs"} c={"green.5"} miw={60}>
        승인완료
      </Text>
    );
  } else if (confirmYN === "R") {
    return (
      <Text fz={"xs"} c={"red.4"} miw={60}>
        반려
        <Text component="span" fz={"xs"} c={"dimmed"} ml={5}>
          ({rejectDate})
        </Text>
      </Text>
    );
  } else if (confirmYN === "N") {
    return (
      <Text fz={"xs"} c={"yellow.5"} miw={60}>
        승인 대기
      </Text>
    );
  }
};

const NoteInput = ({ note, modifyNote, element }: { note: any; modifyNote: any; element: any }) => {
  if (note) {
    return (
      <Text fz={"xs"} td="underline" onClick={() => modifyNote(element)} styles={{ root: { cursor: "pointer" } }}>
        {note}
      </Text>
    );
  } else {
    return (
      <Button size="compact-xs" variant="light" onClick={() => modifyNote(element)}>
        등록
      </Button>
    );
  }
};

const ApprovalList = ({ element }: { element: any }) => {
  const { confirmYN } = element;
  if (confirmYN === "Y") {
    return <Text fz={"xs"}>{element.confirmPersonName}</Text>;
  } else {
    return (
      <Group fz={"xs"} c={"dimmed"}>
        {element.approverInfo.map((person: any) => (
          <Text key={person.approverName} component="span" fz={"xs"} c={"dimmed"}>
            {person.approverName}
          </Text>
        ))}
      </Group>
    );
  }
};

export const VacationDetil = memo(({ data, deleteDetail, modifyNote, selectAttachment }: any) => {
  return data?.map((element: TVacationDetail, index: number) => (
    <Table.Tr key={index} fz={"xs"}>
      <Table.Td>{element.commuteDate}</Table.Td>
      <Table.Td>{element.leaveType}</Table.Td>
      <Table.Td>
        <ApprovalStatus element={element} />
      </Table.Td>
      <Table.Td>
        <Text fz={"xs"}>{element.confirmDate || "-"}</Text>
      </Table.Td>
      <Table.Td>
        <ApprovalList element={element} />
      </Table.Td>
      <Table.Td>{element.annualLeaveReduceUnit}</Table.Td>
      <Table.Td>{element.remainingAnnualLeaveQuota}</Table.Td>
      <Table.Td>
        <NoteInput note={element.note} modifyNote={modifyNote} element={element} />
      </Table.Td>
      <Table.Td>
        {element.imageUrl ? (
          <Button onClick={() => selectAttachment(element)} size="compact-xs" variant="light">
            조회
          </Button>
        ) : (
          <Text c={"dimmed"} fz={"xs"}>
            없음
          </Text>
        )}
      </Table.Td>
      <Table.Td>{dateFormatYYYYMMDD(element.updatedAt)}</Table.Td>
      <Table.Td>{dateFormatYYYYMMDD(element.createdAt)}</Table.Td>
      <Table.Td>
        <Button color="red" variant="light" size="compact-xs" onClick={() => deleteDetail(element)}>
          삭제
        </Button>
      </Table.Td>
    </Table.Tr>
  ));
});
