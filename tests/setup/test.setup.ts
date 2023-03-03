process.on("uncaughtExceptionMonitor", (reason) => {
  console.log("FAILED TO CATCH EXCEPTION:", reason);
});

process.on("unhandledRejection", (reason) => {
  console.log(`FAILED TO HANDLE PROMISE REJECTION:`, reason);
});

process.on("uncaughtException", (reason) => {
  console.log(`FAILED TO HANDLE PROMISE REJECTION:`, reason);
});

process.on("rejectionHandled", async (reason) => {
  const rej = await reason;
  console.log("rejectionHandled:", rej);
});
