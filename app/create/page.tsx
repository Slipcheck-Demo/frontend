"use client";

import { useEffect, useState } from "react";
import { ApiError, createCode, getEventMarkets, getEvents, getSports, toApiError } from "@/lib/api";
import { CheckIcon } from "@/components/CheckIcon";
import { ErrorBanner } from "@/components/ErrorBanner";
import { SlipBuilder, type BuilderItem } from "@/components/SlipBuilder";
import { SlipCard } from "@/components/SlipCard";
import { toSlipSelection } from "@/lib/mapping";
import { formatKickoff, formatOdds } from "@/lib/formatting";
import { sportIcon } from "@/lib/sportIcons";
import type { EventMarket, EventOutcome, EventSummary, Sport, SlipResponse } from "@/lib/types";

type Step = "sport" | "event" | "market" | "review";

function createErrorMessageFor(err: ApiError): string {
  if (err.code === "conflicting_selections") {
    return "Two of your picks are from the same match and can't be combined — remove one before generating a code.";
  }
  if (err.code === "invalid_code") {
    return "One of your picks is no longer available. Remove it and try again.";
  }
  return "Something went wrong talking to Betway. Please try again in a moment.";
}

export default function CreatePage() {
  const [step, setStep] = useState<Step>("sport");

  const [sports, setSports] = useState<Sport[]>([]);
  const [sportsLoading, setSportsLoading] = useState(true);
  const [sportsError, setSportsError] = useState("");
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);

  const [events, setEvents] = useState<EventSummary[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsLoadingMore, setEventsLoadingMore] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [eventsIsFinalPage, setEventsIsFinalPage] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(null);

  const [markets, setMarkets] = useState<EventMarket[]>([]);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [marketsError, setMarketsError] = useState("");

  const [builderItems, setBuilderItems] = useState<BuilderItem[]>([]);
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "error">("idle");
  const [createError, setCreateError] = useState("");
  const [reviewResult, setReviewResult] = useState<SlipResponse | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy code");

  useEffect(() => {
    getSports()
      .then((data) => setSports(data.sports))
      .catch(() => setSportsError("Couldn't load the list of sports. Please refresh."))
      .finally(() => setSportsLoading(false));
  }, []);

  function handlePickSport(sportId: string) {
    setSelectedSportId(sportId);
    setStep("event");
    setEvents([]);
    setEventsIsFinalPage(true);
    setEventsLoading(true);
    setEventsError("");
    getEvents(sportId)
      .then((data) => {
        setEvents(data.events);
        setEventsIsFinalPage(data.isFinalPage);
      })
      .catch(() => setEventsError("Couldn't load upcoming matches. Please try again."))
      .finally(() => setEventsLoading(false));
  }

  function handleLoadMoreEvents() {
    if (!selectedSportId || eventsLoadingMore) return;
    setEventsLoadingMore(true);
    getEvents(selectedSportId, events.length)
      .then((data) => {
        setEvents((prev) => [...prev, ...data.events]);
        setEventsIsFinalPage(data.isFinalPage);
      })
      .catch(() => setEventsError("Couldn't load more matches. Please try again."))
      .finally(() => setEventsLoadingMore(false));
  }

  // Breadcrumb links back to "sport"/"event" deliberately leave builderItems alone — this is
  // the only way to add a leg from a second match, since the backend rejects any two
  // selections that share an eventId (same-match legs can't combine into one slip).
  function handleBackToSports() {
    setStep("sport");
  }

  function handleBackToEvents() {
    setStep("event");
  }

  function handlePickEvent(event: EventSummary) {
    setSelectedEvent(event);
    setMarkets(event.markets); // inline 1X2, shown immediately while the full list loads
    setMarketsError("");
    setStep("market");
    setMarketsLoading(true);
    getEventMarkets(event.eventId)
      .then((data) => setMarkets(data.markets))
      .catch(() =>
        setMarketsError("Couldn't load the full market list — showing what's available."),
      )
      .finally(() => setMarketsLoading(false));
  }

  function toggleOutcome(outcome: EventOutcome) {
    setBuilderItems((prev) => {
      const exists = prev.some((item) => item.outcomeId === outcome.outcomeId);
      if (exists) return prev.filter((item) => item.outcomeId !== outcome.outcomeId);
      return [
        ...prev,
        {
          outcomeId: outcome.outcomeId,
          outcomeName: outcome.displayName,
          eventShort: selectedEvent ? `${selectedEvent.homeTeam} vs. ${selectedEvent.awayTeam}` : "",
          priceDecimal: outcome.priceDecimal,
        },
      ];
    });
  }

  function removeItem(outcomeId: string) {
    setBuilderItems((prev) => prev.filter((item) => item.outcomeId !== outcomeId));
  }

  async function handleGenerate() {
    setCreateStatus("loading");
    setCreateError("");
    try {
      const data = await createCode(builderItems.map((item) => item.outcomeId));
      setReviewResult(data);
      setStep("review");
      setCreateStatus("idle");
    } catch (err) {
      setCreateError(createErrorMessageFor(toApiError(err)));
      setCreateStatus("error");
    }
  }

  function handleStartOver() {
    setStep("sport");
    setSelectedSportId(null);
    setEvents([]);
    setEventsIsFinalPage(true);
    setEventsError("");
    setSelectedEvent(null);
    setMarkets([]);
    setMarketsError("");
    setBuilderItems([]);
    setReviewResult(null);
    setCreateStatus("idle");
    setCreateError("");
    setCopyLabel("Copy code");
  }

  async function handleCopyCode() {
    if (!reviewResult) return;
    try {
      await navigator.clipboard.writeText(reviewResult.bookingCode);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy code"), 1500);
    } catch {
      // clipboard access denied — leave the label as-is, the code is still shown on screen
    }
  }

  if (step === "review" && reviewResult) {
    return (
      <div className="flex flex-1 justify-center px-6 py-16">
        <div className="flex w-full max-w-[640px] flex-col items-center gap-6">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-success/14">
            <CheckIcon size={24} />
          </div>
          <div className="flex flex-col gap-1.5 text-center">
            <h1 className="text-2xl font-bold text-text-primary">Your code is ready</h1>
            <p className="text-sm text-text-secondary">
              Share it, or copy it into the Betway betslip.
            </p>
          </div>
          <SlipCard
            bookingCode={reviewResult.bookingCode}
            selections={reviewResult.selections.map(toSlipSelection)}
            totalOdds={reviewResult.totalOdds}
          />
          <div className="flex w-full gap-2.5">
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex-1 rounded-md bg-accent py-[13px] text-sm font-semibold text-on-accent"
            >
              {copyLabel}
            </button>
            <button
              type="button"
              onClick={handleStartOver}
              className="flex-1 rounded-md border border-border bg-surface py-[13px] text-sm font-semibold text-text-primary"
            >
              Start a new slip
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sportName = sports.find((s) => s.sportId === selectedSportId)?.name ?? "";

  return (
    <div className="flex flex-1">
      <div className="flex min-w-0 flex-1 flex-col gap-6 px-12 py-10">
        <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-text-tertiary">
          <button
            type="button"
            onClick={handleBackToSports}
            disabled={step === "sport"}
            className={step === "sport" ? "text-text-primary" : "hover:text-text-primary hover:underline"}
          >
            1. Choose a sport
          </button>
          {step !== "sport" ? (
            <>
              <span>›</span>
              <button
                type="button"
                onClick={handleBackToEvents}
                disabled={step === "event"}
                className={
                  step === "event" ? "text-text-primary" : "hover:text-text-primary hover:underline"
                }
              >
                {sportName} › 2. Choose a match
              </button>
            </>
          ) : null}
          {step === "market" ? (
            <>
              <span>›</span>
              <span className="text-text-primary">
                {selectedEvent?.homeTeam} vs {selectedEvent?.awayTeam} › 3. Choose markets
              </span>
            </>
          ) : null}
        </div>

        {step === "sport" ? (
          sportsError ? (
            <ErrorBanner message={sportsError} />
          ) : (
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Choose a sport
              </p>
              {sportsLoading ? (
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton h-[86px] w-full" />
                  ))}
                </div>
              ) : sports.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  No sports available right now — please try again in a moment.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {sports.map((sport) => (
                    <button
                      key={sport.sportId}
                      type="button"
                      onClick={() => handlePickSport(sport.sportId)}
                      className="flex flex-col items-center gap-2.5 rounded-md border border-border bg-surface-raised px-3.5 py-4.5 text-text-secondary hover:border-accent hover:text-text-primary"
                    >
                      <span className="text-xl leading-none" aria-hidden="true">
                        {sportIcon(sport.sportId)}
                      </span>
                      <span className="text-[13px] font-semibold">{sport.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        ) : null}

        {step === "event" ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Upcoming matches
            </p>
            {eventsError ? <ErrorBanner message={eventsError} /> : null}
            {eventsLoading ? (
              <div className="skeleton h-16 w-full" />
            ) : !eventsError && events.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No upcoming matches for {sportName} right now — try another sport.
              </p>
            ) : (
              events.map((event) => (
                <button
                  key={event.eventId}
                  type="button"
                  onClick={() => handlePickEvent(event)}
                  className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface-raised px-[18px] py-4 text-left hover:border-accent"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm font-semibold text-text-primary">{event.name}</span>
                    <span className="text-[12.5px] text-text-secondary">
                      {event.league} &middot; {formatKickoff(event.expectedStartEpoch)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {event.markets[0]?.outcomes.map((outcome) => (
                      <div
                        key={outcome.outcomeId}
                        className="min-w-12 rounded-md border border-border bg-surface px-3 py-2 text-center font-mono text-[13px] font-semibold text-text-primary"
                      >
                        {outcome.priceDecimal != null ? formatOdds(outcome.priceDecimal) : "—"}
                      </div>
                    ))}
                  </div>
                </button>
              ))
            )}
            {!eventsLoading && !eventsIsFinalPage ? (
              <button
                type="button"
                onClick={handleLoadMoreEvents}
                disabled={eventsLoadingMore}
                className="self-start rounded-md border border-border bg-surface-raised px-4 py-2 text-[13px] font-semibold text-text-secondary hover:border-accent hover:text-text-primary disabled:opacity-60"
              >
                {eventsLoadingMore ? "Loading…" : "Load more matches"}
              </button>
            ) : null}
          </div>
        ) : null}

        {step === "market" ? (
          <div className="flex flex-col gap-[22px]">
            {marketsError ? <ErrorBanner message={marketsError} /> : null}
            {!marketsLoading && markets.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No markets available for this match right now.
              </p>
            ) : null}
            {markets.map((market) => (
              <div key={market.marketId}>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  {market.displayName}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {market.outcomes.map((outcome) => {
                    const picked = builderItems.some((item) => item.outcomeId === outcome.outcomeId);
                    return (
                      <button
                        key={outcome.outcomeId}
                        type="button"
                        onClick={() => toggleOutcome(outcome)}
                        className={
                          "flex items-center justify-between gap-2 rounded-[9px] border px-3 py-2.5 text-left " +
                          (picked
                            ? "border-accent bg-accent/12 text-text-primary"
                            : "border-border bg-surface-raised text-text-secondary")
                        }
                      >
                        <span className="truncate text-[13px] font-medium">
                          {outcome.displayName}
                        </span>
                        <span className="font-mono text-[13px] font-semibold">
                          {outcome.priceDecimal != null ? formatOdds(outcome.priceDecimal) : "—"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {marketsLoading ? <div className="skeleton h-24 w-full" /> : null}
            {createStatus === "error" ? <ErrorBanner message={createError} /> : null}
          </div>
        ) : null}
      </div>

      <SlipBuilder
        items={builderItems}
        onRemove={removeItem}
        onGenerate={handleGenerate}
        generating={createStatus === "loading"}
      />
    </div>
  );
}
