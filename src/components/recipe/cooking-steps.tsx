"use client";

import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptic } from "@/hooks/use-haptic";

interface CookingStepsProps {
  instructions: string;
}

type Block =
  | { type: "step"; html: string; text: string }
  | { type: "heading"; html: string }
  | { type: "divider" };

function parseInstructions(raw: string): Block[] {
  const trimmed = raw.trim();

  if (!trimmed.startsWith("<")) {
    return trimmed
      .split("\n")
      .filter((s) => s.trim())
      .map((s) => ({ type: "step", html: s.trim(), text: s.trim() }));
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmed, "text/html");
  const blocks: Block[] = [];

  for (const node of Array.from(doc.body.children)) {
    const tag = node.tagName;

    if (tag === "H2" || tag === "H3") {
      const text = node.textContent?.trim();
      if (text) blocks.push({ type: "heading", html: node.innerHTML });
    } else if (tag === "UL" || tag === "OL") {
      for (const li of Array.from(node.querySelectorAll("li"))) {
        const text = li.textContent?.trim();
        if (text) blocks.push({ type: "step", html: li.innerHTML, text });
      }
    } else if (tag === "P") {
      const text = node.textContent?.trim();
      if (text) blocks.push({ type: "step", html: node.innerHTML, text });
    } else if (tag === "HR") {
      blocks.push({ type: "divider" });
    }
  }

  return blocks;
}

export function CookingSteps({ instructions }: CookingStepsProps) {
  const blocks = useMemo(() => parseInstructions(instructions), [instructions]);
  const stepIndices = useMemo(
    () =>
      blocks.reduce<number[]>((acc, b, i) => {
        if (b.type === "step") acc.push(i);
        return acc;
      }, []),
    [blocks]
  );

  const [done, setDone] = useState<Set<number>>(new Set());
  const haptic = useHaptic();

  function toggle(blockIdx: number) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(blockIdx)) {
        next.delete(blockIdx);
        haptic.light();
      } else {
        next.add(blockIdx);
        haptic.success();
      }
      return next;
    });
  }

  if (blocks.length === 0) return null;

  let stepCounter = 0;

  return (
    <div className="space-y-1">
      {blocks.map((block, idx) => {
        if (block.type === "divider") {
          return <hr key={idx} className="my-3 border-border" />;
        }

        if (block.type === "heading") {
          return (
            <h3
              key={idx}
              className="text-sm font-semibold text-foreground pt-3 pb-1 px-3"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }

        const stepNum = ++stepCounter;
        const isDone = done.has(idx);
        return (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className={cn(
              "w-full flex gap-3.5 text-left rounded-xl px-3 py-3 transition-colors duration-200",
              isDone ? "bg-primary/8 dark:bg-primary/12" : "hover:bg-muted/60"
            )}
          >
            <span
              className={cn(
                "shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mt-0.5 transition-all duration-200",
                isDone
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : stepNum}
            </span>
            <span
              className={cn(
                "text-sm leading-relaxed transition-colors duration-200",
                isDone
                  ? "text-muted-foreground line-through decoration-muted-foreground/50"
                  : "text-foreground/85"
              )}
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          </button>
        );
      })}

      {stepIndices.length > 1 && done.size > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          {done.size}/{stepIndices.length} adım tamamlandı
        </p>
      )}
    </div>
  );
}
