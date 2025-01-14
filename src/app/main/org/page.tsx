"use client";

import React, { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";

const OrgChartComponent = () => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      const chart = new OrgChart(divRef.current, {
        template: "ula",
        enableSearch: false,
        enableDragDrop: true,
        nodeBinding: {
          field_0: "name",
          field_1: "title",
        },
        nodes: [
          { id: 1, tags: ["ceo"], name: "정진우", title: "CEO" },
          { id: 2, pid: 1, tags: ["partner"], name: "전인식", title: "CEO" },
          { id: 28, pid: 1, tags: ["assistant"], name: "윤이나", title: "People & Culture 팀" },
          { id: 4, pid: 1, title: "TFT", name: "박민수" },
          { id: 5, pid: 1, title: "HR 컨설팅 본부", name: "박민수" },
          { id: 6, pid: 1, title: "HR 솔루션 본부", name: "김현근" },
          { id: 7, pid: 4, name: "이채령", title: "PA" },
          { id: 13, pid: 7, name: "김선경", title: "PA" },
          { id: 8, pid: 4, name: "Team 1-2", title: "Team" },
          { id: 9, pid: 5, name: "Team 2-1", title: "Team" },
          { id: 10, pid: 5, name: "Team 2-2", title: "Team" },
          { id: 11, pid: 6, name: "Team 3-1", title: "Team" },
          { id: 12, pid: 6, name: "Team 3-2", title: "Team" },
        ],
        slinks: [],
        toolbar: {
          layout: true,
          zoom: true,
          fit: true,
          expandAll: true,
        },
      });
      // 노드 업데이트 이벤트
      chart.on("update", (sender, args) => {
        console.log("Node updated:", args);
      });

      chart.onNodeClick((args) => {
        return false;
      });

      // 드래그 앤 드롭 완료 이벤트
      chart.on("drop", (sender, args) => {
        console.log("Node dropped:", args);
      });

      // 노드 클릭 이벤트
      chart.on("click", (sender, args) => {
        console.log("Node clicked:", args);
      });

      // 노드 추가 이벤트
      chart.on("add", (sender, args) => {
        console.log("🚀 ~ chart.on ~ sender:", sender);
        console.log("Node added:", args);
      });
    }

    // 컴포넌트 언마운트 시 차트 정리
    // return () => {
    //   chart.destroy();
    // };
  }, []);

  return (
    <div className="w-full h-screen bg-white">
      <div
        id="tree"
        ref={divRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

export default OrgChartComponent;
