"use strict";

import "./benchmark-setup";

import yoctoSpinner from "yocto-spinner";

import { with_ct_10, with_ct_100, with_ct_default } from "./units/ct";
import { for_each } from "./units/for-each";
import { for_loop } from "./units/for-loop";
import { while_loop } from "./units/while-loop";

benchConfig.taskCount = 10000;

async function main() {
  const fns = [
    while_loop,
    for_loop,
    for_each,
    with_ct_default,
    with_ct_10,
    with_ct_100,
  ];

  console.log("\nConcurrent Tasks - Benchmarks");
  console.log("Total tasks:", benchConfig.taskCount, "\n");

  for (const index in fns) {
    const idx = Number(index);
    const fn = fns[idx];

    const spinner = yoctoSpinner({
      text: `(${idx + 1}/${fns.length}) ${fn.displayName}`,
      spinner: undefined,
    }).start();

    await fn();

    spinner.success();
  }

  console.log("");
  results.print();
}

main();
