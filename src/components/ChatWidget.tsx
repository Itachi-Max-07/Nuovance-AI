"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { chatWidget } from "@/lib/content";

/* Floating site assistant. Persistent chrome, so — like the Navbar and Footer —
   it carries `theme-dark` itself and reads the black token system rather than
   inheriting whichever scope it happens to float over.

   Surfaces reuse the shared classes: `.ws-card` for the panel (a display
   surface, no hover motion) and `.btn-brutal` for every action, so the widget
   presses exactly like the rest of the site. */

/** Concatenates the text parts of a UIMessage; non-text parts are ignored. */
function messageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, clearError, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  // Pin to the newest message as tokens stream in.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, busy, error]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel from anywhere inside it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    if (error) clearError();
    setInput("");
    void sendMessage({ text: trimmed });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(input);
  }

  if (!open) {
    return (
      <div className="theme-dark fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={chatWidget.openLabel}
          className="btn-brutal btn-brutal-primary h-14 w-14 !rounded-full !p-0 motion-safe:transition-transform motion-safe:hover:-translate-x-1 motion-safe:hover:-translate-y-1"
        >
          <ChatIcon />
        </button>
      </div>
    );
  }

  return (
    <div className="theme-dark fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <div
        role="dialog"
        aria-label={chatWidget.title}
        className="ws-card flex h-[min(32rem,calc(100vh-6rem))] w-[calc(100vw-2.5rem)] flex-col overflow-hidden sm:w-[24rem]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b-2 border-brand-line px-4 py-3">
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold tracking-tight text-brand-ink">
              {chatWidget.title}
            </p>
            <p className="mt-0.5 truncate text-2xs text-brand-faint">
              {chatWidget.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={chatWidget.closeLabel}
            className="-mr-1 shrink-0 rounded-full p-1.5 text-brand-faint transition-colors hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Transcript */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <p className="text-sm leading-relaxed text-brand-body">
            {chatWidget.greeting}
          </p>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {chatWidget.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submit(suggestion)}
                  disabled={busy}
                  className="tag-brutal text-2xs disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {messages.map((message) => {
            const text = messageText(message);
            if (!text) return null;
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={isUser ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    isUser
                      ? "max-w-[85%] rounded-lg border-2 border-brand-accent bg-brand-accent px-3 py-2 text-sm leading-relaxed text-brand-paper"
                      : "max-w-[85%] rounded-lg border-2 border-brand-line bg-brand-cream px-3 py-2 text-sm leading-relaxed text-brand-ink"
                  }
                >
                  {text}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <p className="text-2xs uppercase tracking-[0.16em] text-brand-faint">
              {chatWidget.thinkingLabel}
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg border-2 border-brand-line bg-brand-cream px-3 py-2"
            >
              <p className="text-sm leading-relaxed text-brand-ink">
                {chatWidget.errorMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  clearError();
                  // Re-runs the last turn rather than making the visitor retype.
                  void regenerate();
                }}
                disabled={busy}
                className="mt-2 text-2xs font-bold uppercase tracking-[0.12em] text-brand-accent-deep underline underline-offset-4 disabled:opacity-50"
              >
                {chatWidget.retryLabel}
              </button>
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 border-t-2 border-brand-line px-3 py-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={chatWidget.placeholder}
            aria-label={chatWidget.placeholder}
            disabled={busy}
            className="min-w-0 flex-1 rounded-lg border-2 border-brand-line bg-brand-cream px-3 py-2 text-sm text-brand-ink placeholder:text-brand-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-accent disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length === 0}
            aria-label={chatWidget.sendLabel}
            className="btn-brutal btn-brutal-primary shrink-0 !px-4 !py-2 text-xs disabled:opacity-50"
          >
            {chatWidget.sendLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Icons (monochrome outline, per the brand) ---------- */

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
