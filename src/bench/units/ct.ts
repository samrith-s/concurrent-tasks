import { TaskRunner } from "../../TaskRunner";
import { bench } from "../helpers/benchmarker";

const withCT = (name: string, concurrency = 3) =>
  bench(`with-ct-${name}`, ({ done, tasks }) => {
    const runner = new TaskRunner({
      concurrency,
      onEnd: done,
    });

    runner.addMultiple(tasks);

    runner.start();
  });

export const with_ct_default = withCT("default");
export const with_ct_10 = withCT("10", 10);
export const with_ct_100 = withCT("100", 100);
export const with_ct_1000 = withCT("1000", 1000);
