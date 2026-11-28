# Business Rules (updated for Group AI)

Changes from the previous version are marked (changed) or (new). Rules moved out of v1 scope are listed under Deferred.

## Authentication

- BR-AUTH-01: Users sign in with Google only (v1). A user is identified by `google_id`, not by email.
- BR-AUTH-02: A session lasts 7 days and is stored in an HttpOnly cookie. After it expires, the user must log in again.
- BR-AUTH-03: Only Google accounts with a verified email can sign in.
- BR-AUTH-04: Logging out clears the session cookie.

## Tasks (both modes)

- BR-TASK-01: A task has a status: Todo, In progress, Done.
- BR-TASK-02: Each task in a personal list has an importance level: Normal (default) or Important. Group tasks have no importance level.
- BR-TASK-03: A subtask belongs to exactly one parent task.
- BR-TASK-04: Deleting a parent task also deletes all its subtasks.
- BR-TASK-05: Done tasks stay visible in the list, displayed with a strikethrough.
- BR-TASK-06: A deadline may be in the past.
- BR-TASK-07 (changed): A task is overdue if it is not Done, has a deadline, and that deadline has passed. A task due today is not overdue until the next day (if there is only a date). A task without a deadline is never overdue. An overdue task's date is shown in a different color. Done tasks are never shown as overdue.
- BR-TASK-08 (changed): Whoever may change a task's status can set it to any status, in any direction, including Done back to In progress or Todo. For a personal task that is its owner; for a group task it is any member of the group (the Host or a Worker), whether or not the task is assigned to them.
- BR-TASK-09: Tasks are ordered automatically. A personal list has two views the user can switch between: importance-based (the default) and time-based. A group list always uses the time-based order. The view is a display choice of each user and is remembered per account.
- BR-TASK-10: Importance-based order (personal list only): tasks that are not Done are shown in four groups, in this order: Important and overdue, Important and not overdue, Normal and overdue, Normal and not overdue. Within each group the time-based order (BR-TASK-11) applies. A task moves to another group as soon as its status, deadline or importance changes, or when it becomes overdue at the start of a new day.
- BR-TASK-11: Time-based order (group lists, and the time-based view of a personal list): tasks that are not Done are shown in one list ordered by deadline, earliest first, so overdue tasks come first. Tasks without a deadline come last. Tasks with the same deadline are ordered by creation time, earliest first. In a personal list, the importance level is shown on each task but does not affect this order.
- BR-TASK-12: In every view, Done tasks are shown in a separate section after the tasks that are not Done, most recently updated first.
- BR-TASK-13 (new): When a Done task is changed back to Todo or In progress, it leaves the Done section and is placed among the tasks that are not Done like any other, according to the view the user currently has (BR-TASK-10 or BR-TASK-11). It does not keep its old position. If its deadline has passed it is overdue again.
- BR-TASK-14 (new): A personal list has no filter and no search. Its two views (BR-TASK-09) are the only way to organize it. Filtering and searching exist only in a group list (BR-GRP-11).

## Group mode

- BR-GRP-01: The user who creates a group is its Host. Each group has exactly one Host (v1).
- BR-GRP-02 (changed): Only the Host creates, edits, deletes and assigns tasks (and edits their content, deadline and assignee). A Worker cannot do any of these.
- BR-GRP-03: A group task has at most one assignee. The assignee must be a member of the group, and may be the Host. Being the assignee does not give extra permissions: every member has the same permissions on every task (BR-GRP-04).
- BR-GRP-04 (changed): Every member of the group, Host or Worker, can change the status of any task of the group (BR-TASK-08) and comment on any task of the group (BR-GRP-10), whether or not it is assigned to them. A Worker cannot create a task, edit a task's content, deadline or assignee, or delete a task.
- BR-GRP-05: The order of the group's tasks is automatic and time-based (BR-TASK-11).
- BR-GRP-06: Invitation statuses: Pending, Accepted, Rejected. The Host can revoke only Pending invitations.
- BR-GRP-07: When a Worker leaves the group, their tasks become unassigned (the assignee field is blank). The tasks themselves are kept.
- BR-GRP-08: Inviting an email that has no account does not create an invitation. The system tells the Host that no account exists for that email, so the Host can ask that person to sign in once with Google and then invite again.
- BR-GRP-09: When the Host assigns a task, the assignee picker opens with the full list of group members who accepted their invitation (including the Host, BR-GRP-03). Members with a Pending or Rejected invitation are not listed. As the Host types in the picker, the list below narrows to the members whose display name contains the typed text, like filtering in a spreadsheet.
- BR-GRP-10 (changed): Every member of the group (Host or Worker) can comment on every task of the group.
- BR-GRP-11 (new): The Host and the Workers of a group share the same screen: the list of all tasks of the group, and the chat (comments) window of the selected task. Every member can filter and search that list by assignee name (including unassigned tasks), status, deadline and keyword in the title. Only the buttons to add, edit, delete, assign and remind are shown to the Host alone.
- BR-GRP-12 (new, proposed): Subtasks of a group task are created, edited and deleted by the Host as part of editing the task. Any member can change the status of a subtask. To be confirmed.
- BR-GRP-13 (new): Deleting a group task deletes all data tied to it: its subtasks, comments, comment summary and reminder log. Snapshots of the task stored inside saved progress reports are kept, so that the next report can show the task as removed (proposed, to be confirmed).

