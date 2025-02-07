"use client";

import { TActivitesSettlement } from "@/app/type/welfare";
import { settlementStatus } from "@/app/utils/settlement";
import { Badge, Button, Checkbox, NumberFormatter, Popover, Table } from "@mantine/core";
import { memo, useState } from "react";
import ModifyActivityBudget from "../../activity/settlement/template/ModifyActivityBudget";
import ModifyActivityNote from "../../activity/settlement/template/ModifyActivityNote";

export const ActivitySettlement = memo(({ data, setSelectedRows, selectedRows }: any) => {
  const [openedRowId, setOpenedRowId] = useState<number | null>(null);
  const [openedBudgetRowId, setOpenedBudgetRowId] = useState<number | null>(null);
  const handleRowClick = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenedRowId(openedRowId === id ? null : id);
  };

  const handleRowClickBudget = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenedBudgetRowId(openedBudgetRowId === id ? null : id);
  };

  return data?.map((element: TActivitesSettlement, index: number) => (
    <Table.Tr key={element.activityStatsIdx} bg={selectedRows.includes(element.activityStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.activityStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.activityStatsIdx]
                : selectedRows.filter((position: any) => position !== element.activityStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        {/* <Modal opened={openedBudgetRowId === element.activityStatsIdx} onClose={() => setOpenedBudgetRowId(openedBudgetRowId === element.activityStatsIdx ? null : element.activityStatsIdx)} title="Authentication"> */}

        {/* <Popover
          width={350}
          trapFocus
          position="bottom"
          withArrow
          shadow="xl"
          opened={openedBudgetRowId === element.activityStatsIdx}
          onChange={() => setOpenedBudgetRowId(openedBudgetRowId === element.activityStatsIdx ? null : element.activityStatsIdx)}
          offset={3}
        > */}
        {/* <Popover.Target> */}
        <Button variant="subtle" size="compact-sm" onClick={(e) => handleRowClickBudget(element.activityStatsIdx, e)}>
          {element.activityBudget}
        </Button>
        {/* </Popover.Target> */}

        {/* </Popover> */}
        <ModifyActivityBudget opened={openedBudgetRowId === element.activityStatsIdx} element={element} close={() => setOpenedBudgetRowId(null)} />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityExpense} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityBalance} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{settlementStatus(element.clearStatus)}</Badge>
      </Table.Td>

      <Table.Td>
        <Popover
          width={300}
          trapFocus
          position="bottom"
          withArrow
          shadow="md"
          opened={openedRowId === element.activityStatsIdx}
          onChange={() => setOpenedRowId(openedRowId === element.activityStatsIdx ? null : element.activityStatsIdx)}
          offset={3}
        >
          <Popover.Target>
            <Button variant="subtle" size="compact-sm" onClick={(e) => handleRowClick(element.activityStatsIdx, e)}>
              {element.note}
            </Button>
          </Popover.Target>

          <ModifyActivityNote element={element} setOpened={setOpenedRowId} />
        </Popover>
      </Table.Td>
    </Table.Tr>
  ));
});
