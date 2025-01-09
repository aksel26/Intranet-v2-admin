"use client";
import { Box, Flex, Paper, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";

function page() {
  const divRef = useRef(null);

  useEffect(() => {
    if (!divRef.current) return;

    const chart = new OrgChart(divRef.current, {
      enableSearch: false,
      enableDragDrop: true,
      tags: {
        assistant: {
          template: "ula",
        },
      },
      nodeBinding: {
        field_0: "name",
        field_1: "title",
        field_2: "team",
      },
      nodes: [
        { id: 1, tags: ["ceo"], name: "Denny Curtis", title: "CEO", img: "https://cdn.balkan.app/shared/2.jpg" },
        { id: 2, pid: 1, tags: ["partner"], name: "dasdfasdf", title: "CEO", img: "https://cdn.balkan.app/shared/2.jpg" },
        { id: 3, pid: 1, tags: "RR", name: "Caden Ellison", title: "Dev Manager", img: "https://cdn.balkan.app/shared/4.jpg" },

        { id: 7, pid: 1, name: "Fran Parsons", title: "Developer", img: "https://cdn.balkan.app/shared/8.jpg" },
        { id: 8, pid: 1, tags: ["assistant"], name: "Rudy Griffiths", title: "Assistant", img: "https://cdn.balkan.app/shared/9.jpg" },
        { id: 9, pid: 7, name: "hihi", title: "adfasdf", img: "https://cdn.balkan.app/shared/9.jpg" },
        { id: 10, pid: 7, name: "hihi", title: "adfasdf", img: "https://cdn.balkan.app/shared/9.jpg" },
      ],

      // nodes: [
      //   // 공동대표
      //   { id: 1, name: "공동대표 1", title: "공동대표" },
      //   { id: 2, name: "공동대표 2", title: "공동대표" },

      //   // 도움팀 (Assistant)
      //   { id: 3, pid: 1, name: "도움팀원 1", title: "Assistant", team: "도움팀" },
      //   { id: 4, pid: 1, name: "도움팀원 2", title: "Assistant", team: "도움팀" },
      //   { id: 5, pid: 2, name: "도움팀원 3", title: "Assistant", team: "도움팀" },
      //   { id: 6, pid: 2, name: "도움팀원 4", title: "Assistant", team: "도움팀" },

      //   // 본부
      //   { id: 7, pid: 1, name: "본부장 1", title: "본부장", team: "제1본부" },
      //   { id: 8, pid: 2, name: "본부장 2", title: "본부장", team: "제2본부" },

      //   // 제1본부 팀
      //   { id: 9, pid: 7, name: "팀장 1", title: "팀장", team: "제1본부 1팀" },
      //   { id: 10, pid: 9, name: "팀원 1", title: "팀원", team: "제1본부 1팀" },
      //   { id: 11, pid: 9, name: "팀원 2", title: "팀원", team: "제1본부 1팀" },

      //   // 제2본부 팀
      //   { id: 12, pid: 8, name: "팀장 2", title: "팀장", team: "제2본부 1팀" },
      //   { id: 13, pid: 12, name: "팀원 3", title: "팀원", team: "제2본부 1팀" },
      //   { id: 14, pid: 12, name: "팀원 4", title: "팀원", team: "제2본부 1팀" },
      // ]
    });

    // return () => {
    //   // cleanup
    //   if (chart) {p
    //     chart.destroy();
    //   }
    // };
  }, []);
  return <div ref={divRef} style={{ height: "100%", width: "100%" }}></div>;
}

export default page;
