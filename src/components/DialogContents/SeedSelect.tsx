import { cn } from "@sglara/cn";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { useState } from "react";
import { buildSeed } from "../../game/puzzle/random";

const areDatesSameDay = (dates: Date[]) => {
  return dates.every((date) => date.toDateString() === dates[0].toDateString());
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getNumberDaysInMonth = (date: Date) => {
  switch (date.getMonth() + 1) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 2:
      return 28;
    default:
      return 30;
  }
};

interface LevelSelectProps {
  onSelectSeed: (seed: string) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ onSelectSeed }) => {
  const [scrollMonthYear, setScrollMonthYear] = useState<Date>(
    getFirstDayOfMonth(new Date())
  );
  const today = new Date();

  const handleScrollPreviousMonth = () => {
    setScrollMonthYear(
      new Date(scrollMonthYear.getFullYear(), scrollMonthYear.getMonth() - 1, 1)
    );
  };

  const handleScrollNextMonth = () => {
    if (areDatesSameDay([
      getFirstDayOfMonth(scrollMonthYear),
      getFirstDayOfMonth(today),
    ])) {
      return;
    }
    setScrollMonthYear(
      new Date(scrollMonthYear.getFullYear(), scrollMonthYear.getMonth() + 1, 1)
    );
  };

  const handleScrollPreviousYear = () => {
    setScrollMonthYear(
      new Date(scrollMonthYear.getFullYear() - 1, scrollMonthYear.getMonth(), 1)
    );
  };
  
  const handleScrollNextYear = () => {
    if (new Date(scrollMonthYear.getFullYear() + 1, scrollMonthYear.getMonth(), 1) > today) {
      setScrollMonthYear(new Date(today.getFullYear(), today.getMonth(), 1));
      return;
    }
    setScrollMonthYear(
      new Date(scrollMonthYear.getFullYear() + 1, scrollMonthYear.getMonth(), 1)
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-row justify-between items-center w-full gap-2">
            <button
              type="button"
              className="cursor-pointer px-2"
              onClick={handleScrollPreviousYear}
            >
              <ChevronsLeftIcon className="size-6" />
              <span className="sr-only">Previous year</span>
            </button>
            <button
              type="button"
              className="cursor-pointer px-2"
              onClick={handleScrollPreviousMonth}
            >
              <ChevronLeftIcon className="size-6" />
              <span className="sr-only">Previous month</span>
            </button>
            <h3 className="text-lg font-bold text-center mx-auto">
              {scrollMonthYear.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              type="button"
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-2"
              onClick={handleScrollNextMonth}
              disabled={areDatesSameDay([
                getFirstDayOfMonth(scrollMonthYear),
                getFirstDayOfMonth(today),
              ])}
            >
              <ChevronRightIcon className="size-6" />
              <span className="sr-only">Next month</span>
            </button>
            <button
              type="button"
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-2"
              onClick={handleScrollNextYear}
              disabled={areDatesSameDay([
                getFirstDayOfMonth(scrollMonthYear),
                getFirstDayOfMonth(today),
              ])}
            >
              <ChevronsRightIcon className="size-6" />
              <span className="sr-only">Next year</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-2 w-full">
          {Array.from(
            { length: getNumberDaysInMonth(scrollMonthYear) },
            (_, i) => {
              const strSize = i.toString();
              const firstDayOfMonth = new Date(
                scrollMonthYear.getFullYear(),
                scrollMonthYear.getMonth(),
                1
              );
              return (
                <button
                  type="button"
                  onClick={() => {
                    onSelectSeed(buildSeed("", new Date(scrollMonthYear.getFullYear(), scrollMonthYear.getMonth(), i + 1)));
                  }}
                  key={i}
                  title={`Switch to ${strSize}x${strSize} puzzle`}
                  className={cn(
                    "cursor-pointer rounded-full w-full text-sm leading-0 text-center aspect-square bg-gray-200 text-gray-800 hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed"
                  )}
                  style={{
                    gridColumnStart: i === 0 ? firstDayOfMonth.getDay() : 0,
                  }}
                  disabled={
                    new Date(
                      scrollMonthYear.getFullYear(),
                      scrollMonthYear.getMonth(),
                      i + 1
                    ) > today
                  }
                >
                  {i + 1}
                </button>
              );
            }
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            onSelectSeed(buildSeed("", new Date()));
          }}
          title={`Play today's puzzle`}
          className={cn(
            "cursor-pointer rounded-full w-full px-4 py-2 text-center bg-gray-200 text-gray-800 hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed"
          )}
        >
          Play today's puzzle
        </button>
      </div>
    </div>
  );
};
