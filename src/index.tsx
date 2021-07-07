import React, { useState, useEffect, Children } from "react";
import { render } from "react-dom";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

/* Sortable List */
import {
  arrayMove,
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

const GEO_DATA = [
  {
    id: "water",
    order: 1,
    enabled: false,
    children: [
      {
        id: "waterShed",
        order: 1,
        enabled: true,
      },
      {
        id: "waterStreams",
        order: 2,
        enabled: true,
      },
      {
        id: "waterBeds",
        order: 3,
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
        id: "forest",
        order: 1,
        enabled: false,
      },
      {
        id: "first nations",
        order: 2,
        enabled: true,
      },
      {
        id: "grassland",
        order: 3,
        enabled: true,
      },
    ],
  },
  {
    id: "thing",
    order: 3,
    enabled: false,
    children: [
      {
        id: "something",
        order: 1,
        enabled: true,
      },
    ],
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
  accordion: {
    width: "100%",
  },
}));

function App(props: any) {
  const classes = useStyles();
  const [objectState, setObjectState] = useState(props.data);

  const getObjectsBeforeIndex = (index: number) => {
    return [...objectState.slice(0, index)];
  };
  const getObjectsAfterIndex = (index: number) => {
    return [...objectState.slice(index + 1)];
  };

  const getChildObjBeforeIndex = (pIndex: number, cIndex: number) => {
    return [...objectState[pIndex].children.slice(0, cIndex)];
  };
  const getChildObjAfterIndex = (pIndex: number, cIndex: number) => {
    return [...objectState[pIndex].children.slice(cIndex + 1)];
  };

  /**
   *
   * @param parentType String variable
   * @returns object and its containing variables
   */
  const getParent = (parentType: string) => {
    // use array.filter here
    return objectState[getParentIndex(parentType)];
  };

  /**
   *
   * @param parentType String variable
   * @returns object and its containing variables
   */
  const getParentByOrder = (order: number) => {
    // use array.filter here
    const sortedArray = [...objectState].sort((a, b) => {
      if ((a as any).order > (b as any).order) {
        return 1;
      }

      if ((a as any).order < (b as any).order) {
        return -1;
      }

      return 0;
    });
    return sortedArray.filter((x) => (x as any).order === order)[0];
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

  const updateParent = (parentType: string, fieldsToUpdate: Object) => {
    let pIndex = getParentIndex(parentType);
    let parentsBefore: Object[] = getObjectsBeforeIndex(pIndex);
    let parentsAfter: Object[] = getObjectsAfterIndex(pIndex);
    const oldParent = getParent(parentType);
    const updatedParent = { ...oldParent, ...fieldsToUpdate };
    setObjectState([...parentsBefore, updatedParent, ...parentsAfter] as any);
  };

  const updateChild = (
    parentType: string,
    childType: string,
    fieldsToUpdate: Object
  ) => {
    // sort parents, get index of parent
    let pIndex = getParentIndex(parentType);
    // sort child of specific parent, get index of child
    let cIndex = getChildIndex(parentType, childType);
    // get old child and overwrite fields with fields in fieldsToUpdate
    const oldChild = getChild(parentType, childType);
    const updatedChild = { ...oldChild, ...fieldsToUpdate };
    // break up slicing into chunks:
    let parentsBefore = getObjectsBeforeIndex(pIndex);
    let parentsAfter = getObjectsAfterIndex(pIndex);
    //spread to avoid reference issue when copying
    const oldParent = getParent(parentType);

    const childrenBefore = getChildObjBeforeIndex(pIndex, cIndex);
    const childrenAfter = getChildObjAfterIndex(pIndex, cIndex);

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

  const SortableItem = SortableElement(({ text }: any) => (
    <ListItem ContainerComponent="div">
      <ListItemText primary={text} />
      <Accordion className={classes.accordion}>
        <AccordionSummary id={text}>test</AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
      <ListItemSecondaryAction>
        <DragHandle />
      </ListItemSecondaryAction>
    </ListItem>
  ));

  const SortableListContainer = SortableContainer(({ items }: any) => (
    <List>
      {items.map((parent: { id: string; order: number }) => (
        <SortableItem key={parent.id} index={parent.order} text={parent.id} />
      ))}
    </List>
  ));

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    console.log("oldIndex:  :" + oldIndex);
    console.log("newIndex:  :" + newIndex);

    if (newIndex > oldIndex) {
      // 3 to 5
      //      [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }, { f: 6 }];
      //      [{ a: 1 }, { b: 2 }, { d: 3 }, { e: 4 }, { c: 5 },{ f: 6 }];

      //update objects before old index left alone
      let parentsBefore = getObjectsBeforeIndex(oldIndex);

      // update objects between old index and new index decrease
      //todo get inbetween
      let loopIndex = oldIndex + 1;
      let inBetween = [];
      while (loopIndex < newIndex) {
        let obj: any = getParentByOrder(loopIndex);
        obj.order = obj.order + 1;
        inBetween.push({ ...obj });
        loopIndex += 1;
      }

      let objWeMoved: any = getParentByOrder(oldIndex);
      objWeMoved.order = newIndex;

      //leave objects after alone
      let parentsAfter = getObjectsAfterIndex(newIndex);

      setObjectState({
        ...parentsBefore,
        ...inBetween,
        objWeMoved,
        ...parentsAfter,
      });
    } else {
      //update objects before new index left alone
      //update between old and new increase
      // objects after old index alone
    }
  };

  return (
    <div className={classes.root}>
      <SortableListContainer
        items={objectState}
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
          updateParent("water", { enabled: !getParent("water").enabled })
        }
      >
        click me
      </Button>

      <pre>{JSON.stringify(objectState, null, 2)}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App data={GEO_DATA} />, rootElement);
