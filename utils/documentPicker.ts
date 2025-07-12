// 🚫 MVP: Mock DocumentPicker for MVP (document picker functionality disabled)
const DocumentPicker = {
  pick: () =>
    Promise.reject(new Error("Document picker functionality disabled for MVP")),
  pickSingle: () =>
    Promise.reject(new Error("Document picker functionality disabled for MVP")),
  pickMultiple: () =>
    Promise.reject(new Error("Document picker functionality disabled for MVP")),
  isInProgress: () => false,
  types: {
    allFiles: "*/*",
    images: "image/*",
    plainText: "text/plain",
    audio: "audio/*",
    pdf: "application/pdf",
    zip: "application/zip",
    csv: "text/csv",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  perPlatformTypes: {
    android: {},
    ios: {},
  },
};

export default DocumentPicker;
