"use client"

import { cn } from "@/lib/utils"
import { getLocalTimeZone, today } from "@internationalized/date"
import { ComponentProps } from "react"
import {
  Button,
  CalendarCell as CalendarCellRac,
  CalendarGridBody as CalendarGridBodyRac,
  CalendarGridHeader as CalendarGridHeaderRac,
  CalendarGrid as CalendarGridRac,
  CalendarHeaderCell as CalendarHeaderCellRac,
  Calendar as CalendarRac,
  Heading as HeadingRac,
  RangeCalendar as RangeCalendarRac,
  composeRenderProps,
} from "react-aria-components"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

interface BaseCalendarProps {
  className?: string
}

type CalendarProps = ComponentProps<typeof CalendarRac> & BaseCalendarProps
type RangeCalendarProps = ComponentProps<typeof RangeCalendarRac> &
  BaseCalendarProps

const CalendarHeader = () => (
  <header className="flex w-full items-center gap-1 pb-1">
    <Button
      slot="previous"
      className="flex size-9 items-center justify-center rounded-lg text-[var(--color-grey-600)] outline-offset-2 transition-colors hover:bg-[var(--color-grey-200)] hover:text-[var(--color-black)] focus:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-[var(--color-primary)]"
    >
      <ChevronLeftIcon size={16} strokeWidth={2} />
    </Button>
    <HeadingRac className="grow text-center text-sm font-bold uppercase tracking-wider text-[var(--color-black)]" />
    <Button
      slot="next"
      className="flex size-9 items-center justify-center rounded-lg text-[var(--color-grey-600)] outline-offset-2 transition-colors hover:bg-[var(--color-grey-200)] hover:text-[var(--color-black)] focus:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-[var(--color-primary)]"
    >
      <ChevronRightIcon size={16} strokeWidth={2} />
    </Button>
  </header>
)

const CalendarGridComponent = ({ isRange = false }: { isRange?: boolean }) => {
  const now = today(getLocalTimeZone())

  return (
    <CalendarGridRac>
      <CalendarGridHeaderRac>
        {(day) => (
          <CalendarHeaderCellRac className="size-9 rounded-lg p-0 text-xs font-bold uppercase text-[var(--color-grey-600)]">
            {day}
          </CalendarHeaderCellRac>
        )}
      </CalendarGridHeaderRac>
      <CalendarGridBodyRac className="[&_td]:px-0">
        {(date) => (
          <CalendarCellRac
            date={date}
            className={cn(
              "relative flex size-9 items-center justify-center whitespace-nowrap rounded-lg border-2 border-transparent p-0 text-sm font-bold text-[var(--color-black)] outline-offset-2 duration-150 focus:outline-none data-[disabled]:pointer-events-none data-[unavailable]:pointer-events-none data-[focus-visible]:z-10 data-[hovered]:bg-[var(--color-grey-200)] data-[selected]:bg-[var(--color-primary)] data-[selected]:border-[var(--color-black)] data-[hovered]:text-[var(--color-black)] data-[selected]:text-white data-[unavailable]:line-through data-[disabled]:opacity-30 data-[unavailable]:opacity-30 data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-[var(--color-primary)]",
              // Range-specific styles
              isRange &&
                "data-[selected]:rounded-none data-[selection-end]:rounded-e-lg data-[selection-start]:rounded-s-lg data-[invalid]:bg-red-100 data-[selected]:bg-[var(--color-grey-200)] data-[selected]:text-[var(--color-black)] data-[invalid]:data-[selection-end]:[&:not([data-hover])]:bg-red-600 data-[invalid]:data-[selection-start]:[&:not([data-hover])]:bg-red-600 data-[selection-end]:[&:not([data-hover])]:bg-[var(--color-primary)] data-[selection-start]:[&:not([data-hover])]:bg-[var(--color-primary)] data-[invalid]:data-[selection-end]:[&:not([data-hover])]:text-white data-[invalid]:data-[selection-start]:[&:not([data-hover])]:text-white data-[selection-end]:[&:not([data-hover])]:text-white data-[selection-start]:[&:not([data-hover])]:text-white",
              // Today indicator styles
              date.compare(now) === 0 &&
                cn(
                  "after:pointer-events-none after:absolute after:bottom-1 after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-[var(--color-primary)]",
                  isRange
                    ? "data-[selection-end]:[&:not([data-hover])]:after:bg-white data-[selection-start]:[&:not([data-hover])]:after:bg-white"
                    : "data-[selected]:after:bg-white",
                ),
            )}
          />
        )}
      </CalendarGridBodyRac>
    </CalendarGridRac>
  )
}

const Calendar = ({ className, ...props }: CalendarProps) => {
  return (
    <CalendarRac
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("w-fit font-sans", className),
      )}
    >
      <CalendarHeader />
      <CalendarGridComponent />
    </CalendarRac>
  )
}

const RangeCalendar = ({ className, ...props }: RangeCalendarProps) => {
  return (
    <RangeCalendarRac
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("w-fit font-sans", className),
      )}
    >
      <CalendarHeader />
      <CalendarGridComponent isRange />
    </RangeCalendarRac>
  )
}

export { Calendar, RangeCalendar }
