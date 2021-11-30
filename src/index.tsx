import React, { useState } from "react";
import { render } from "react-dom";
import { SortableParent } from "./Helpers/SortableParent";

import "./styles.css";
/* HelperFiles */
import { sortArray } from "./Helpers/LayerPickerHelper";
import data from "./GEO_DATA.json";

function App(props: any) {
  const [objectState, setObjectState] = useState(props.data);
  // Progress bar
  // const [progress, setProgress] = useState(props.progress);

  /**/

  return (
    <div>
      <SortableParent
        data={props.data}
        setObjectState={setObjectState}
        objectState={objectState}
      />

      <br />

      <pre>{JSON.stringify(sortArray(objectState), null, 2)}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App data={data} />, rootElement);
