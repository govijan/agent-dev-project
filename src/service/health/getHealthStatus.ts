export type HealthStatus = { status: "ok" };

export const getHealthStatus = (): HealthStatus => ({ status: "ok" });
