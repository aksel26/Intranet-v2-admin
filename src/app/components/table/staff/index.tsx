import { TStaffs } from "@/app/type/staff";
import { genderFormat } from "@/app/utils/gender";
import { ActionIcon, Button, Menu, Popover, Table, Text } from "@mantine/core";
import { IconDots, IconUserExclamation } from "@tabler/icons-react";
import React, { memo, useCallback } from "react";

export const StaffList = memo(({ data, selectNote, handleOpenEdit }: any) => {
  // const mealTypeTagRender = useCallback((category: string | undefined) => {
  //   return MealType(category);
  // }, []);

  const hq = (input: string | null) => {
    if (!input)
      return (
        <Text fz="xs" c={"dimmed"}>
          미등록
        </Text>
      );
    else return input;
  };

  return data?.map((element: TStaffs, index: number) => (
    <Table.Tr fz={"xs"} key={element.userIdx}>
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
      <Table.Td>{element.adminRole === "Y" ? element.adminGradeIdx : "-"}</Table.Td>
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
      <Table.Td>data주세요</Table.Td>
      <Table.Td>
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="light" size={"sm"} radius={"sm"}>
              <IconDots />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item fz={"xs"} onClick={() => handleOpenEdit(element)}>
              정보 수정
            </Menu.Item>
            <Menu.Item
              //   onClick={() => handleDeletStaffModal(element)}
              fz={"xs"}
              color="red"
            >
              삭제
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));
});
