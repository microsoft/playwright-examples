import { test, expect } from "@playwright/test";

test("set fixed time", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2024-02-02T10:00:00"));
  await page.goto("https://demo.playwright.dev/clock");
  await expect(page.getByTestId("clock")).toHaveText("10:00:00");
});

test("manually advance time", async ({ page }) => {
  await page.clock.install({ time: new Date("2024-02-02T08:00:00") });
  await page.goto("https://demo.playwright.dev/clock");

  await page.clock.pauseAt(new Date("2024-02-02T10:00:00"));
  await expect(page.getByTestId("clock")).toHaveText("10:00:00");

  await page.clock.fastForward("30:00");
  await expect(page.getByTestId("clock")).toHaveText("10:30:00");
});

test("test inactivity monitoring", async ({ page }) => {
  await page.clock.install();
  await page.goto("https://demo.playwright.dev/timer");

  await expect(page.getByText("Flash offer")).toBeVisible();

  await page.clock.fastForward("05:00");

  await expect(page.getByText("Offer Expired")).toBeVisible();
});