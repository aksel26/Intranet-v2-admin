"use client";

import React, { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";

const OrgChartComponent = () => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      const chart = new OrgChart(divRef.current, {
        template: "olivia",
        mouseScrool: OrgChart.action.none,
        enableSearch: false,
        enableDragDrop: true,

        nodeBinding: {
          field_0: "name",
          field_1: "title",
        },
        tags: {
          assistant: {
            subTreeConfig: {
              columns: 2,
            },
          },
          PA: {
            subTreeConfig: {
              columns: 1,
            },
          },
          "i/e": {
            subTreeConfig: {
              columns: 1,
            },
          },
        },
        nodes: [
          { id: "ceos" },
          { id: 1, tags: ["ceo"], name: "정진우", title: "CEO", stpid: "ceos" },
          { id: 2, tags: ["partner"], name: "전인식", title: "CEO", stpid: "ceos" },
          { id: 28, pid: "ceos", tags: ["assistant"], name: "윤이나", title: "People & Culture 팀" },
          { id: "P&C", pid: 28 },
          { id: 29, name: "홍세영", title: "People & Culture 팀", stpid: "P&C" },
          { id: 30, name: "김단아", title: "People & Culture 팀", stpid: "P&C" },
          { id: 31, name: "안지훈", title: "People & Culture 팀", stpid: "P&C" },
          { id: 4, pid: "ceos", title: "TFT", name: "박민수" },
          { id: 5, pid: "ceos", title: "HR 컨설팅 본부", name: "박민수" },
          { id: 6, pid: "ceos", title: "HR 솔루션 본부", name: "김현근" },
          { id: 7, pid: 4, name: "이채령", title: "PA" },
          { id: "PA", pid: 7, tags: ["PA"] },
          { id: 17, name: "김선경", title: "PA", stpid: "PA" },
          { id: 218, name: "이솔빈", title: "PA", stpid: "PA" },
          { id: 8, pid: 4, name: "김도윤", title: "면접/교육 운영" },
          { id: "i/e", pid: 8, tags: ["i/e"] },
          { id: 13, name: "장문경", title: "면접/교육 운영", stpid: "i/e" },
          { id: 14, name: "김낙균", title: "면접/교육 운영", stpid: "i/e" },
          { id: 15, name: "이예린", title: "면접/교육 운영", stpid: "i/e" },
          { id: 16, name: "양우연", title: "면접/교육 운영", stpid: "i/e" },
          { id: 9, pid: 5, name: "권동균", title: "Assessment 1팀" },
          { id: "assessment1", pid: 9, tags: ["i/e"] },
          { id: 19, name: "윤지현", title: "Assessment 1팀", stpid: "assessment1" },
          { id: 20, name: "김동건", title: "Assessment 1팀", stpid: "assessment1" },
          { id: 21, name: "안정훈", title: "Assessment 1팀", stpid: "assessment1" },
          { id: 22, name: "안나연", title: "Assessment 1팀", stpid: "assessment1" },
          { id: 23, name: "김윤경", title: "Assessment 1팀", stpid: "assessment1" },
          { id: 10, pid: 5, name: "한미희", title: "Assessment 2팀" },
          { id: "assessment2", pid: 10, tags: ["i/e"] },
          { id: 11, name: "이다애", title: "Assessment 2팀", stpid: "assessment2" },
          { id: 24, name: "김다희", title: "Assessment 2팀", stpid: "assessment2" },
          { id: 25, name: "홍경희", title: "Assessment 2팀", stpid: "assessment2" },

          { id: 923, pid: 6, name: "김현해", title: "HR 운영팀" },
          { id: "solution", pid: 923, tags: ["i/e"] },
          { id: 121, name: "홍찬미", title: "검사운영", stpid: "solution" },
          { id: 122, name: "박세령", title: "검사운영", stpid: "solution" },
          { id: 123, name: "김소윤", title: "검사운영", stpid: "solution" },
          { id: 124, name: "이다빈", title: "검사운영", stpid: "solution" },
          { id: 125, name: "황희은", title: "검사운영", stpid: "solution" },
          { id: 126, name: "김다은", title: "검사운영", stpid: "solution" },

          { id: 924, pid: 6, name: "김대희", title: "HR Tech팀" },
          { id: "tech", pid: 924, tags: ["i/e"] },
          { id: 127, name: "신효은", title: "UI/UX", stpid: "tech" },
          { id: "frontEnd", pid: 924, tags: ["i/e"] },
          { id: 128, name: "이혜빈", title: "FrontEnd", stpid: "frontEnd" },
          { id: 129, name: "김현민", title: "FrontEnd", stpid: "frontEnd" },
          { id: "backEnd", pid: 924, tags: ["i/e"] },
          { id: 130, name: "김정현", title: "BackEnd", stpid: "backEnd" },
          { id: 131, name: "이승현", title: "BackEnd", stpid: "backEnd" },
          // { id: "solution", pid: 924, tags: ["i/e"] },
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
