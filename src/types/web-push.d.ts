declare module 'web-push' {
  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
  export function sendNotification(
    subscription: any,
    payload?: string,
    options?: any
  ): Promise<any>;

  const _default: {
    setVapidDetails: typeof setVapidDetails;
    sendNotification: typeof sendNotification;
  };
  export default _default;
}