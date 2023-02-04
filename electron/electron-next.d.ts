declare module "electron-next" {
  interface Directories {
    development: string;
    production: string;
  }

  export default function (
    directories: Directories | string,
    port?: number
  ): Promise<void>;
}
