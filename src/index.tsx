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
      enabled: true
    },
    {
      type: "waterStreams",
      enabled: true
    }
  ]
  },
  {
    id: "land",
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
];

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



  const getChild = (parentType: String, childType: String) => {
    // use array.filter here  objectState.
      var childData;
    
      objectState.filter(parent => {
          if(parent.id === parentType){
            childData = (parent.children.filter(child => child.type === childType))
          }
            
      })
      return childData;
  }
  //console.log(getChild("water","waterShed"));
  const getParent = (parentType: String) => {
    // use array.filter here
    return objectState.filter(idType =>
      idType.id === parentType)
  }
  //console.log(getParent("land"));
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
            id={parent.id} >
            <Typography className={classes.heading}>{parent.id}</Typography>
          </AccordionSummary>
        </Accordion>
      ))}
      <br />

      <Button>click me</Button>

      <pre>{JSON.stringify(objectState, null, 2)}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
