"use strict";

import "./benchmark-setup";

import yoctoSpinner from "yocto-spinner";

import {
  with_ct_10,
  with_ct_100,
  with_ct_1000,
  with_ct_default,
} from "./units/ct";
import { for_each } from "./units/for-each";
import { for_loop } from "./units/for-loop";
import { while_loop } from "./units/while-loop";

benchConfig.taskCount = 1000;

async function main() {
  const fns = [
    while_loop,
    for_loop,
    for_each,
    with_ct_default,
    with_ct_10,
    with_ct_100,
    with_ct_1000,
  ];

  const spinner = yoctoSpinner({
    text: "Benchmarking",
  }).start();

  for (const index in fns) {
    const idx = Number(index);
    const fn = fns[idx];
    spinner.text = `Benchmarking (${idx + 1}/${fns.length}) - ${
      fn.displayName
    } `;
    await fn();
  }

  spinner.success("Success!");
  results.print();
}

main();
