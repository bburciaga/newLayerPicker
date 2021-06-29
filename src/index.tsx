import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./styles.css";
import { AccordionActions } from "@material-ui/core";


// todo:
// change parent types also to be an array
// make a 'getParentLayer' function that returns the parent object with a given id
// look up Array.filter
// make a 'getChildLayer' function that returns the child object with a given id
// change parent accordion render to iterate over list

const GEO_DATA = {
  id: "water": {
  order: 1,
    enabled: false,
    children: [
      {
        type: "waterShed",
        enabled: true
      },
      {
        type: "waterStreams",
        enabled: true
      }
    ]
  },
  land: {
    enabled: false,
    children: [
      {
        type: "forest",
        enabled: true
      },
      {
        type: "first nations",
        enabled: true
      },
      {
        type: "grassland",
        enabled: true
      }
    ]
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

function App() {
  const classes = useStyles();
  const [objectState, setObjectState] = React.useState(GEO_DATA);

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
  };



  const getChild = (parentType, childType) => {
  // use array.filter here  objectState.
  }

  const getParent = (parentType) => {
    // use array.filter here
  }
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="water-content"
          id="water-heading"
        >
          <Button onClick={updateWaterChild1} variant="contained">
            toggle water
          </Button>
          <Typography className={classes.heading}>Water</Typography>
        </AccordionSummary>
        {objectState.water.children && (
          <>
            {objectState.water.children.map((child) => (
              <AccordionDetails>
                <Button onClick={updateWaterChild1}>
                  {JSON.stringify(child.type)}
                </Button>
              </AccordionDetails>
            ))}
          </>
        )}
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="land-content"
          id="land-heading"
        >
          <Typography className={classes.heading}>Land</Typography>
        </AccordionSummary>
        {objectState.land.children && (
          <>
            {objectState.land.children.map((child) => (
              <AccordionActions>
                <Button key={child.type} {...child}>
                  {JSON.stringify(child.type)}
                </Button>
              </AccordionActions>
            ))}
          </>
        )}
      </Accordion>

      <Button onClick={() => {}}>click me</Button>

      <pre>{JSON.stringify(objectState, null, 2)}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
