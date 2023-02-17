// import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
// import { StoryEditorState } from '@app/state/convs-mgr/story-editor';


// export function CreateDeleteButton() {
//   // Create a button element
//   let deleteButton = document.createElement("button");

//   // Set the innerHTML of the button to display a trash icon
//   deleteButton.innerHTML = "<i class='fas fa-trash' style='color: red; font-size: 16px;'></i>";

//   // Set the styles for the button
//   deleteButton.style.backgroundColor = "#ffffff";
//   deleteButton.style.border = "none";
//   deleteButton.style.borderRadius = "30px";
//   deleteButton.style.padding = "4px 4px 3px 4px";
//   deleteButton.style.cursor = "pointer";

//   // Return the created button
//   return deleteButton
// }

// export function DeleteConnectorbyID(jsPlumb: BrowserJsPlumbInstance, state: StoryEditorState, overlayData: any) {
//   // Get the ID of the block to be deleted from the overlayData object
//   const blockId = overlayData.component.id;

//   // Get an array of connections from the state object
//   const conArray = state.connections;

//   // Find the connections that are linked to the block to be deleted
//   const connectionsToDelete = conArray.filter((c: any) => c.sourceBlockId === blockId || c.targetBlockId === blockId);

//   // Delete each connection from the state object and the jsPlumb instance
//   connectionsToDelete.forEach((connection: any) => {
//     const connectionIndex = conArray.indexOf(connection);
//     if (connectionIndex > -1) {
//       conArray.splice(connectionIndex, 1);
//     }
//     jsPlumb.deleteConnection(connection.id);
//   });
// }

// export function findDeletedConnections(oldState: StoryEditorState, newState: StoryEditorState) {
//   const oldConns = new Set(oldState.connections.map(c => c.id));
//   const newConns = new Set(newState.connections.map(c => c.id));
//   const deletedConns = [];
//   for (const oldConn of oldConns) {
//     if (!newConns.has(oldConn)) {
//       deletedConns.push(oldConn);
//     }
//   }
//   return deletedConns;
// }


// // export function DeleteConnectorbyID(jsPlumb: BrowserJsPlumbInstance, state: StoryEditorState, overlayData: any) {
// //   // Get an array of connections from the state object
// //   let conArray: any = state.connections;

// //   // Get an array of all connections using the jsPlumb library
// //   let del: any = jsPlumb.getConnections();

// //   // Filter the connections in the state object by the connection ID in the overlayData object
// //   let con = conArray.find((c: any) => c.id == overlayData.overlay.id);

// //   // Filter the connections obtained from the jsPlumb library by the filtered connection ID
// //   let dCon = del.filter((c: any) => (c.uuids[0] == con.id));

// //   // Delete each filtered connection using the jsPlumb.deleteConnection method
// //   dCon.forEach((cn: any) => {
// //     jsPlumb.deleteConnection(cn);
// //   });
// // }

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryEditorState } from '@app/state/convs-mgr/story-editor';
import { StoryConnectionsStore } from '@app/state/convs-mgr/stories/block-connections';

export function CreateDeleteButton() {
  // Create a button element
  let deleteButton = document.createElement("button");

  // Set the innerHTML of the button to display a trash icon
  deleteButton.innerHTML = "<i class='fas fa-trash' style='color: red; font-size: 16px;'></i>";

  // Set the styles for the button
  deleteButton.style.backgroundColor = "#ffffff";
  deleteButton.style.border = "none";
  deleteButton.style.borderRadius = "30px";
  deleteButton.style.padding = "4px 4px 3px 4px";
  deleteButton.style.cursor = "pointer";

  // Return the created button
  return deleteButton
}

export function DeleteConnectorbyID(jsPlumb: BrowserJsPlumbInstance, state: StoryEditorState, overlayData: any) {
  // Get the ID of the block to delete
  const blockId = overlayData.overlay.id;

  // Get an array of connections from the state object
  const conArray: any = state.connections;

  // Find the connections in the state object that are linked to the block to delete
  const con = conArray.filter((c: any) => c.source === blockId || c.target === blockId);

  // Remove the connections from the state object
  con.forEach((c: any) => {
    const index = conArray.indexOf(c);
    if (index > -1) {
      conArray.splice(index, 1);
    }
  });

  // Get an array of all connections using the jsPlumb library
  const allCons: any = jsPlumb.getConnections();

  // Filter the connections obtained from the jsPlumb library by the filtered connection ID
  const dCon = allCons.filter((c: any) => c.sourceId === blockId || c.targetId === blockId);

  // Delete each filtered connection using the jsPlumb.deleteConnection method
  dCon.forEach((cn: any) => {
    jsPlumb.deleteConnection(cn);

    // Remove the connection document from the Story Connections Store
    StoryConnectionsStore.remove(cn.id);
  });
}

export function DetermineDeletedConnections(state: StoryEditorState, prevConns: any[]): any[] {
  // Get an array of connections from the state object
  const currConns: any = state.connections;

  // Find the connections that were deleted
  const deletedConns = prevConns.filter((c: any) => !currConns.some((cc: any) => cc.id === c.id));

  return deletedConns;
}

