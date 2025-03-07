import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    notify : () => {return ipcRenderer.invoke('notify')},
    closeNotification : () => {ipcRenderer.send('closeNotification')},
    notiResponse: (callback:any) => ipcRenderer.once('notification-response', callback),
    store: {
      get(key:string) {
        return ipcRenderer.sendSync('electron-store-get', key);
      },
      set(key:string, val:any) {
        ipcRenderer.send('electron-store-set', key, val);
      }
    }
  },
  
});

