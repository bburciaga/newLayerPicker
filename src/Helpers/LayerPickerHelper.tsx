


/**
 * 
 * @param inputArray 
 * @returns 
 */
export const sortArray = (inputArray: any[]) => {
    const returnVal = [...inputArray].sort((a, b) => {
        if ((a as any).order > (b as any).order) {
            return 1;
        }
        if ((a as any).order < (b as any).order) {
            return -1;
        }
        return 0;
    });
    return returnVal;
};

/**
 * 
 * @param id 
 * @param inputArray 
 * @returns 
 */
const getIndexById = (id: string, inputArray: any[]) => {
    const sortedArray = sortArray(inputArray);
    return sortedArray.findIndex((x) => (x as any).id === id);
}

/**
 * Get objects in json before an index of the json array
 * @param inputArray 
 * @param index 
 * @returns 
 */
export function getObjectsBeforeIndex(inputArray: any[], index: number) {
    const sorted = sortArray(inputArray);
    return [...sorted.slice(0, index)];
}

/**
 * Get objects in json after an index of the json array
 * @param inputArray 
 * @param index 
 * @returns 
 */
export function getObjectsAfterIndex(inputArray: any[], index: number) {
    const sorted = sortArray(inputArray);
    return [...sorted.slice(index + 1)];
}

/**
 * Get childs before index of children array from parent pIndex
 * @param inputArray 
 * @param pIndex 
 * @param cIndex 
 * @returns 
 */
export function getChildObjBeforeIndex(inputArray: any[], pIndex: number, cIndex: number) {
    const sorted = sortArray(inputArray);
    return [...(sorted[pIndex] as any).children.slice(0, cIndex)];
}

/**
 * Get childs after index of children array from parent pIndex
 * @param inputArray 
 * @param pIndex 
 * @param cIndex 
 * @returns 
 */
export function getChildObjAfterIndex(inputArray: any[], pIndex: number, cIndex: number) {
    const sorted = sortArray(inputArray);
    return [...(sorted[pIndex] as any).children.slice(cIndex + 1)];
}

/**
 * 
 * @param inputArray 
 * @param id 
 * @returns 
 */
export function getParentIndex(inputArray: any[], id: string) {
    return getIndexById(id, inputArray);
}

/**
 * 
 * @param inputArray 
 * @param parentId 
 * @param childId 
 * @returns 
 */
export function getChildIndex(inputArray: any[], parentId: string, childId: string) {
    let pIndex = getParentIndex(inputArray, parentId);
    let childArray = inputArray[pIndex].children;
    return getIndexById(childId, childArray);
}

/**
 * 
 * @param inputArray 
 * @param parentId 
 * @returns 
 */
export function getParent(inputArray: any[], parentId: string) {
    return inputArray[getParentIndex(inputArray,parentId)];
}

/**
 * 
 * @param inputArray 
 * @param parentId 
 * @param childId 
 * @returns 
 */
export function getChild(inputArray: any[], parentId: string, childId: string) {
    let pIndex = getParentIndex(inputArray, parentId);
    let cIndex = getChildIndex(inputArray, parentId, childId);
    let parentObj = inputArray[pIndex];
    return parentObj.children[cIndex];    
}

/**
 * 
 * @param inputArray 
 * @param order 
 * @returns 
 */
export function getParentByOrder(inputArray: any[], order: number) {
    const sorted = sortArray(inputArray);
    const parent = sorted.filter((x) => (x as any).order === order)[0];
    return {...parent};
}
