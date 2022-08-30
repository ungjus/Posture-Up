import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;

        /**
         * Creates Notification
         * 
         * @return the randomly generated message
         */
        notify(): Promise<string>;
        

         /**
         * Closes a notification
         * 
         * Used when user handles click on app
         * 
         */
        closeNotification(): void;

        /**
         * Notificaitions response
         * 
         * @param callback - Contains binary data 0-yes or 1-no based on user response
         */
        notiResponse(callback: any): void;
        
        /**
         * Stores user preferences
         */
        store: {
          /**
           * Get a stored item 
           * 
           * @param key : name of the stored item
           * @return the value contained in the key
           */
          get(key:string): any,
          
          /**
           * Store an item
           * 
           * @param key : name of the item. 
           * @param val : value to be stored
           */
          set(key:string, val:any): void
        };
      };
    };
  }
}

export { };
