import { TWelfares } from "@/app/type/welfare";
import { Box, Button, Checkbox, Collapse, Group, NumberFormatter, Table, Text } from "@mantine/core";
import React, { memo, useEffect, useState } from "react";
import ConfirmSelect from "../../welfare/confirm/select";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

export const Welfares = memo(
  ({ data, handleModifyNote, setNewTotalBudget, setSelectedRows, selectedRows, selectedSubRows, setSelectedSubRows, openModifyNote }: any) => {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    // const [selectedRows, setSelectedRows] = useState<number[]>([]);
    // const [selectedSubRows, setSelectedSubRows] = useState<{ [key: number]: number[] }>({});
    // console.log("🚀 ~ Welfares ~ selectedSubRows:", selectedSubRows);
    // 부모 행의 모든 하위 프로젝트가 선택되었는지 확인
    useEffect(() => {
      if (!data || data.length === 0) return;

      setSelectedRows((prev: number[]) => {
        const newSelectedRows: number[] = [];

        data.forEach((row: TWelfares) => {
          const subRows = selectedSubRows[row.welfareIdx] || [];
          // 명시적으로 부모가 선택된 경우는 유지
          if (prev.includes(row.welfareIdx)) {
            // 하위 항목이 하나도 선택되지 않은 경우만 제거
            if (row.details?.payeeList && subRows.length === 0) {
              return; // 이 부모는 추가하지 않음
            }
            newSelectedRows.push(row.welfareIdx);
          }
          // 하위 항목이 모두 선택된 경우 부모도 자동 선택
          else if (row.details?.payeeList && subRows.length === row.details.payeeList.length && subRows.length > 0) {
            newSelectedRows.push(row.welfareIdx);
          }
        });

        // 배열이 동일한 경우 상태 업데이트하지 않음 (무한 루프 방지)
        if (prev.length === newSelectedRows.length && prev.every((id) => newSelectedRows.includes(id))) {
          return prev;
        }

        return newSelectedRows;
      });
    }, [selectedSubRows]);

    const toggleRow = (id: number) => {
      setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const toggleRowSelection = (id: number) => {
      setSelectedRows((prev: number[]) => {
        const isSelected = prev.includes(id);
        if (isSelected) {
          // 부모 행 선택 해제 시 하위 항목도 모두 해제
          setSelectedSubRows((prev: number[]) => ({
            ...prev,
            [id]: [],
          }));
          return prev.filter((rowId) => rowId !== id);
        } else {
          // 부모 행 선택 시 하위 항목도 모두 선택
          const row = data.find((r: TWelfares) => r.welfareIdx === id);
          if (row && row.details?.payeeList) {
            setSelectedSubRows((prev: number[]) => ({
              ...prev,
              [id]: row.details.payeeList.map((p: TWelfares) => p.welfareIdx),
            }));
          }
          return [...prev, id];
        }
      });
    };

    const toggleSubRowSelection = (parentId: number, projectId: number) => {
      setSelectedSubRows((prev: any) => {
        const current = prev[parentId] || [];
        const newSelection = current.includes(projectId) ? current.filter((id: number) => id !== projectId) : [...current, projectId];

        return {
          ...prev,
          [parentId]: newSelection,
        };
      });
    };

    // const toggleAllRows = () => {
    //   if (selectedRows.length === data.length && data.length > 0) {
    //     // 전체 해제
    //     setSelectedRows([]);
    //     setSelectedSubRows({});
    //   } else {
    //     // 전체 선택
    //     const allParentIds = data.map((item: TWelfares) => item.welfareIdx);
    //     setSelectedRows(allParentIds);

    //     const allSubRows: { [key: number]: number[] } = {};
    //     data.forEach((row: TWelfares) => {
    //       if (row.details?.payeeList) {
    //         allSubRows[row.welfareIdx] = row.details.payeeList.map((p: TWelfares) => p.welfareIdx);
    //       }
    //     });
    //     setSelectedSubRows(allSubRows);
    //   }
    // };

    // const deleteRow = (id: number) => {
    //   // API 호출하여 실제 삭제 처리
    //   console.log("Delete row:", id);
    //   // 삭제 후 refetch 필요
    // };

    // const deleteSubRow = (parentId: number, projectId: number) => {
    //   // API 호출하여 실제 삭제 처리
    //   console.log("Delete sub row:", parentId, projectId);
    //   // 삭제 후 refetch 필요
    // };

    // const deleteSelectedRows = () => {
    //   // 선택된 항목들 삭제 처리
    //   console.log("Delete selected rows:", selectedRows);
    //   console.log("Delete selected sub rows:", selectedSubRows);
    //   // API 호출 후 refetch 필요

    //   setSelectedRows([]);
    //   setSelectedSubRows({});
    // };

    // const getSelectedCount = () => {
    //   const parentCount = selectedRows.length;
    //   const subCount = Object.values(selectedSubRows).reduce((sum, arr) => sum + arr.length, 0);
    //   return parentCount + subCount;
    // };
    return data?.map((element: TWelfares) => {
      const subRowsSelected = selectedSubRows[element.welfareIdx] || [];
      const hasDetails = element.details?.payeeList && element.details.payeeList.length > 0;
      const isIndeterminate = hasDetails && subRowsSelected.length > 0 && subRowsSelected.length < element.details.payeeList.length;

      return (
        <React.Fragment key={element.welfareIdx}>
          <Table.Tr className="hover:bg-gray-100">
            <Table.Td>
              <Checkbox
                size="xs"
                checked={selectedRows.includes(element.welfareIdx)}
                indeterminate={isIndeterminate}
                onChange={() => toggleRowSelection(element.welfareIdx)}
                onClick={(e) => e.stopPropagation()}
              />
            </Table.Td>
            <Table.Td onClick={() => hasDetails && toggleRow(element.welfareIdx)} style={{ cursor: hasDetails ? "pointer" : "default" }}>
              <Group gap="xs">
                <Box w={20}>
                  {hasDetails &&
                    (expandedRows.includes(element.welfareIdx) ? (
                      <IconChevronDown color="var(--mantine-color-gray-5)" size={16} />
                    ) : (
                      <IconChevronRight color="var(--mantine-color-gray-5)" size={16} />
                    ))}
                </Box>
                <Text fz={"xs"}>{element.teamName}</Text>
              </Group>
            </Table.Td>
            <Table.Td onClick={() => hasDetails && toggleRow(element.welfareIdx)} style={{ cursor: hasDetails ? "pointer" : "default" }}>
              {element.gradeName}
            </Table.Td>
            <Table.Td onClick={() => hasDetails && toggleRow(element.welfareIdx)} style={{ cursor: hasDetails ? "pointer" : "default" }}>
              {element.userName}
            </Table.Td>
            <Table.Td onClick={() => hasDetails && toggleRow(element.welfareIdx)} style={{ cursor: hasDetails ? "pointer" : "default" }}>
              {element.content}
            </Table.Td>
            <Table.Td onClick={() => hasDetails && toggleRow(element.welfareIdx)} style={{ cursor: hasDetails ? "pointer" : "default" }}>
              <NumberFormatter thousandSeparator value={element.amount || 0} suffix=" 원" />
            </Table.Td>
            <Table.Td onClick={() => hasDetails && toggleRow(element.welfareIdx)} style={{ cursor: hasDetails ? "pointer" : "default" }}>
              {element.payerName}
            </Table.Td>
            <Table.Td onClick={() => hasDetails && toggleRow(element.welfareIdx)} style={{ cursor: hasDetails ? "pointer" : "default" }}>
              {element.targetDay}
            </Table.Td>
            <Table.Td style={{ cursor: hasDetails ? "pointer" : "default" }}>
              {element.note ? (
                <Button size="compact-xs" variant="light" color="orange" onClick={() => handleModifyNote(element)}>
                  조회
                </Button>
              ) : (
                <Button size="compact-xs" variant="light" onClick={() => handleModifyNote(element)}>
                  등록
                </Button>
              )}
            </Table.Td>
            <Table.Td style={{ cursor: hasDetails ? "pointer" : "default" }}>
              <ConfirmSelect element={element} />
            </Table.Td>
          </Table.Tr>
          {hasDetails && (
            <Table.Tr style={{ borderBottom: "none" }}>
              <Table.Td colSpan={11} style={{ padding: 0 }}>
                <Collapse in={expandedRows.includes(element.welfareIdx)}>
                  <Box px={"xl"} py={"xs"} pb={"lg"} bg="gray.0" style={{ borderBottomRightRadius: 12, borderBottomLeftRadius: 12 }}>
                    <Table fz={"xs"} verticalSpacing={1}>
                      <Table.Thead>
                        <Table.Tr style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}>
                          <Table.Th w={40}></Table.Th>
                          <Table.Th py={8}>팀명</Table.Th>
                          <Table.Th>직급</Table.Th>
                          <Table.Th>성명</Table.Th>
                          <Table.Th>사용처</Table.Th>
                          <Table.Th>금액</Table.Th>
                          <Table.Th>결제자</Table.Th>
                          <Table.Th>작성일</Table.Th>
                          <Table.Th>비고</Table.Th>
                          <Table.Th>관리자 확인 여부</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {element.details.payeeList.map((payee: TWelfares) => (
                          <Table.Tr key={payee.welfareIdx}>
                            <Table.Td>
                              <Checkbox
                                size="xs"
                                checked={subRowsSelected.includes(payee.welfareIdx)}
                                onChange={() => toggleSubRowSelection(element.welfareIdx, payee.welfareIdx)}
                              />
                            </Table.Td>
                            <Table.Td>{payee.teamName}</Table.Td>
                            <Table.Td>{payee.gradeName}</Table.Td>
                            <Table.Td>{payee.userName}</Table.Td>
                            <Table.Td>{payee.content}</Table.Td>
                            <Table.Td>
                              <NumberFormatter thousandSeparator value={payee.amount || 0} suffix=" 원" />
                            </Table.Td>
                            <Table.Td>{payee.payerName}</Table.Td>
                            <Table.Td>{payee.targetDay}</Table.Td>
                            <Table.Td>
                              {payee.note ? (
                                <Button size="compact-xs" variant="light" color="orange" onClick={() => handleModifyNote(payee)}>
                                  조회
                                </Button>
                              ) : (
                                <Button size="compact-xs" variant="light" onClick={() => handleModifyNote(payee)}>
                                  등록
                                </Button>
                              )}
                            </Table.Td>
                            <Table.Td>
                              <ConfirmSelect element={payee} />
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                    <Group gap={"xs"} align="center" mt={"md"}>
                      <Text size="sm" fw={600} c={"gray.6"}>
                        총 결제 금액 :
                      </Text>
                      <NumberFormatter
                        style={{ fontSize: "var(--mantine-font-size-sm)", fontWeight: 500 }}
                        thousandSeparator
                        value={element.groupTotalAmount || 0}
                        suffix=" 원"
                      />
                    </Group>
                  </Box>
                </Collapse>
              </Table.Td>
            </Table.Tr>
          )}
        </React.Fragment>
      );
    });
  }
);
