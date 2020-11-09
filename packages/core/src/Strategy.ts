import { IStrategy } from './Interface';

export const CoreStrategy: IStrategy = function (task, done) {
    task(done);
};
