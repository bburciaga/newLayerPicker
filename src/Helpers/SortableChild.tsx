import { SortableContainer, SortableElement } from "react-sortable-hoc";
import {
  getChildrenAfterIndex,
  getChildrenBeforeIndex,
  DragHandle,
  getChildByOrder
} from "./LayerPickerHelper";
import { Grid, List, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { updateParent } from "./SortableParent";

const sortChildren = (children: any[], oldIndex: number, newIndex: number) => {
  let returnVal = [];
  if (newIndex > oldIndex) {
    let childrenBefore = getChildrenBeforeIndex(children, oldIndex);

    let loopIndex = oldIndex + 1;
    let inBetween: any[] = [];
    while (loopIndex < newIndex) {
      let obj: any = getChildByOrder(children, loopIndex);
      obj.order = obj.order - 1;
      inBetween.push({ ...obj });
      loopIndex += 1;
    }

    let objWeMoved: any = getChildByOrder(children, oldIndex);
    objWeMoved.order = newIndex;

    let objWeSwapped: any = getChildByOrder(children, newIndex);
    objWeSwapped.order = newIndex - 1;

    let childrenAfter = getChildrenAfterIndex(children, newIndex);

    const newState = [
      ...childrenBefore,
      ...inBetween,
      objWeSwapped,
      objWeMoved,
      ...childrenAfter
    ];

    returnVal = newState;
  } else if (newIndex < oldIndex) {
    let childrenBefore = getChildrenBeforeIndex(children, newIndex);

    let loopIndex = oldIndex + 1;
    let inBetween: any[] = [];
    while (loopIndex < newIndex) {
      let obj: any = getChildByOrder(children, oldIndex);
      obj.order = obj.order - 1;
      inBetween.push({ ...obj });
      loopIndex += 1;
    }

    let objWeMoved: any = getChildByOrder(children, oldIndex);
    objWeMoved.order = newIndex;

    let objWeSwapped: any = getChildByOrder(children, newIndex);
    objWeSwapped.order = newIndex + 1;

    let childrenAfter = getChildrenAfterIndex(children, oldIndex);

    const newState = [
      ...childrenBefore,
      ...inBetween,
      objWeMoved,
      objWeSwapped,
      ...childrenAfter
    ];
    returnVal = newState;
  } else return children;
  return returnVal;
};

export const SortableChild = (props: any) => {
  /*const updateChild = (
    parentType: string,
    childType: string,
    fieldsToUpdate: Object
  ) => {
    // sort parents, get index of parent
    let pIndex = getParentIndex(props.objectState, parentType);
    // sort child of specific parent, get index of child
    let cIndex = getChildIndex(props.objectState, parentType, childType);
    // get old child and overwrite fields with fields in fieldsToUpdate
    const oldChild = getChild(props.objectState, parentType, childType);
    const updatedChild = { ...oldChild, ...fieldsToUpdate };
    // break up slicing into chunks:
    let parentsBefore = getObjectsBeforeIndex(props.objectState, pIndex);
    let parentsAfter = getObjectsAfterIndex(props.objectState, pIndex);
    //spread to avoid reference issue when copying
    const oldParent = getParent(props.objectState, parentType);

    const childrenBefore = getCH(
      props.objectState,
      pIndex,
      cIndex
    );
    const childrenAfter = getChildObjAfterIndex(
      props.objectState,
      pIndex,
      cIndex
    );

    const newParent = {
      ...oldParent,
      children: [...childrenBefore, updatedChild, ...childrenAfter]
    };

    props.setObjectState([...parentsBefore, newParent, ...parentsAfter] as any);
  };*/

  const SortableChildLayer = SortableElement(({ child }: any) => {
    return (
      <Grid container>
        <Grid item xs={8}>
          <Typography>{child.id}</Typography>
        </Grid>
        <Grid item xs={2}>
          <DragHandle />
        </Grid>
      </Grid>
    );
  });

  const SortableListContainer = SortableContainer(({ items }: any) => (
    <List>
      {items.map((child: { id: string; order: number }) => (
        <SortableChildLayer key={child.id} index={child.order} child={child} />
      ))}
    </List>
  ));

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    const returnVal = sortChildren(props.parent.children, oldIndex, newIndex);
    updateParent(
      props.parent.id,
      { children: returnVal },
      props.objectState,
      props.setObjectState
    );
    //props.setObjectState(returnVal);
  };

  return (
    <>
      {props.children && (
        <SortableListContainer
          items={props.children}
          onSortEnd={onSortEnd}
          useDragHandle={true}
          lockAxis="y"
        />
      )}
    </>
  );
};
