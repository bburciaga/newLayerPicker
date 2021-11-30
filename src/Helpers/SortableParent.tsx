import React from "react";
import { Accordion, AccordionSummary, List, ListItem } from "@material-ui/core";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
/* HelperFiles */
import {
  sortArray,
  getObjectsBeforeIndex,
  getObjectsAfterIndex,
  getParentIndex,
  getParent,
  sortObject,
  DragHandle
} from "./LayerPickerHelper";
import { SortableChild } from "./SortableChild";
import { Grid, Typography } from "@material-ui/core";

export const updateParent = (
  parentType: string,
  fieldsToUpdate: Object,
  objectState: any,
  setObjectState: any
) => {
  let pIndex = getParentIndex(objectState, parentType);
  let parentsBefore: Object[] = getObjectsBeforeIndex(objectState, pIndex);
  let parentsAfter: Object[] = getObjectsAfterIndex(objectState, pIndex);
  const oldParent = getParent(objectState, parentType);
  const updatedParent = { ...oldParent, ...fieldsToUpdate };
  setObjectState([...parentsBefore, updatedParent, ...parentsAfter] as any);
};

export const SortableParent = (props: any) => {
  /* Sortable List */

  const SortableParentLayer = SortableElement(({ parent }: any) => {
    const onParentLayerAccordionChange = (event: any, expanded: any) => {
      updateParent(
        (parent as any).id,
        { expanded: expanded },
        props.objectState,
        props.setObjectState
      );
    };

    return (
      <ListItem ContainerComponent="div">
        <Grid container xs={12}>
          <Accordion
            expanded={parent.expanded}
            onChange={onParentLayerAccordionChange}
            style={{ width: "100%" }}
          >
            <AccordionSummary id={parent.id}>
              <Grid item xs={10}>
                <Typography>{parent.id}</Typography>
              </Grid>
              <Grid item xs={2}>
                <DragHandle />
              </Grid>
            </AccordionSummary>
            <Grid container xs={12} alignContent="center">
              <SortableChild
                parent={parent}
                children={parent.children}
                objectState={props.objectState}
                setObjectState={props.setObjectState}
              />
            </Grid>
          </Accordion>
        </Grid>
      </ListItem>
    );
  });

  const SortableListContainer = SortableContainer(({ items }: any) => (
    <List>
      {items.map((parent: { id: string; order: number }) => (
        <SortableParentLayer
          key={parent.id}
          index={parent.order}
          parent={parent}
        />
      ))}
    </List>
  ));

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    const returnVal = sortObject(props.objectState, oldIndex, newIndex);
    props.setObjectState(returnVal);
  };

  return (
    <SortableListContainer
      items={sortArray(props.objectState)}
      onSortEnd={onSortEnd}
      useDragHandle={true}
      lockAxis="y"
    />
  );
};
