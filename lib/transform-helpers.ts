import { WindowInfo, ResourceWindow, ResourceType } from './interfaces';
export function prepareResourceWindow(workerWindow: WindowInfo): ResourceWindow {
  if (workerWindow) {
    return {
      start: workerWindow.start,
      startText: workerWindow.startText,
      end: workerWindow.end,
      endText: workerWindow.endText,
      roles: workerWindow.roles.map(getResourceType),
      id: workerWindow.guid
    }
  }
}

export function getResourceType(role: string): ResourceType {
    if (role) {
        return ResourceType[role];
    }
}
