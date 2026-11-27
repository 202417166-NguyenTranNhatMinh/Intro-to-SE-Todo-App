# Business Rules (updated for Group AI)

Changes from the previous version are marked (changed) or (new). Rules moved out of v1 scope are listed under Deferred.

## Authentication

- BR-AUTH-01: Users sign in with Google only (v1). A user is identified by `google_id`, not by email.
- BR-AUTH-02: A session lasts 7 days and is stored in an HttpOnly cookie. After it expires, the user must log in again.
- BR-AUTH-03: Only Google accounts with a verified email can sign in.
- BR-AUTH-04: Logging out clears the session cookie.

## Tasks (both modes)

- BR-TASK-01: A task has a status: Todo, In progress, Done.
- BR-TASK-02 (changed): Each task in a personal list has an importance level: Normal (default) or Important. Group tasks have no importance level. 
- BR-TASK-03: A subtask belongs to exactly one parent task.
- BR-TASK-04: Deleting a parent task also deletes all its subtasks.
- BR-TASK-05: Done tasks stay visible in the list, displayed with a strikethrough.
- BR-TASK-06: A deadline may be in the past.
- BR-TASK-07: A task is overdue if it is not Done, has a deadline. A task due today is not overdue until the next day(if there's only date). A task without a deadline is never overdue. An overdue task's date is shown in different color. Done tasks are never shown as overdue.
- BR-TASK-08: Whoever may change a task's status (the Host, or the assigned Worker) can set it to any status, in any direction, including Done back to In progress or Todo.
- BR-TASK-09 (changed): Tasks are ordered automatically. A personal list has two views the user can switch between: importance-based (the default) and time-based. A group list always uses the time-based order. The view is a display choice of each user and is remembered per account.
- BR-TASK-10 (changed): Importance-based order (personal list only): tasks that are not Done are shown in four groups, in this order: Important and overdue, Important and not overdue, Normal and overdue, Normal and not overdue. Within each group the time-based order (BR-TASK-11) applies. A task moves to another group as soon as its status, deadline or importance changes, or when it becomes overdue at the start of a new day.
- BR-TASK-11 (changed): Time-based order (group lists, and the time-based view of a personal list): tasks that are not Done are shown in one list ordered by deadline, earliest first, so overdue tasks come first. Tasks without a deadline come last. Tasks with the same deadline are ordered by creation time, earliest first. In a personal list, the importance level is shown on each task but does not affect this order.
- BR-TASK-12 (new): In every view, Done tasks are shown in a separate section after the tasks that are not Done, most recently updated first. 

## Group mode

- BR-GRP-01: The user who creates a group is its Host. Each group has exactly one Host (v1).
- BR-GRP-02: Only the Host creates, edits, deletes and assigns tasks.
- BR-GRP-03: A group task has at most one assignee (Worker). The assignee must be a member of the group, and may be the Host.
- BR-GRP-04 (changed): A Worker can only change the status of tasks assigned to them, and comment on them. A Worker cannot edit a task's content, deadline or assignee, or delete a task.
- BR-GRP-05 (changed): The order of the group's tasks is automatic and time-based (BR-TASK-11).
- BR-GRP-06: Invitation statuses: Pending, Accepted, Rejected. The Host can revoke only Pending invitations.
- BR-GRP-07: When a Worker leaves the group, their tasks become unassigned (the assignee field is blank). The tasks themselves are kept.
- BR-GRP-08: Inviting an email that has no account does not create an invitation. The system tells the Host that no account exists for that email, so the Host can ask that person to sign in once with Google and then invite again.
- BR-GRP-09 (new): When the Host assigns a task, the assignee picker opens with the full list of group members who accepted their invitation (including the Host, BR-GRP-03). Members with a Pending or Rejected invitation are not listed. As the Host types in the picker, the list below narrows to the members whose display name contains the typed text, like filtering in a spreadsheet.
- BR-GRP-10 (new): The Host can comment on every task of the group. A Worker can comment only on tasks assigned to them.

## Reminders

- BR-REM-01: Only the Host can send a reminder email for a task.
- BR-REM-02: At most one reminder per task per hour.

## AI (group mode)

AI supports the Host with two features: summarizing the comments on a task, and writing a group progress report. Personal mode has no AI feature.

- BR-AI-01 (new): AI features exist only in group mode and only the Host can use them. A Worker cannot trigger them and does not see AI results.
- BR-AI-02 (new): AI only reads data and produces text for display.
- BR-AI-03 (new): A comment summary covers one task and is built only from the comments on that task. It needs at least 2 comments; otherwise the request is rejected and the LLM is not called. At most the 100 latest comments are sent to the LLM.
- BR-AI-04 (new): A comment summary contains a short overview, the points both sides agreed on, and the points still open. It is based only on what is written in the comments. 
- BR-AI-05 (changed): The latest comment summary is stored per task, and the screen shows when it was last generated. If no comment was added since then, a new request shows the stored summary with the message that there are no new comments since that time, without calling the LLM. A new comment makes the stored summary outdated; the next request generates a new one that replaces it. Deleting the task deletes its summary.
- BR-AI-06 (changed): A progress report covers the whole group (with suggestions of a few tasks to do first, based on deadlines and status) and is built from its current data. All numbers (tasks by status, overdue tasks, open tasks, tasks due within the next 7 days, open tasks per member, unassigned open tasks) are computed by the backend, never by the LLM, which only writes text from them. The screen shows the computed figures next to the AI text so the Host can check them. Reports are stored as described in BR-AI-11.
- BR-AI-08 (new): The LLM never receives ids or email addresses. Task titles, descriptions, comment text and members' display names are sent as plain data and are treated as data, never as instructions.
- BR-AI-10 (changed): Daily limits, counted per group and shared by all uses in that group: at most 3 comment summaries and at most 3 progress reports. The two counters are separate.
- BR-AI-11 (new): The two most recent progress reports of a group are stored (text, figures and time) together with a snapshot of the group's tasks (id, title, status, deadline, overdue state) and members (id, display name) taken when each was generated, and the screen shows when the latest was generated. If nothing in the snapshot data has changed since the latest report, the system shows that report with the message that nothing is new since that time, and does not call the LLM.

Otherwise it generates a new report that also compares with the latest one: tasks newly completed, started, reopened, added, removed, with a changed deadline, newly overdue or still overdue, and how many tasks remain open. The comparison is computed by the backend from the stored snapshot, never by the LLM. The first report of a group has no comparison. Saving a new report deletes the older of the two stored reports.

## Deferred (not in the current scope)

- BR-PER-01: Adding a group task to a personal list as a reference (not a copy). Reason: needs a link table, permission handling for the linked view, and rules for deletion and status sync.
- BR-PER-02: A recurring task creates a new independent task (own status) at each occurrence, on a daily, weekly or monthly schedule. Reason: the generation flow is not designed yet, including how it interacts with positions.
- BR-PER-03: A recurring task creates its next occurrence on schedule even if the previous one is not Done. The new occurrence's deadline is its scheduled date (for example, a weekly task created every Monday has that Monday as its deadline). Reason: same as BR-PER-02.
- BR-AUTH-DEF-01: Email + password registration, login and password reset. Reason: Google login covers authentication for now.
- BR-DOC-DEF-01: Document attachments for tasks and groups. Not decided yet; the spec marks it as optional.
- BR-AI-DEF-01: Progress report for a fixed time period (for example "completed this week"). Reason: needs a `completedAt` field on tasks, set when a task becomes Done and cleared when it leaves Done. Until then, reports compare with the previous report instead (BR-AI-11).
- BR-AI-DEF-02: AI-drafted reminder emails for the Host to edit and send. Reason: reminders already work without AI.
- BR-AI-DEF-03: Keeping more than the 2 latest progress reports, and letting a Worker read a comment summary of their own task.
