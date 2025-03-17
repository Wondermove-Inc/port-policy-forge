import { color } from "./constants";
import { CanvasImage } from "./types";

import WorkloadArrowIcon from "@/assets/icons/workload-arrow.svg?inline";
import WorkloadExclamationIcon from "@/assets/icons/workload-exclamation.svg?inline";
import WorkloadCronjobIcon from "@/assets/icons/workload-kind-cronjob.svg?inline";
import WorkloadDemonsetIcon from "@/assets/icons/workload-kind-demonset.svg?inline";
import WorkloadDeploymentIcon from "@/assets/icons/workload-kind-deployment.svg?inline";
import WorkloadEtcIcon from "@/assets/icons/workload-kind-etc.svg?inline";
import WorkloadExternalIcon from "@/assets/icons/workload-kind-external.svg?inline";
import WorkloadJobIcon from "@/assets/icons/workload-kind-job.svg?inline";
import WorkloadReplicasetIcon from "@/assets/icons/workload-kind-replicaset.svg?inline";
import WorkloadStatefulsetIcon from "@/assets/icons/workload-kind-statefulset.svg?inline";
import WorkloadLineConnectedIcon from "@/assets/icons/workload-line-connected.svg?inline";
import WorkloadProtectedIcon from "@/assets/icons/workload-protected.svg?inline";

export class ImageLoader {
  constructor() {}

  async load(): Promise<CanvasImage> {
    const idleColor = color.idle;
    const errorColor = color.error;
    const activeColor = color.active;
    const defaultColor = color.stroke.default;

    const workloadArrowIdleIcon = WorkloadArrowIcon.replace(
      /stroke=['"]%23[0-9a-fA-F]{3,6}['"]/g,
      `stroke='%23${idleColor.slice(1)}'`,
    );

    const workloadArrowErrorIcon = WorkloadArrowIcon.replace(
      /stroke=['"]%23[0-9a-fA-F]{3,6}['"]/g,
      `stroke='%23${errorColor.slice(1)}'`,
    );

    const workloadArrowActiveIcon = WorkloadArrowIcon.replace(
      /stroke=['"]%23[0-9a-fA-F]{3,6}['"]/g,
      `stroke='%23${activeColor.slice(1)}'`,
    );

    const workloadArrowDefaultIcon = WorkloadArrowIcon.replace(
      /stroke=['"]%23[0-9a-fA-F]{3,6}['"]/g,
      `stroke='%23${defaultColor.slice(1)}'`,
    );

    const images = await Promise.all([
      this.loadImage(WorkloadArrowIcon),
      this.loadImage(workloadArrowIdleIcon),
      this.loadImage(workloadArrowErrorIcon),
      this.loadImage(workloadArrowActiveIcon),
      this.loadImage(WorkloadProtectedIcon),
      this.loadImage(WorkloadExclamationIcon),
      this.loadImage(WorkloadDeploymentIcon),
      this.loadImage(WorkloadDemonsetIcon),
      this.loadImage(WorkloadReplicasetIcon),
      this.loadImage(WorkloadCronjobIcon),
      this.loadImage(WorkloadJobIcon),
      this.loadImage(WorkloadStatefulsetIcon),
      this.loadImage(WorkloadEtcIcon),
      this.loadImage(WorkloadExternalIcon),
      this.loadImage(WorkloadLineConnectedIcon),
      this.loadImage(workloadArrowDefaultIcon),
    ]);

    return {
      arrow: images[0],
      idleArrow: images[1],
      errorArrow: images[2],
      activeArrow: images[3],
      defaultArrow: images[15],
      protected: images[4],
      exclamation: images[5],
      kind: {
        deployment: images[6],
        daemonset: images[7],
        replicaset: images[8],
        cronjob: images[9],
        job: images[10],
        statefulset: images[11],
        etc: images[12],
        external: images[13],
      },
      lineConnected: images[14],
    };
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        resolve(img);
      };
    });
  }
}
