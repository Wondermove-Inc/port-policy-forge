import WorkloadProtectedIcon from "../../../assets/icons/workload-protected.svg?inline";
import WorkloadDeploymentIcon from "../../../assets/icons/workload-deployment.svg?inline";
import WorkloadArrowIcon from "../../../assets/icons/workload-arrow.svg?inline";
import WorkloadArrowActiveIcon from "../../../assets/icons/workload-arrow-active.svg?inline";
import WorkloadExclamationIcon from "../../../assets/icons/workload-exclamation.svg?inline";
import { CanvasImage } from "./types";

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
  });
};

export const loadAllImages = async (): Promise<CanvasImage> => {
  // Định nghĩa các màu cho các trạng thái khác nhau
  const idleColor = "#FFA800";
  const errorColor = "#EB4136";
  const activeColor = "#538BFF";
  
  // Tạo biến thể của các icon với màu khác nhau
  const workloadArrowIdleIcon = WorkloadArrowIcon.replace(
    /stroke=['"]%23[0-9a-fA-F]{3,6}['"]/g,
    `stroke='%23${idleColor.slice(1)}'`
  );

  const workloadArrowErrorIcon = WorkloadArrowIcon.replace(
    /stroke=['"]%23[0-9a-fA-F]{3,6}['"]/g,
    `stroke='%23${errorColor.slice(1)}'`
  );

  const workloadArrowActiveIcon = WorkloadArrowIcon.replace(
    /stroke=['"]%23[0-9a-fA-F]{3,6}['"]/g,
    `stroke='%23${activeColor.slice(1)}'`
  );

  // Tải tất cả hình ảnh cần thiết
  const images = await Promise.all([
    loadImage(WorkloadArrowIcon),
    loadImage(workloadArrowIdleIcon),
    loadImage(workloadArrowErrorIcon),
    loadImage(workloadArrowActiveIcon),
    loadImage(WorkloadProtectedIcon),
    loadImage(WorkloadExclamationIcon),
    loadImage(WorkloadDeploymentIcon),
  ]);

  // Trả về đối tượng CanvasImage chứa các hình ảnh đã tải
  return {
    arrow: images[0],
    idleArrow: images[1],
    errorArrow: images[2],
    activeArrow: images[3],
    protected: images[4],
    exclamation: images[5],
    deployment: images[6],
  };
};