import React from "react";
import { render } from "react-dom";
import "./styles.css";
/* HelperFiles */
import data from "./GEO_DATA.json";

import { LayerPicker } from "./Helpers/SortableHelper";

function App(props: any) {
  return (
    <LayerPicker data={data} />
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
