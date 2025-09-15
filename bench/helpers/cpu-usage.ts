// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function cpuUsage(startUsage: NodeJS.CpuUsage, startTime: number) {
  // Normalize the one returned by process.cpuUsage()
  // (microseconds VS miliseconds)
  const endUsage = process.cpuUsage(startUsage);
  const totalUsage = endUsage.system + endUsage.user;

  const total = (100 * totalUsage) / ((Date.now() - startTime) * 1000);

  return total;
}
