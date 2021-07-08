import React, { useState, useEffect, Children } from "react";
import { render } from "react-dom";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "@material-ui/core/Checkbox";
/* HelperFiles */
import {
  sortArray,
  getObjectsBeforeIndex,
  getObjectsAfterIndex,
  getChildObjBeforeIndex,
  getChildObjAfterIndex,
  getParentIndex,
  getChildIndex,
  getParent,
  getChild,
  getParentByOrder,
} from "./Helpers/LayerPickerHelper";
import data from './GEO_DATA.json';
/* Sortable List */
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import "./styles.css";
import { flexbox } from "@material-ui/system";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordion: {
    width: "100%"
  },
  div: {
    display: "flex",
    alignItems: "center"
  }
}));

function App(props: any) {
  const classes = useStyles();
  const [objectState, setObjectState] = useState(props.data);
  const [progress, setProgress] = useState(props.progress);


  const updateParent = (parentType: string, fieldsToUpdate: Object) => {
    let pIndex = getParentIndex(objectState, parentType);
    let parentsBefore: Object[] = getObjectsBeforeIndex(objectState, pIndex);
    let parentsAfter: Object[] = getObjectsAfterIndex(objectState, pIndex);
    const oldParent = getParent(objectState, parentType);
    const updatedParent = { ...oldParent, ...fieldsToUpdate };
    setObjectState([...parentsBefore, updatedParent, ...parentsAfter] as any);
  };

  const updateChild = (
    parentType: string,
    childType: string,
    fieldsToUpdate: Object
  ) => {
    // sort parents, get index of parent
    let pIndex = getParentIndex(objectState, parentType);
    // sort child of specific parent, get index of child
    let cIndex = getChildIndex(objectState, parentType, childType);
    // get old child and overwrite fields with fields in fieldsToUpdate
    const oldChild = getChild(objectState, parentType, childType);
    const updatedChild = { ...oldChild, ...fieldsToUpdate };
    // break up slicing into chunks:
    let parentsBefore = getObjectsBeforeIndex(objectState, pIndex);
    let parentsAfter = getObjectsAfterIndex(objectState, pIndex);
    //spread to avoid reference issue when copying
    const oldParent = getParent(objectState, parentType);

    const childrenBefore = getChildObjBeforeIndex(objectState, pIndex, cIndex);
    const childrenAfter = getChildObjAfterIndex(objectState, pIndex, cIndex);

    const newParent = {
      ...oldParent,
      children: [...childrenBefore, updatedChild, ...childrenAfter],
    };

    setObjectState([...parentsBefore, newParent, ...parentsAfter] as any);
  };

  /* Sortable List */
  const DragHandle = SortableHandle(() => (
    <ListItemIcon>
      <DragHandleIcon />
    </ListItemIcon>
  ));

  const SortableItem = SortableElement(({ parent }: any) => (
    <ListItem ContainerComponent="div">
      <ListItemText />
      <Accordion className={classes.accordion}>
        <div className={classes.div}>
          <Checkbox checked={parent.enabled} name={parent.id}
            onChange={() => {
              updateParent(parent.id, { enabled: !getParent(objectState, parent.id).enabled })
            }} />
          <AccordionSummary className={classes.heading} id={parent.id}>
            {parent.id}
          </AccordionSummary>
          <div className="divR">
          <CircularProgress variant="determinate" value={parent.loaded} />
          </div>
        </div>
        {parent.children.map((child: any) => (
          <div className="classes.div">
            &emsp;
            <AccordionDetails>

              <Checkbox checked={child.enabled} name={child.id}
                onChange={() => {
                  updateChild(parent.id, child.id, { enabled: !getChild(objectState, parent.id, child.id).enabled })
                }} />
              {child.id}
              <CircularProgress variant="determinate" value={child.loaded} />
            </AccordionDetails>
          </div>
        ))}
      </Accordion>
      <ListItemSecondaryAction>
        <DragHandle />
      </ListItemSecondaryAction>
    </ListItem>
  ));

  const SortableListContainer = SortableContainer(({ items }: any) => (
    <List>
      {items.map((parent: { id: string; order: number }) => (
        <SortableItem key={parent.id} index={parent.order} parent={parent} />
      ))}
    </List>
  ));

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (newIndex > oldIndex) {
      // 3 to 5
      //      [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }, { f: 6 }];
      //      [{ a: 1 }, { b: 2 }, { d: 3 }, { e: 4 }, { c: 5 },{ f: 6 }];

      //update objects before old index left alone
      let parentsBefore = getObjectsBeforeIndex(objectState, oldIndex);
      console.log("parentsB4:", parentsBefore);

      // update objects between old index and new index decrease
      //todo get inbetween
      let loopIndex = oldIndex + 1;
      let inBetween: any[] = [];
      while (loopIndex < newIndex) {
        let obj: any = getParentByOrder(objectState, loopIndex);
        obj.order = obj.order - 1;
        inBetween.push({ ...obj });
        loopIndex += 1;
        console.log("obj:", obj);
      }

      let objWeMoved: any = getParentByOrder(objectState, oldIndex);
      objWeMoved.order = newIndex;
      console.log("objWeMoved: ", objWeMoved);

      let objWeSwapped: any = getParentByOrder(objectState, newIndex);
      objWeSwapped.order = newIndex - 1;
      console.log("objWeSwapped: ", objWeSwapped);

      //leave objects after alone
      let parentsAfter = getObjectsAfterIndex(objectState, newIndex);
      console.log("parentsAfter: ", parentsAfter);

      const newState = [
        ...parentsBefore,
        ...inBetween,
        objWeSwapped,
        objWeMoved,
        ...parentsAfter,
      ];

      console.log("newState: ", newState);
      setObjectState(newState);
    } else if (newIndex < oldIndex) {
      // 5 to 3
      //      [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }, { f: 6 }];
      //      [{ a: 1 }, { b: 2 }, { e: 3 }, { c: 4 }, { d: 5 }, ,{ f: 6 }];
      let parentsBefore = getObjectsBeforeIndex(objectState, newIndex);
      console.log("parentsB4:", parentsBefore);
      // update objects between old index and new index decrease
      let loopIndex = newIndex + 1;
      let inBetween: any[] = [];
      while (loopIndex < oldIndex) {
        let obj: any = getParentByOrder(objectState, loopIndex);
        obj.order = obj.order + 1;
        inBetween.push({ ...obj });
        loopIndex += 1;
        console.log("obj:", obj);
      }

      let objWeMoved: any = getParentByOrder(objectState, oldIndex);
      objWeMoved.order = newIndex;
      console.log("objWeMoved: ", objWeMoved);

      let objWeSwapped: any = getParentByOrder(objectState, newIndex);
      objWeSwapped.order = newIndex + 1;
      console.log("objWeSwapped: ", objWeSwapped);

      //leave objects after alone
      let parentsAfter = getObjectsAfterIndex(objectState, oldIndex);
      console.log("parentsAfter: ", parentsAfter);

      const newState = [
        ...parentsBefore,
        ...inBetween,
        objWeMoved,
        objWeSwapped,
        ...parentsAfter,
      ];

      console.log("newState: ", newState);
      setObjectState(newState);
    }
  };

  return (
    <div className={classes.root}>
      <SortableListContainer
        items={sortArray(objectState)}
        onSortEnd={onSortEnd}
        useDragHandle={true}
        lockAxis="y"
      />
      {/*
      objectState.map((parent: any) => (
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
                  onChange={() => {
                    updateParent(parent.id, { enabled: !getParent(parent.id).enabled });
                  }}
                  name={parent.id}
                />
              }
              className={classes.heading}
              label={parent.id}
            />
          </AccordionSummary>
          {parent.children.map((child: any) => (
            <AccordionDetails id={child.id}>
              &emsp;
              <FormControlLabel
                control={
                  <Checkbox
                    checked={child.enabled}
                    onChange={() => {
                      updateChild(parent.id, child.id, { enabled: !getChild(parent.id, child.id).enabled });
                    }}
                    name={child.id}
                  />
                }
                className={classes.heading}
                label={child.id}
              />
            </AccordionDetails>
          ))}
        </Accordion>
              ))*/}

      <br />

      <Button
        onClick={() =>
          updateParent("water", { enabled: !getParent(objectState, "water").enabled })
        }
      >
        click me
      </Button>

      <pre>{JSON.stringify(sortArray(objectState), null, 2)}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App data={data} />, rootElement);
