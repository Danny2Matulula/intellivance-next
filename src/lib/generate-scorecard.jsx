/**
 * Intellivance — AI Readiness Scorecard PDF Generator
 * Uses @react-pdf/renderer to produce branded PDF reports server-side
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { CATEGORIES } from '@/data/assessment-questions';

// ── Brand Colors ────────────────────────────────────────────────────────────
const BRAND = {
    black: '#111113',
    white: '#FFFFFF',
    bg: '#FAFAF8',
    gray: '#777777',
    lightGray: '#EEEEEE',
    accent: '#c87d1a',
    green: '#22c55e',
    yellow: '#f59e0b',
    red: '#ef4444',
};

// ── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        backgroundColor: BRAND.white,
        padding: 0,
    },
    // Cover
    cover: {
        height: '100%',
        backgroundColor: BRAND.black,
        padding: 60,
        justifyContent: 'space-between',
    },
    coverBrand: {
        fontSize: 11,
        letterSpacing: 4,
        color: BRAND.accent,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
    },
    coverTitle: {
        fontSize: 42,
        color: BRAND.white,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: -1,
        lineHeight: 1.2,
        marginBottom: 16,
    },
    coverSubtitle: {
        fontSize: 16,
        color: '#999999',
        lineHeight: 1.6,
    },
    coverMeta: {
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 20,
    },
    coverMetaRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    coverMetaLabel: {
        fontSize: 9,
        letterSpacing: 2,
        color: '#666666',
        textTransform: 'uppercase',
        fontFamily: 'Helvetica-Bold',
        width: 100,
    },
    coverMetaValue: {
        fontSize: 11,
        color: '#CCCCCC',
    },

    // Content pages
    content: {
        padding: '48 50 60 50',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingBottom: 14,
        borderBottomWidth: 2,
        borderBottomColor: BRAND.black,
    },
    headerBrand: {
        fontSize: 9,
        letterSpacing: 3,
        color: BRAND.black,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
    },
    headerPage: {
        fontSize: 8,
        color: BRAND.gray,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },

    sectionLabel: {
        fontSize: 9,
        letterSpacing: 3,
        color: BRAND.accent,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 26,
        color: BRAND.black,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: BRAND.gray,
        lineHeight: 1.6,
        marginBottom: 30,
    },

    // Score circle
    scoreContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    scoreCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    scoreNumber: {
        fontSize: 48,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: -2,
    },
    scoreMax: {
        fontSize: 14,
        color: BRAND.gray,
    },
    scoreRating: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    // Category bars
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: BRAND.lightGray,
    },
    categoryLabel: {
        width: 180,
        fontSize: 11,
        color: BRAND.black,
        fontFamily: 'Helvetica-Bold',
    },
    categoryBarBg: {
        flex: 1,
        height: 12,
        backgroundColor: '#F0F0F0',
        borderRadius: 6,
        overflow: 'hidden',
        marginHorizontal: 12,
    },
    categoryBarFill: {
        height: 12,
        borderRadius: 6,
    },
    categoryScore: {
        width: 50,
        fontSize: 11,
        color: BRAND.black,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'right',
    },
    categoryRating: {
        width: 80,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'right',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // Recommendations
    recCategory: {
        marginBottom: 20,
    },
    recTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: BRAND.black,
        marginBottom: 8,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: BRAND.lightGray,
    },
    recItem: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingLeft: 4,
    },
    recBullet: {
        fontSize: 10,
        color: BRAND.accent,
        marginRight: 8,
        fontFamily: 'Helvetica-Bold',
    },
    recText: {
        fontSize: 10,
        color: '#555555',
        lineHeight: 1.6,
        flex: 1,
    },

    // CTA page
    ctaPage: {
        height: '100%',
        backgroundColor: BRAND.black,
        padding: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 32,
        color: BRAND.white,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    ctaBody: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 1.7,
        maxWidth: 400,
        marginBottom: 30,
    },
    ctaButton: {
        backgroundColor: BRAND.accent,
        paddingVertical: 14,
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    ctaButtonText: {
        fontSize: 12,
        color: BRAND.white,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    ctaUrl: {
        fontSize: 10,
        color: '#666666',
        letterSpacing: 1,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 8,
        color: '#BBBBBB',
        letterSpacing: 1,
    },
});

// ── PDF Document ────────────────────────────────────────────────────────────

const CATEGORY_LABELS = {
    automation: 'Process Automation Readiness',
    techStack: 'Tech Stack Efficiency',
    manualWork: 'Manual Work Dependency',
    scalability: 'Scalability Risk',
};

function ScorecardDocument({ data }) {
    const { companyName, firstName, date, totalScore, maxScore, overallRating, categories, ratings, recommendations, summary } = data;

    const scoreColor = totalScore >= 80 ? BRAND.green :
        totalScore >= 60 ? BRAND.yellow :
            totalScore >= 40 ? BRAND.yellow : BRAND.red;

    return (
        <Document>
            {/* Cover Page */}
            <Page size="LETTER" style={s.page}>
                <View style={s.cover}>
                    <View>
                        <Text style={s.coverBrand}>INTELLIVANCE</Text>
                    </View>
                    <View>
                        <Text style={s.coverTitle}>AI Readiness{'\n'}Scorecard</Text>
                        <Text style={s.coverSubtitle}>
                            A personalized diagnostic of your operational efficiency, automation readiness, and scalability — with specific recommendations to close the gaps.
                        </Text>
                    </View>
                    <View style={s.coverMeta}>
                        <View style={s.coverMetaRow}>
                            <Text style={s.coverMetaLabel}>Prepared For</Text>
                            <Text style={s.coverMetaValue}>{companyName || firstName || 'Your Business'}</Text>
                        </View>
                        <View style={s.coverMetaRow}>
                            <Text style={s.coverMetaLabel}>Date</Text>
                            <Text style={s.coverMetaValue}>{date}</Text>
                        </View>
                        <View style={s.coverMetaRow}>
                            <Text style={s.coverMetaLabel}>Overall Score</Text>
                            <Text style={[s.coverMetaValue, { color: scoreColor }]}>{totalScore}/100</Text>
                        </View>
                    </View>
                </View>
            </Page>

            {/* Score Breakdown Page */}
            <Page size="LETTER" style={s.page}>
                <View style={s.content}>
                    <View style={s.header}>
                        <Text style={s.headerBrand}>INTELLIVANCE</Text>
                        <Text style={s.headerPage}>AI Readiness Scorecard</Text>
                    </View>

                    <Text style={s.sectionLabel}>Overall Score</Text>
                    <Text style={s.sectionTitle}>Your Results</Text>
                    <Text style={s.sectionSubtitle}>{summary}</Text>

                    <View style={s.scoreContainer}>
                        <View style={[s.scoreCircle, { borderColor: scoreColor }]}>
                            <Text style={[s.scoreNumber, { color: scoreColor }]}>{totalScore}</Text>
                            <Text style={s.scoreMax}>/ {maxScore}</Text>
                        </View>
                        <Text style={[s.scoreRating, { color: scoreColor }]}>{overallRating}</Text>
                    </View>

                    <Text style={[s.sectionLabel, { marginBottom: 20 }]}>Category Breakdown</Text>

                    {Object.entries(categories).map(([key, score]) => {
                        const rating = ratings[key] || {};
                        const fillWidth = `${(score / 25) * 100}%`;
                        return (
                            <View key={key} style={s.categoryRow}>
                                <Text style={s.categoryLabel}>{CATEGORY_LABELS[key] || key}</Text>
                                <View style={s.categoryBarBg}>
                                    <View style={[s.categoryBarFill, { width: fillWidth, backgroundColor: rating.color || BRAND.gray }]} />
                                </View>
                                <Text style={s.categoryScore}>{score}/25</Text>
                                <Text style={[s.categoryRating, { color: rating.color || BRAND.gray }]}>{rating.label || ''}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={s.footer}>
                    <Text style={s.footerText}>© 2026 INTELLIVANCE</Text>
                    <Text style={s.footerText}>CONFIDENTIAL</Text>
                </View>
            </Page>

            {/* Recommendations Page */}
            {Object.keys(recommendations).length > 0 && (
                <Page size="LETTER" style={s.page}>
                    <View style={s.content}>
                        <View style={s.header}>
                            <Text style={s.headerBrand}>INTELLIVANCE</Text>
                            <Text style={s.headerPage}>Recommendations</Text>
                        </View>

                        <Text style={s.sectionLabel}>Action Items</Text>
                        <Text style={s.sectionTitle}>What To Fix First</Text>
                        <Text style={s.sectionSubtitle}>
                            These recommendations are prioritized by impact. Start with the categories rated "Critical" or "Needs Work" — that's where the biggest ROI lives.
                        </Text>

                        {Object.entries(recommendations).map(([key, items]) => (
                            <View key={key} style={s.recCategory}>
                                <Text style={s.recTitle}>{CATEGORY_LABELS[key] || key}</Text>
                                {items.map((item, i) => (
                                    <View key={i} style={s.recItem}>
                                        <Text style={s.recBullet}>→</Text>
                                        <Text style={s.recText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                    <View style={s.footer}>
                        <Text style={s.footerText}>© 2026 INTELLIVANCE</Text>
                        <Text style={s.footerText}>CONFIDENTIAL</Text>
                    </View>
                </Page>
            )}

            {/* CTA Page */}
            <Page size="LETTER" style={s.page}>
                <View style={s.ctaPage}>
                    <Text style={s.ctaTitle}>Ready to fix what's broken?</Text>
                    <Text style={s.ctaBody}>
                        This scorecard identified the gaps. We build the solutions. Book a free 15-minute strategy call and we'll walk through your results together.
                    </Text>
                    <View style={s.ctaButton}>
                        <Text style={s.ctaButtonText}>BOOK YOUR CALL →</Text>
                    </View>
                    <Text style={s.ctaUrl}>intellivance.ai/assessment</Text>
                </View>
            </Page>
        </Document>
    );
}

/**
 * Generate a scorecard PDF buffer
 * @param {Object} data - Scorecard data
 * @returns {Promise<Buffer>} PDF as a Buffer
 */
export async function generateScorecardPDF(data) {
    const buffer = await renderToBuffer(<ScorecardDocument data={data} />);
    return buffer;
}

export default ScorecardDocument;
