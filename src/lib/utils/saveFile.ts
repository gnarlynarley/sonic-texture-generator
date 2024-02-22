export default function saveFile(file: File) {
  const link = document.createElement("a");
  link.setAttribute("download", file.name);

  const url = URL.createObjectURL(file);
  link.href = url;
  link.onclick = () => {};

  link.click();
  URL.revokeObjectURL(url);
  link.remove();
}
