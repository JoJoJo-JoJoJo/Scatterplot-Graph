import { height, margin, url, width } from "./constants/constants";
import { DataProps } from "./constants/types";
import "./style.css";
import * as d3 from "d3";

const barChart = d3.select("#bar-chart");

const svg = barChart
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

const tooltip = barChart
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

const loadSVG = async () => {
  const res = await fetch(url);
  const data: DataProps[] = await res.json();

  const [xMin = 1900, xMax = 2100] = d3.extent(
    data,
    ({ Year }: DataProps) => Year
  );

  const x = d3.scaleLinear().domain([xMin - 1, xMax + 1]).range([0, width]);

  const [yMin = 2200, yMax = 2500] = d3.extent(
    data,
    ({ Seconds }: DataProps) => Seconds
  );

  const y = d3
    .scaleUtc()
    .domain([new Date(yMin * 1000), new Date(yMax * 1000)])
    .range([0, height]);

  const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
  const formatUtcTime = d3.utcFormat("%M:%S");
  const yAxis = d3.axisLeft<Date>(y).tickFormat(formatUtcTime);

  //TODO: Create a color scale
  const color = d3.scaleOrdinal(d3.schemeSet1);

  //TODO: Append a legend to the svg parent
  barChart
    .append("legend")
    .attr("id", "legend")
    .attr("class", "desc-legend")
    .text("Legend");

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  svg.append("g").attr("id", "y-axis").call(yAxis);

  //TODO: When creating circles, check if there is a 'Doping' string - if there is, give it one fill, else give it a different fill.

  const iterDate = data.map((d: DataProps) => new Date(d["Seconds"] * 1000));

  const circles = svg.selectAll(".dot").data(data);

  circles
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d: DataProps) => d["Year"])
    .attr("data-yvalue", (_, i: number) => iterDate[i].toISOString())
    .style("fill", (d: DataProps) => color((d["Doping"] !== "").toString()))
    .style("stroke", "white")
    .style("opacity", "0.7")
    .attr("cx", (d: DataProps) => x(d["Year"]))
    .attr("cy", (_, i: number) => y(iterDate[i]))
    .attr("r", 5)
    .on("mouseover", (e: Event, d: DataProps) => {
      const [mx, my] = d3.pointer(e);

      const ttText = `
        ${d["Name"]}: <strong class="ta-r">${d["Nationality"]}</strong>
        <br>
        <strong>Year:</strong> ${d["Year"]}, <strong>Time:</strong> ${d["Time"]}
        <br><br>
        ${d["Doping"] ? d["Doping"] : "No doping allegations"}
      `;

      tooltip
        .style("top", `${my - 25}px`)
        .style("left", `${mx}px`)
        .attr("data-year", d["Year"])
        .html(ttText)
        .transition()
        .duration(100)
        .style("opacity", 1);
    })
    .on("mouseout", () =>
      tooltip.transition().duration(100).style("opacity", 0)
    );
};

loadSVG();

// {
//     "Time": "36:50",
//     "Place": 1,
//     "Seconds": 2210,
//     "Name": "Marco Pantani",
//     "Year": 1995,
//     "Nationality": "ITA",
//     "Doping": "Alleged drug use during 1995 due to high hematocrit levels",
//     "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
//   }

/**
 * Name  Nationality
 * Year  Time (M%:S%)
 *
 * Doping (if relevant)
 */
