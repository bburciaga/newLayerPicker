import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import "./styles.css";

// todo:
// change parent types also to be an array                                              :DONE
// make a 'getParentLayer' function that returns the parent object with a given id      :DONE
// look up Array.filter                                                                 :DONE
// make a 'getChildLayer' function that returns the child object with a given id        :DONE
// change parent accordion render to iterate over list                                  :DONE

const GEO_DATA = [
  {
    id: "water",
    order: 1,
    enabled: false,
    children: [
      {
        type: "waterShed",
        enabled: true,
      },
      {
        type: "waterStreams",
        enabled: true,
      },
      {
        type: "waterBeds",
        enabled: true,
      },
    ],
  },
  {
    id: "land",
    order: 2,
    enabled: true,
    children: [
      {
        type: "forest",
        enabled: false,
      },
      {
        type: "first nations",
        enabled: true,
      },
      {
        type: "grassland",
        enabled: true,
      },
    ],
  },
  {
    id: "thing",
    order: 3,
    enabled: false,
    children: [],
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function App() {
  const classes = useStyles();
  const [objectState, setObjectState] = useState(GEO_DATA);

  /**
   *
   * @param parentType String variable
   * @returns object and its containing variables
   */
  const getParent = (parentType: string) => {
    // use array.filter here
    return objectState.filter((idType) => idType.id === parentType);
  };
  /**
   * Used to get index of parent in JSON array
   * @param parentType String variable
   * @returns integer value
   */
  const getIndexByID = (id: string, inputArray: Object[]) => {
    const sortedArray = [...inputArray].sort((a, b) => {
      if ((a as any).order > (b as any).order) {
        return 1;
      }

      if ((a as any).order < (b as any).order) {
        return -1;
      }

      return 0;
    });
    return sortedArray.findIndex((x) => (x as any).id === id);
  };

  /**
   * Used to get index of parent in JSON array
   * @param parentType String variable
   * @returns integer value
   */
  const getParentIndex = (id: string) => {
    return getIndexByID(id, objectState);
  };

  /**
   * Used to get index of child in parent children array
   * @param parentType String variable to get Array value of parent
   * @param childType String variable to get Array value of child under the parent value
   * @returns integer value
   */
  const getChildIndex = (parentType: string, childType: string) => {
    let g = objectState[getParentIndex(parentType)].children;
    return getIndexByID(childType, g);
  };

  /**
   *
   * @param parentType String variable
   * @param childType String variable
   * @returns child component of parent children array
   */
  const getChild = (parentType: string, childType: string) => {
    // use array.filter here  objectState.
    return objectState[getParentIndex(parentType)].children[
      getChildIndex(parentType, childType)
    ];
  };

  var x = getChild("water", "waterStreams");
  console.log(x.enabled);
  /**
   * Changes the enabled state to true or false. For checkboxes
   * @param parentType String variable
   */
  const toggleParent = (parentType: string) => {
    let parent = { ...objectState[getParentIndex(parentType)] };
    parent.enabled = !parent.enabled;
    const parentsBefore: Object[] = [];
    const parentsAfter: Object[] = [];
    setObjectState([...parentsBefore, parent, ...parentsAfter] as any);
  };

  const getObjectsBeforeIndex = (index: number) => {};
  const getObjectsAfterIndex = (index: number) => {};

  /**
   *
   * @param parentType
   * @param childType
   */
  const toggleChild = (parentType: string, childType: string) => {
    let child = getChild(parentType, childType);
    child.enabled = !child.enabled;
    if (getChildIndex(parentType, childType) === -1) console.log("error");
    else {
    }
  };

  const updateParent = (parentType: String, fieldsToUpdate: Object) => {};

  const updateChild = (
    parentType: String,
    childType: String,
    fieldsToUpdate: Object
  ) => {
    // sort parents, get index of parent
    // sort child of specific parent, get index of child
    // get old child and overwrite fields with fields in fieldsToUpdate
    // const oldChild = objectState[parentIndex].children[childIndex]
    // const updatedChild = {...oldChild, ...fieldsToUpdate}
    // break up slicing into chunks:
    // let parentsBeforeThisOne = []
    // let parentsAFterThisOne = []
    //spread to avoid reference issue when copying
    // let ThisParent = { ...objectState[indexOfParent] }
    //setObjectState([...parentsBeforeThisOne, thisOne, ...parentsAfterThisOne])
  };

  /*
  const toggleWater = () => {
    setObjectState({
      ...objectState,
      water: { ...objectState.water, enabled: !objectState.water.enabled }
    });
  };
  const updateWaterChild1 = () => {
    setObjectState({
      ...objectState,
      water: {
        ...objectState.water,
        children: [
          ...objectState.water.children.slice(1),
          {
            ...objectState.water.children[0],
            enabled: !objectState.water.children[0].enabled
          }
        ]
      }
    });
  };*/
  /* const changeChild = (e) => {
    setChildState({
      ...childState,
      enabled: !childState.enabled
    })
  }
  */
  //console.log(childState)
  /*const logHook = useEffect(() => {
    console.log(JSON.stringify(objectState, null, 2));
  }, [objectState]);*/

  return (
    <div className={classes.root}>
      {objectState.map((parent) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="water-content"
            id={parent.id}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={parent.enabled}
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    toggleParent(parent.id);
                  }}
                  name={parent.id}
                />
              }
              className={classes.heading}
              label={parent.id}
            />
          </AccordionSummary>
          {parent.children.map((child) => (
            <AccordionDetails id={child.type}>
              &ensp;
              <FormControlLabel
                control={
                  <Checkbox
                    checked={child.enabled}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      toggleChild(parent.id, child.type);
                    }}
                    name={child.type}
                  />
                }
                className={classes.heading}
                label={child.type}
              />
            </AccordionDetails>
          ))}
        </Accordion>
      ))}
      <br />

      <Button onClick={() => toggleChild("water", "waterBeds")}>
        click me
      </Button>

      <pre>{JSON.stringify(objectState, null, 2)}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
