'use strict';

import { Strategy, StrategyExecute } from '@concurrent-tasks/core';

import { StrategySyncOptions } from './Interface';

const dummyDone = () => void 0;

export class StrategySync<T = any> extends Strategy<T, StrategySyncOptions> {
    constructor(config?: Partial<StrategySyncOptions>) {
        super(
            {
                passErrorToDone: false,
                passResultToDone: true,
                logError: false,
            },
            config
        );
    }

    execute: StrategyExecute<T> = async (task, done) => {
        const { passResultToDone, passErrorToDone, logError } = this.config;

        try {
            const result = await task(dummyDone);
            done(passResultToDone && result !== undefined ? result : undefined);
        } catch (error) {
            if (logError) {
                console.error(error);
            }
            done(passErrorToDone && error !== undefined ? error : undefined);
        }
    };
}
