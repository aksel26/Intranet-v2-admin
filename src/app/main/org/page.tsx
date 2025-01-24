"use client";

import React, { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";
import { Flex } from "@mantine/core";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { MEAL, ORG } from "@/app/enums/breadcrumbs";
import "../../styles/org.css";
const OrgChartComponent = () => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      const chart = new OrgChart(divRef.current, {
        template: "olivia",
        mouseScrool: OrgChart.action.ctrlZoom,
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
          { id: "pc-manager", pid: "ceos", tags: ["assistant"], name: "윤이나", title: "People & Culture 팀" },
          { id: "P&C", pid: "pc-manager" },
          { id: "pc-1", name: "홍세영", title: "People & Culture 팀", stpid: "P&C" },
          { id: "pc-2", name: "김단아", title: "People & Culture 팀", stpid: "P&C" },
          { id: "pc-3", name: "안지훈", title: "People & Culture 팀", stpid: "P&C" },
          { id: "hq-1", pid: "ceos", title: "TFT", name: "박민수" },
          { id: "hq-2", pid: "ceos", title: "HR 컨설팅 본부", name: "박민수" },
          { id: "hq-3", pid: "ceos", title: "HR 솔루션 본부", name: "김현근" },
          { id: "pa-manager", pid: "hq-1", name: "이채령", title: "PA" },
          { id: "PA", pid: "pa-manager", tags: ["PA"] },
          { id: "pa-1", name: "김선경", title: "PA", stpid: "PA" },
          { id: "pa-2", name: "이솔빈", title: "PA", stpid: "PA" },
          { id: "ie-manager", pid: "hq-1", name: "김도윤", title: "면접/교육 운영" },
          { id: "i/e", pid: "ie-manager", tags: ["i/e"] },
          { id: "ie-1", name: "장문경", title: "면접/교육 운영", stpid: "i/e" },
          { id: "ie-2", name: "김낙균", title: "면접/교육 운영", stpid: "i/e" },
          { id: "ie-3", name: "이예린", title: "면접/교육 운영", stpid: "i/e" },
          { id: "ie-4", name: "양우연", title: "면접/교육 운영", stpid: "i/e" },
          { id: "assessment1-manager", pid: "hq-2", name: "권동균", title: "Assessment 1팀" },
          { id: "assessment1", pid: "assessment1-manager", tags: ["i/e"] },
          { id: "assessment1-1", name: "윤지현", title: "Assessment 1팀", stpid: "assessment1" },
          { id: "assessment1-2", name: "김동건", title: "Assessment 1팀", stpid: "assessment1" },
          { id: "assessment1-3", name: "안정훈", title: "Assessment 1팀", stpid: "assessment1" },
          { id: "assessment1-4", name: "안나연", title: "Assessment 1팀", stpid: "assessment1" },
          { id: "assessment1-5", name: "김윤경", title: "Assessment 1팀", stpid: "assessment1" },
          { id: "assessment2-manager", pid: "hq-2", name: "한미희", title: "Assessment 2팀" },
          { id: "assessment2", pid: "assessment2-manager", tags: ["i/e"] },
          { id: "assessment2-1", name: "이다애", title: "Assessment 2팀", stpid: "assessment2" },
          { id: "assessment2-2", name: "김다희", title: "Assessment 2팀", stpid: "assessment2" },
          { id: "assessment2-3", name: "홍경희", title: "Assessment 2팀", stpid: "assessment2" },

          { id: "op-manager", pid: "hq-3", name: "김현해", title: "HR 운영팀" },
          { id: "solution", pid: "op-manager", tags: ["i/e"] },
          { id: "op-1", name: "홍찬미", title: "검사운영", stpid: "solution" },
          { id: "op-2", name: "박세령", title: "검사운영", stpid: "solution" },
          { id: "op-3", name: "김소윤", title: "검사운영", stpid: "solution" },
          { id: "op-4", name: "이다빈", title: "검사운영", stpid: "solution" },
          { id: "op-5", name: "황희은", title: "검사운영", stpid: "solution" },
          { id: "op-6", name: "김다은", title: "검사운영", stpid: "solution" },

          { id: "tech-manager", pid: "hq-3", name: "김대희", title: "HR Tech팀" },
          { id: "tech", pid: "tech-manager", tags: ["i/e"] },
          { id: "tech-1", name: "신효은", title: "UI/UX", stpid: "tech" },
          { id: "frontEnd", pid: "tech-manager", tags: ["i/e"] },
          { id: "tech-2", name: "이혜빈", title: "FrontEnd", stpid: "frontEnd" },
          { id: "tech-3", name: "김현민", title: "FrontEnd", stpid: "frontEnd" },
          { id: "backEnd", pid: "tech-manager", tags: ["i/e"] },
          { id: "tech-4", name: "김정현", title: "BackEnd", stpid: "backEnd" },
          { id: "tech-5", name: "이승현", title: "BackEnd", stpid: "backEnd" },
          // { id: "solution", pid: 924, tags: ["i/e"] },
        ],

        toolbar: {
          layout: true,
          zoom: true,
          fit: true,
        },
      });
      // 노드 업데이트 이벤트
      chart.on("update", (sender, args) => {
        console.log("🚀 ~ chart.on ~ sender:", sender);
        console.log("Node updated:", args);
      });

      chart.onNodeClick((args) => {
        return false;
      });

      // 드래그 앤 드롭 완료 이벤트
      chart.on("drop", (sender, args) => {
        console.log("🚀 ~ chart.on ~ sender:", sender);
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
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={ORG} />
      <div
        id="tree"
        ref={divRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </Flex>
  );
};

export default OrgChartComponent;
