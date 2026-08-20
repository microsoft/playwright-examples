# Test strategy

## Objective

Provide fast, maintainable evidence that critical TodoMVC behavior, Reelly AI passwordless sign-in, and representative REST API contracts remain usable across supported browsers.

## Coverage model

| Layer | Coverage | Purpose |
| --- | --- | --- |
| UI smoke | Create a task | Fast signal that the main journey works |
| UI functional | Complete, filter, and clear tasks | Validate state transitions and user-visible behavior |
| UI negative | Reject whitespace-only tasks | Exercise an important input boundary |
| Auth smoke | Render Reelly's passwordless login contract | Detect a broken entry point or missing controls |
| Auth validation | Reject empty and malformed email input | Prevent avoidable requests and give actionable feedback |
| Auth navigation | Expose support and account-registration paths | Preserve recovery options for blocked users |
| Auth live (opt-in) | Request an OTP for a controlled registered account | Verify the email-to-code transition without storing credentials |
| API positive | Read and create posts | Validate status, headers, and response contracts |
| API negative | Request an unknown resource | Validate expected failure behavior |

## Risk priorities

1. A user cannot create or retain a task.
2. Filtering shows incorrect task state.
3. Removing completed work also removes active work.
4. A user cannot start Reelly's passwordless sign-in flow or receives unclear validation.
5. Reelly's recovery or registration paths become unavailable.
6. API status codes or core identifiers break their expected contract.
7. Browser-specific behavior causes inconsistent results.

## Execution

- Pull requests run the full suite on Chromium, Firefox, and WebKit.
- `@smoke` scenarios provide a quick local confidence check.
- `@reelly` identifies the Reelly authentication suite; `@live-auth` marks its opt-in email-sending scenario.
- CI runs Reelly's public, non-message-sending checks and skips the live scenario unless `REELLY_EMAIL` is explicitly provided.
- CI retries failures twice and records a trace on the first retry.
- Screenshots and videos are retained only for failures to support triage without excessive artifacts.

## Out of scope

The public demo applications do not represent a controlled production system. Security, accessibility, visual regression, load testing, and destructive API persistence are intentionally outside this sample's current scope. Completing Reelly OTP authentication is also excluded until a controlled mailbox or test-only API can supply rotating codes without human or production-account dependency.

## Exit criteria

- All critical-path tests pass on all configured browsers.
- No focused tests (`test.only`) enter CI.
- Failure artifacts are available for any unsuccessful CI run.
- Changes to behavior include corresponding test and strategy updates.
