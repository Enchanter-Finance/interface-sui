import { onMounted, onBeforeUnmount } from "vue"

export const useKeydown = () => {
  let callback;
  const onKeydown = (cb) => (callback = cb);
  const handleDocumentKeyPress = (event) => {
      callback(event);
  };
  onMounted(() => {
      document.addEventListener("keydown", handleDocumentKeyPress);
  });
  onBeforeUnmount(() => {
      document.removeEventListener("keydown", handleDocumentKeyPress);
  });
  return { onKeydown };
};