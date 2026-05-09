import * as React from "react";
import { Button } from "@/components/ui/Button";

interface ActionProps {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface MailboxFullStateProps {
  emoji?: string;
  imageUrl?: string;
  title: string;
  description: string;
  primaryAction: ActionProps;
  secondaryAction?: ActionProps;
}

export const MailboxFullState = ({
  emoji,
  imageUrl,
  title,
  description,
  primaryAction,
  secondaryAction,
}: MailboxFullStateProps) => {

  return (
    <div
      className="flex w-full flex-col items-center justify-between border-2 border-[var(--color-black)] bg-white p-8 md:p-12 text-center transition-all hover:scale-[1.02] cursor-pointer"
      aria-labelledby="state-title"
    >
      <div className="flex flex-col items-center">
        {emoji ? (
          <div className="mb-6 text-6xl">{emoji}</div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Service illustration"
            className="mb-6 h-32 w-32 object-contain"
          />
        ) : null}

        <h2
          id="state-title"
          className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--color-black)]"
        >
          {title}
        </h2>

        <p className="mt-4 text-black/70 font-medium max-w-sm">
          {description}
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {secondaryAction && (
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.text}
          </Button>
        )}
        <Button
          className="w-full sm:w-auto group"
          onClick={primaryAction.onClick}
        >
          {primaryAction.text}
          {primaryAction.icon && (
            <span className="ml-2 flex items-center justify-center transition-transform group-hover:translate-x-1">
              {primaryAction.icon}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
