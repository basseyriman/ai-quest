"use client";

import React from "react";
import { PrintCardBack } from "./PrintCardBack";

const CARDS_PER_PAGE = 6;

export const PRINT_BACK_PAGE_CLASS =
    "flex justify-center items-center w-[210mm] h-[297mm] relative page-break mb-32 print:mb-0 print:shadow-none shadow-2xl bg-white";

export const PRINT_BACK_GRID_CLASS =
    "grid grid-cols-2 grid-rows-[repeat(3,88.9mm)] gap-[4mm] p-[5mm]";

export const PRINT_BACK_CELL_CLASS =
    "flex justify-center items-center p-1 border-[0.2px] border-zinc-100 border-dashed";

export const PRINT_BACK_GRID_TIGHT_CLASS =
    "grid grid-cols-2 grid-rows-[repeat(3,88.9mm)] gap-[2mm] p-[2mm]";

interface PrintCardBackPagesProps {
    totalCards: number;
    pageClassName?: string;
    gridClassName?: string;
    cellClassName?: string;
}

/** Renders A4 sheets of card backs (one back per front on the same deck). */
export function PrintCardBackPages({
    totalCards,
    pageClassName = PRINT_BACK_PAGE_CLASS,
    gridClassName = PRINT_BACK_GRID_CLASS,
    cellClassName = PRINT_BACK_CELL_CLASS,
}: PrintCardBackPagesProps) {
    if (totalCards <= 0) return null;

    const pageCount = Math.ceil(totalCards / CARDS_PER_PAGE);

    return (
        <>
            {Array.from({ length: pageCount }).map((_, pageIndex) => {
                const cardsOnPage = Math.min(
                    CARDS_PER_PAGE,
                    totalCards - pageIndex * CARDS_PER_PAGE
                );

                return (
                    <div key={`card-backs-${pageIndex}`} className={pageClassName}>
                        <div className={gridClassName}>
                            {Array.from({ length: cardsOnPage }).map((_, i) => (
                                <div key={i} className={cellClassName}>
                                    <PrintCardBack />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
