import React, { useMemo, useState } from "react";
import styles from "./MonthCalendar.module.sass";
import moment from "moment";
import useStore from "../../store/store";
import CreateAppointmentModal from "./CreateAppointmentModal";

const MonthCalendar = () => {
    const { fetchedAppointments, selectedFromDate, selectedToDate } = useStore(
        (state) => state.appointments
    );

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newAppointmentDate, setNewAppointmentDate] = useState(null);
    const [expandedWeeks, setExpandedWeeks] = useState(new Set()); // Track which weeks are expanded

    moment.updateLocale("en", { week: { dow: 0 } });

    const startOfMonth = selectedFromDate.clone().startOf("month");
    const endOfMonth = selectedToDate.clone().endOf("month");

    const startOfGrid = startOfMonth.clone().startOf("week");
    const endOfGrid = endOfMonth.clone().endOf("week");

    const days = useMemo(() => {
        const list = [];
        const cur = startOfGrid.clone();
        while (cur.isBefore(endOfGrid, "day") || cur.isSame(endOfGrid, "day")) {
            list.push(cur.clone());
            cur.add(1, "day");
        }
        return list;
    }, [startOfGrid, endOfGrid]);

    const weeks = Math.ceil(days.length / 7);

    // Group days by week for easier event positioning
    const weekRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < weeks; i++) {
            rows.push(days.slice(i * 7, (i + 1) * 7));
        }
        return rows;
    }, [days, weeks]);

    // Process events for each week row
    const getEventsForWeek = (weekDays) => {
        const weekStart = weekDays[0].clone().startOf('day');
        const weekEnd = weekDays[6].clone().endOf('day');

        // Filter events that overlap with this week
        const weekEvents = fetchedAppointments.filter((event) => {
            const eventStart = moment(event.startDateTime);
            const eventEnd = moment(event.endDateTime);

            return !(eventEnd.isBefore(weekStart) || eventStart.isAfter(weekEnd));
        });

        // Process each event to calculate its position and width
        const processedEvents = weekEvents.map((event) => {
            const eventStart = moment(event.startDateTime);
            const eventEnd = moment(event.endDateTime);

            // Calculate which column (0-6) the event starts and ends
            let startCol = -1;
            let endCol = -1;

            weekDays.forEach((day, index) => {
                if (eventStart.isSame(day, 'day') ||
                    (eventStart.isBefore(weekStart) && index === 0)) {
                    startCol = index;
                }
                if (eventEnd.isSame(day, 'day') ||
                    (eventEnd.isAfter(weekEnd) && index === 6)) {
                    endCol = index;
                }
            });

            // If event starts before this week, start from first day
            if (startCol === -1 && eventStart.isBefore(weekStart)) {
                startCol = 0;
            }

            // If event ends after this week, end at last day
            if (endCol === -1 && eventEnd.isAfter(weekEnd)) {
                endCol = 6;
            }

            return {
                ...event,
                startCol,
                endCol,
                spansDays: endCol - startCol + 1,
                continuesFromPrev: eventStart.isBefore(weekStart),
                continuesToNext: eventEnd.isAfter(weekEnd)
            };
        });

        // Sort events by duration (longer events first) and start time
        processedEvents.sort((a, b) => {
            const durA = b.spansDays - a.spansDays;
            if (durA !== 0) return durA;
            return moment(a.startDateTime).diff(moment(b.startDateTime));
        });

        // Assign row positions to avoid overlaps
        const eventRows = [];
        processedEvents.forEach(event => {
            let row = 0;
            while (true) {
                const hasConflict = eventRows.some(e =>
                    e.row === row &&
                    !(event.endCol < e.startCol || event.startCol > e.endCol)
                );

                if (!hasConflict) {
                    eventRows.push({ ...event, row });
                    break;
                }
                row++;
            }
        });

        return eventRows;
    };

    // Calculate how many events are in each column for "more" indicator
    const getEventCountsPerDay = (events, weekDays) => {
        const counts = new Array(7).fill(0);
        const hiddenEvents = new Array(7).fill(null).map(() => []);

        events.forEach(event => {
            for (let col = event.startCol; col <= event.endCol; col++) {
                counts[col]++;
                if (event.row >= 3) {
                    hiddenEvents[col].push(event);
                }
            }
        });

        return { counts, hiddenEvents };
    };

    const toggleWeekExpansion = (weekIndex) => {
        const newExpanded = new Set(expandedWeeks);
        if (newExpanded.has(weekIndex)) {
            newExpanded.delete(weekIndex);
        } else {
            newExpanded.add(weekIndex);
        }
        setExpandedWeeks(newExpanded);
    };

    const renderWeekEvents = (weekDays, weekIndex) => {
        const events = getEventsForWeek(weekDays);
        const isExpanded = expandedWeeks.has(weekIndex);
        const { counts, hiddenEvents } = getEventCountsPerDay(events, weekDays);

        // Filter events to show based on expansion state
        const visibleEvents = isExpanded ? events : events.filter(event => event.row < 3);

        // Calculate the actual number of rows being displayed
        const displayedRows = visibleEvents.reduce((max, e) => Math.max(max, e.row + 1), 0);

        return (
            <>
                {visibleEvents.map((event) => {
                    const eventStart = moment(event.startDateTime);
                    const eventEnd = moment(event.endDateTime);

                    // Calculate position and width
                    const left = `${(event.startCol / 7) * 100}%`;
                    const width = `${(event.spansDays / 7) * 100}%`;
                    const top = `${24 + (event.row * 22)}px`; // 24px for date number, 22px per event row

                    let displayText = event.title || "(No title)";

                    // Add time for single day events or on first occurrence
                    if (!eventStart.isSame(eventEnd, 'day')) {
                        if (!event.continuesFromPrev) {
                            displayText += ` ${eventStart.format("h:mm A")}`;
                        }
                    } else {
                        displayText += ` ${eventStart.format("h:mm A") + " - " + eventEnd.format("h:mm A")}`;
                    }

                    return (
                        <div
                            key={`${event.id}-week${weekIndex}`}
                            className={styles.weekEvent}
                            style={{
                                left,
                                width,
                                top,
                                backgroundColor: event.appointmentType?.color || "#aaaaaa",
                            }}
                            title={`${event.title}\n${eventStart.format("MMM D h:mm A")} - ${eventEnd.format("MMM D h:mm A")}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                            }}
                        >
                            <span className={styles.eventText}>
                                {event.continuesFromPrev && "← "}
                                {displayText}
                                {event.continuesToNext && " →"}
                            </span>
                        </div>
                    );
                })}

                {/* Render "more" indicators for each day that has hidden events */}
                {!isExpanded && hiddenEvents.map((dayHiddenEvents, dayIndex) => {
                    if (dayHiddenEvents.length === 0) return null;

                    const left = `${(dayIndex / 7) * 100}%`;
                    const width = `${(1 / 7) * 100}%`;
                    const top = `${24 + (3 * 22)}px`; // Position after the first 3 rows

                    return (
                        <div
                            key={`more-${weekIndex}-${dayIndex}`}
                            className={styles.moreIndicator}
                            style={{
                                left,
                                width,
                                top,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleWeekExpansion(weekIndex);
                            }}
                            title={`Click to see ${dayHiddenEvents.length} more event(s)`}
                        >
                            +{dayHiddenEvents.length} more
                        </div>
                    );
                })}

                {/* Show collapse option when expanded - position based on actual displayed rows */}
                {isExpanded && events.length > 3 && (
                    <div
                        className={styles.collapseIndicator}
                        style={{
                            left: 0,
                            width: '100%',
                            top: `${48 + (displayedRows * 22)}px`, // Use actual displayed rows
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWeekExpansion(weekIndex);
                        }}
                    >
                        Show less
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={styles.monthCalendar}>
            {/* Weekday headers */}
            <div className={styles.weekdays}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className={styles.weekday}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid of days with week-based event rendering */}
            <div className={styles.weeksContainer}>
                {weekRows.map((weekDays, weekIndex) => {
                    const events = getEventsForWeek(weekDays);
                    const isExpanded = expandedWeeks.has(weekIndex);

                    // Calculate min height based on state
                    let minHeight;
                    if (!isExpanded) {
                        // Collapsed: show up to 3 rows + space for "more" indicators
                        const hasMore = events.some(e => e.row >= 3);
                        minHeight = 24 + (hasMore ? 4 : Math.min(3, events.length)) * 22 + 10;
                    } else {
                        // Expanded: show all rows + space for "show less"
                        const maxRow = events.reduce((max, e) => Math.max(max, e.row + 1), 0);
                        minHeight = 24 + (maxRow * 22) + 22 + 10; // +22 for "show less" button
                    }

                    return (
                        <div
                            key={weekIndex}
                            className={styles.weekRow}
                            style={{ minHeight: `${minHeight}px` }}
                        >
                            {weekDays.map((date, dayIndex) => {
                                const isCurrentMonth = date.month() === startOfMonth.month();
                                const isToday = date.isSame(moment(), "day");
                                const isPast = date.isBefore(moment(), "day");

                                return (
                                    <div
                                        key={dayIndex}
                                        className={`${styles.dayCell} 
                                            ${isCurrentMonth ? "" : styles.outsideMonth} 
                                            ${isToday ? styles.today : ""} 
                                            ${isPast ? styles.pastDay : ""}`}
                                        onClick={() => setNewAppointmentDate(date)}
                                    >
                                        <div className={styles.dateNumber}>{date.date()}</div>
                                    </div>
                                );
                            })}
                            {/* Render events for this week as absolute positioned elements */}
                            {renderWeekEvents(weekDays, weekIndex)}
                        </div>
                    );
                })}
            </div>

            {/* Modal for editing existing event */}
            {selectedEvent && (
                <CreateAppointmentModal
                    open={!!selectedEvent}
                    appointment={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onSave={() => setSelectedEvent(null)}
                />
            )}

            {/* Modal for creating new appointment */}
            {newAppointmentDate && (
                <CreateAppointmentModal
                    open={!!newAppointmentDate}
                    defaultDate={newAppointmentDate}
                    onClose={() => setNewAppointmentDate(null)}
                    onSave={() => setNewAppointmentDate(null)}
                />
            )}
        </div>
    );
};

export default MonthCalendar;
