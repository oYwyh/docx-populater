// types/docx4js.d.ts

declare module 'docx4js' {
    export function parse(buffer: ArrayBuffer): Promise<any>;
}
