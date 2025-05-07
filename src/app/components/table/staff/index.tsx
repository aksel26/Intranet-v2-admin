import { TStaffs } from "@/app/type/staff";
import { genderFormat } from "@/app/utils/gender";
import { ActionIcon, Badge, Button, Menu, Select, Table, Text } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { memo, useCallback } from "react";
import { Empty } from "../../Global/table/Empty";
import Loading from "../../Global/table/Loading";

interface StaffListProps {
  data: TStaffs[];
  selectNote: (staff: TStaffs) => void;
  handleOpenEdit: (staff: TStaffs) => void;
  handleDelete: (staff: TStaffs) => void;
  handleStatus: (e: any, staff: TStaffs) => void;
  isLoading: Boolean;
  span: number;
  status: string | null;
}

export const StaffList = memo(({ data, selectNote, span, handleOpenEdit, handleStatus, handleDelete, isLoading }: StaffListProps) => {
  console.log("🚀 ~ StaffList ~ data:", data);
  const hq = useCallback((input: string | null) => {
    if (!input)
      return (
        <Text fz="xs" c="dimmed">
          미등록
        </Text>
      );
    return input;
  }, []);

  const adminRole = useCallback((staff: TStaffs) => {
    const { adminRole, adminGradeIdx } = staff;

    if (adminRole === "Y") {
      if (adminGradeIdx === 1) {
        return (
          <Badge color="lime" radius="md" variant="light">
            상위관리자
          </Badge>
        );
      } else if (adminGradeIdx === 2) {
        return (
          <Badge color="blue" radius="md" variant="light">
            일반관리자
          </Badge>
        );
      }
    }

    return (
      <Badge radius="md" variant="light" color="gray">
        일반
      </Badge>
    );
  }, []);

  const renderRow = useCallback(
    (element: TStaffs, index: number) => (
      <Table.Tr fz="xs" key={element.userIdx}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{element.id || ""}</Table.Td>
        <Table.Td>{hq(element.hqName)}</Table.Td>
        <Table.Td>{hq(element.teamName)}</Table.Td>
        <Table.Td>{element.gradeName}</Table.Td>
        <Table.Td>{element.userName}</Table.Td>
        <Table.Td>{genderFormat(element.userGender)}</Table.Td>
        <Table.Td>{element.userBirth}</Table.Td>
        <Table.Td>{element.userCell}</Table.Td>
        <Table.Td>{element.userEmail}</Table.Td>
        <Table.Td>{adminRole(element)}</Table.Td>
        <Table.Td>{element.joinDate}</Table.Td>
        <Table.Td>
          {element.comment ? (
            <Button size="compact-xs" variant="light" color="orange" onClick={() => selectNote(element)}>
              조회
            </Button>
          ) : (
            <Button size="compact-xs" variant="light" onClick={() => selectNote(element)}>
              등록
            </Button>
          )}
        </Table.Td>
        <Table.Td>
          <Select
            variant="unstyled"
            comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
            value={element.userAvail || "Y"}
            onChange={(e) => handleStatus(e, element)}
            size="xs"
            data={[
              { label: "재직", value: "Y" },
              { label: "퇴사", value: "N" },
            ]}
            w={65}
          />
        </Table.Td>
        <Table.Td>
          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="light" size="sm" radius="sm">
                <IconDots />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item fz="xs" onClick={() => handleOpenEdit(element)}>
                정보 수정
              </Menu.Item>
              <Menu.Item onClick={() => handleDelete(element)} fz="xs" color="red">
                삭제
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    ),
    [hq, adminRole, selectNote, handleOpenEdit, handleStatus, handleDelete]
  );

  if (isLoading) {
    return <Loading span={span} />;
  }
  // data가 없는 경우 처리
  if (!data || data.length === 0) {
    return (
      <Table.Tbody>
        <Empty colSpan={span} />
      </Table.Tbody>
    );
  }

  return <Table.Tbody>{data.map(renderRow)}</Table.Tbody>;
});

// displayName 추가
StaffList.displayName = "StaffList";
