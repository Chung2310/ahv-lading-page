export type NotifyType = "success" | "error" | "info";

export type NotifyPayload = {
  type: NotifyType;
  message: string;
  title?: string;
  durationMs?: number;
};

const EVENT_NAME = "ahv:toast";

export function notify(payload: NotifyPayload) {
  window.dispatchEvent(new CustomEvent<NotifyPayload>(EVENT_NAME, { detail: payload }));
}

export function notifySuccess(message: string, opts?: { title?: string; durationMs?: number }) {
  notify({ type: "success", message, ...opts });
}

export function notifyError(message: string, opts?: { title?: string; durationMs?: number }) {
  notify({ type: "error", message, ...opts });
}

export function notifyInfo(message: string, opts?: { title?: string; durationMs?: number }) {
  notify({ type: "info", message, ...opts });
}

export const __INTERNAL_TOAST_EVENT_NAME__ = EVENT_NAME;

