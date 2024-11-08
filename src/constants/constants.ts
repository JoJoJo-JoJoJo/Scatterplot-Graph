import { marginProps } from "./types";

const margin: marginProps = { top: 60, right: 50, bottom: 60, left: 120 };
const width: number = 900 - margin.left - margin.right;
const height: number = 500 - margin.top - margin.bottom;

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

export { margin, width, height, url };
