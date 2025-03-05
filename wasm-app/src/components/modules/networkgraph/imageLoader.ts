import { CanvasImage } from "./types";
import WorkloadArrowIcon from "../../../assets/icons/workload-arrow.svg?inline";
import WorkloadDeploymentIcon from "../../../assets/icons/workload-kind-deployment.svg?inline";
import WorkloadDemonsetIcon from "../../../assets/icons/workload-kind-demonset.svg?inline";
import WorkloadReplicasetIcon from "../../../assets/icons/workload-kind-replicaset.svg?inline";
import WorkloadCronjobIcon from "../../../assets/icons/workload-kind-cronjob.svg?inline";
import WorkloadJobIcon from "../../../assets/icons/workload-kind-job.svg?inline";
import WorkloadStatefulsetIcon from "../../../assets/icons/workload-kind-statefulset.svg?inline";
import WorkloadEtcIcon from "../../../assets/icons/workload-kind-etc.svg?inline";
import WorkloadExternalIcon from "../../../assets/icons/workload-kind-external.svg?inline";

import WorkloadExclamationIcon from "../../../assets/icons/workload-exclamation.svg?inline";
import WorkloadProtectedIcon from "../../../assets/icons/workload-protected.svg?inline";
import { color } from "./constants";

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
  const idleColor = color.idle;
  const errorColor = color.error;
  const activeColor = color.active;

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

  const images = await Promise.all([
    loadImage(WorkloadArrowIcon),
    loadImage(workloadArrowIdleIcon),
    loadImage(workloadArrowErrorIcon),
    loadImage(workloadArrowActiveIcon),
    loadImage(WorkloadProtectedIcon),
    loadImage(WorkloadExclamationIcon),
    loadImage(WorkloadDeploymentIcon),
    loadImage(WorkloadDemonsetIcon),
    loadImage(WorkloadReplicasetIcon),
    loadImage(WorkloadCronjobIcon),
    loadImage(WorkloadJobIcon),
    loadImage(WorkloadStatefulsetIcon),
    loadImage(WorkloadEtcIcon),
    loadImage(WorkloadExternalIcon),
  ]);

  return {
    arrow: images[0],
    idleArrow: images[1],
    errorArrow: images[2],
    activeArrow: images[3],
    protected: images[4],
    exclamation: images[5],
    kind: {
      deployment: images[6],
      demonset: images[7],
      replicaset: images[8],
      cronjob: images[9],
      job: images[10],
      statefulset: images[11],
      etc: images[12],
      external: images[13],
    },
  };
};
