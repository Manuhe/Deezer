import { uploader } from "../../../utils/uploader.js";
export default [
  {
    method: "POST",
    path: "/upload",
    handler: "library.upload",
    middleware: [uploader({ fieldName: "file" })],
  },
];
