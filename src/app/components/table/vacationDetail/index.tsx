import { TVacationDetail } from "@/app/type/vacationDetail";
import { dateFormatYYYYMMDD } from "@/app/utils/dateFormat";
import { Badge, Button, Group, Popover, Table, Text } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { memo } from "react";

const ApprovalStatus = ({ element }: { element: any }) => {
  const { confirmYN, confirmDate, rejectDate } = element;
  if (confirmYN === "Y") {
    return (
      <Badge variant="light" size="xs" color="lime" radius={"sm"} miw={60}>
        승인완료
      </Badge>
    );
  } else if (confirmYN === "R") {
    return (
      <Badge variant="light" size="xs" color="red" radius={"sm"} miw={60}>
        반려
        <Text component="span" fz={"xs"} c={"dimmed"} ml={5}>
          ({rejectDate})
        </Text>
      </Badge>
    );
  } else if (!confirmYN || confirmYN === "N") {
    return (
      <Badge variant="light" size="xs" color="blue" radius={"sm"} miw={60}>
        승인 대기
      </Badge>
    );
  }
};

const NoteInput = ({
  note,
  modifyNote,
  element,
}: {
  note: any;
  modifyNote: any;
  element: any;
}) => {
  if (note) {
    return (
      <Text
        fz={"xs"}
        td="underline"
        onClick={() => modifyNote(element)}
        styles={{ root: { cursor: "pointer" } }}
      >
        {note}
      </Text>
    );
  } else {
    return (
      <Button
        size="compact-xs"
        variant="light"
        onClick={() => modifyNote(element)}
      >
        등록
      </Button>
    );
  }
};

const ApprovalList = ({ element }: { element: any }) => {
  const { approverInfo } = element;
  console.log("approverInfo: ", approverInfo);
  if (approverInfo.length === 0) return <Text fz={"xs"}> -</Text>;
  if (approverInfo.length === 1) {
    return <Text fz={"xs"}>{approverInfo[0]?.approverName}</Text>;
  } else if (approverInfo.length >= 2) {
    return (
      <Popover width={200} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Group gap={"xs"} align="center" style={{ cursor: "pointer" }}>
            <Text size="xs">
              {approverInfo[0]?.approverName} 외{approverInfo.length - 1}인
            </Text>
            <IconDots color="var(--mantine-color-blue-5)" size={15} />
          </Group>
        </Popover.Target>
        <Popover.Dropdown>
          {approverInfo?.map((approver: any, index: number) => (
            <Text key={index} fz={"xs"}>
              {approver.approverName}
            </Text>
          ))}
        </Popover.Dropdown>
      </Popover>
    );
  }
};
const CcList = ({ element }: { element: any }) => {
  const { ccUserInfo } = element;
  if (ccUserInfo.length === 0) return <Text fz={"xs"}> -</Text>;
  if (ccUserInfo.length === 1) {
    return <Text fz={"xs"}>{ccUserInfo[0]?.ccUserName}</Text>;
  } else if (ccUserInfo.length >= 2) {
    return (
      <Popover width={200} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Group gap={"xs"} align="center" style={{ cursor: "pointer" }}>
            <Text size="xs">
              {ccUserInfo[0]?.ccUserName} 외{ccUserInfo.length - 1}인
            </Text>
            <IconDots color="var(--mantine-color-blue-5)" size={15} />
          </Group>
        </Popover.Target>
        <Popover.Dropdown>
          {ccUserInfo?.map((cc: any, index: number) => (
            <Text key={index} fz={"xs"}>
              {cc.ccUserName}
            </Text>
          ))}
        </Popover.Dropdown>
      </Popover>
    );
  }
};

export const VacationDetil = memo(
  ({ data, deleteDetail, modifyNote, selectAttachment }: any) => {
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
        <Table.Td>
          <CcList element={element} />
        </Table.Td>
        <Table.Td>{element.annualLeaveReduceUnit}</Table.Td>
        <Table.Td>{element.remainingAnnualLeaveQuota}</Table.Td>
        <Table.Td>
          <NoteInput
            note={element.note}
            modifyNote={modifyNote}
            element={element}
          />
        </Table.Td>
        <Table.Td>
          {element.imageUrl ? (
            <Button
              onClick={() => selectAttachment(element)}
              size="compact-xs"
              variant="light"
            >
              조회
            </Button>
          ) : (
            <Text c={"dimmed"} fz={"xs"}>
              없음
            </Text>
          )}
        </Table.Td>
        {/* <Table.Td>{dateFormatYYYYMMDD(element.updatedAt)}</Table.Td>
      <Table.Td>{dateFormatYYYYMMDD(element.createdAt)}</Table.Td> */}
        <Table.Td>
          <Button
            color="red"
            variant="light"
            size="compact-xs"
            onClick={() => deleteDetail(element)}
          >
            삭제
          </Button>
        </Table.Td>
      </Table.Tr>
    ));
  }
);