## Reminders

- BR-REM-01: Only the Host can send a reminder email for a task.
- BR-REM-02: At most one reminder per task per hour.

## AI (group mode)

AI offers two features in group mode: summarizing the comments on a task, which every member (Host or Worker) can use on any task, and writing a group progress report, which only the Host can use. Personal mode has no AI feature.

- BR-AI-01 (changed): AI features exist only in group mode. Every member of the group can use the comment summary on any task of the group, since one person's task can affect others. Only the Host can request or see the progress report.
- BR-AI-02: AI only reads data and produces text for display.
- BR-AI-03: A comment summary covers one task and is built only from the comments on that task. It needs at least 2 comments; otherwise the request is rejected and the LLM is not called. At most the 100 latest comments are sent to the LLM.
- BR-AI-04: A comment summary contains a short overview, the points the participants agreed on, and the points still open. It is based only on what is written in the comments.
- BR-AI-05 (changed): The latest comment summary is stored per task, and the screen shows when it was last generated. Every member can see the stored summary. If no comment was added since then, a new request shows the stored summary with the message that there are no new comments since that time, without calling the LLM. A new comment makes the stored summary outdated; the next request generates a new one that replaces it. Deleting the task deletes its summary (BR-GRP-13).
- BR-AI-06 (changed): A progress report covers the whole group and is built from its current data. All numbers (tasks by status, overdue tasks, open tasks, tasks due within the next 7 days, open tasks per member, unassigned open tasks) are computed by the backend, never by the LLM, which only writes text from them. The AI text contains an overview, notable points, risks, and a suggestion of a few tasks to do first, based on deadlines and status. Each notable point, risk and suggestion comes with a short explanation of the reasoning behind it, based on the data. Each suggested task names its assignee (or says it is unassigned). The screen shows the computed figures next to the AI text so the Host can check them. Reports are stored as described in BR-AI-11.
- BR-AI-08 (changed): The LLM never receives ids or email addresses. Task titles, descriptions, comment text and members' display names are sent as plain data and are treated as data, never as instructions. In the progress report, the display name of a task's assignee is sent only so the AI can name who is in charge of a suggested task.
- BR-AI-11 (changed): The two most recent progress reports of a group are stored (text, figures and time) together with a snapshot of the group's tasks (id, title, status, deadline, overdue state) taken when each was generated, and the screen shows when the latest was generated. Members and assignees are not part of the snapshot. If nothing in the snapshot data has changed since the latest report, the system shows that report with the message that nothing is new since that time, and does not call the LLM. Changing a task's assignee or the group's members is not a change in this check.
Otherwise it generates a new report that also compares with the latest one, on task progress only: tasks newly completed, started, reopened, added, removed, with a changed deadline, newly overdue or still overdue, and how many tasks remain open. The comparison has no information about members. It is computed by the backend from the stored snapshot, never by the LLM. The first report of a group has no comparison. Saving a new report deletes the older of the two stored reports.

## Deferred (not in the current scope)

- BR-PER-01: Adding a group task to a personal list as a reference (not a copy). Reason: needs a link table, permission handling for the linked view, and rules for deletion and status sync.
- BR-PER-02: A recurring task creates a new independent task (own status) at each occurrence, on a daily, weekly or monthly schedule. Reason: the generation flow is not designed yet, including how it interacts with positions.
- BR-PER-03: A recurring task creates its next occurrence on schedule even if the previous one is not Done. The new occurrence's deadline is its scheduled date (for example, a weekly task created every Monday has that Monday as its deadline). Reason: same as BR-PER-02.
- BR-AUTH-DEF-01: Email + password registration, login and password reset. Reason: Google login covers authentication for now.
- BR-DOC-DEF-01: Document attachments for tasks and groups. Not decided yet; the spec marks it as optional.
- BR-AI-DEF-01: Progress report for a fixed time period (for example "completed this week"). Reason: needs a `completedAt` field on tasks, set when a task becomes Done and cleared when it leaves Done. Until then, reports compare with the previous report instead (BR-AI-11).
- BR-AI-DEF-02: AI-drafted reminder emails for the Host to edit and send. Reason: reminders already work without AI.
- BR-AI-DEF-03: Keeping more than the 2 latest progress reports.
- BR-AI-DEF-04 (moved from BR-AI-10): Daily limits on AI use per group. The rule was incomplete in the previous version and REQ-001 puts usage limits out of scope.
