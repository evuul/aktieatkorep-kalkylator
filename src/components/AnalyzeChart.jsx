import React, { useState, useEffect } from "react";
import '../styles/charts.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Button, Typography, Collapse, ToggleButton, ToggleButtonGroup, createTheme, ThemeProvider } from '@mui/material';

const AnalyzeChart = () => {
    const [financialReports, setFinancialReports] = useState([]);
    const [viewMode, setViewMode] = useState('annual');
    const [selectedMetrics, setSelectedMetrics] = useState(["operatingRevenues", "adjustedEBITDA"]);
    const [showMetricsFilter, setShowMetricsFilter] = useState(false);

    const fetchFinancialReports = async () => {
        try {
            const response = await fetch("/data/financialReports.json");
            if (!response.ok) {
                throw new Error(`HTTP-fel! Status: ${response.status}`);
            }
            const data = await response.json();
            setFinancialReports(data.financialReports);
        } catch (error) {
            console.error("Error fetching financial reports:", error);
        }
    };

    useEffect(() => {
        fetchFinancialReports();
    }, []);

    const aggregateAnnualData = () => {
        const annualData = {};

        financialReports.forEach(report => {
            if (!annualData[report.year]) {
                annualData[report.year] = {
                    year: report.year,
                    totalOperatingRevenues: 0,
                    totalAdjustedEBITDA: 0,
                    totalAdjustedOperatingProfit: 0,
                    totalAdjustedProfitForPeriod: 0,
                    adjustedEarningsPerShare: 0,
                    equityPerShare: 0,
                    ocfPerShare: 0,
                    averageNumberOfFTEs: 0,
                    totalBuybackShares: 0,
                    totalLiveCasino: 0,
                    totalRNG: 0,
                    totalEurope: 0,
                    totalAsia: 0,
                    totalNorthAmerica: 0,
                    totalLatAm: 0,
                    totalOther: 0,
                    regulatedMarketValues: [],
                    top5CustomersValues: [],
                    count: 0
                };
            }

            annualData[report.year].totalOperatingRevenues += report.operatingRevenues;
            annualData[report.year].totalAdjustedEBITDA += report.adjustedEBITDA;
            annualData[report.year].totalAdjustedOperatingProfit += report.adjustedOperatingProfit;
            annualData[report.year].totalAdjustedProfitForPeriod += report.adjustedProfitForPeriod;
            annualData[report.year].adjustedEarningsPerShare += report.adjustedEarningsPerShare;
            annualData[report.year].equityPerShare += report.equityPerShare;
            annualData[report.year].ocfPerShare += report.ocfPerShare;
            annualData[report.year].averageNumberOfFTEs += report.averageNumberOfFTEs;
            annualData[report.year].totalBuybackShares += report.buybackShares || 0;
            annualData[report.year].totalLiveCasino += report.liveCasino || 0;
            annualData[report.year].totalRNG += report.rng || 0;
            annualData[report.year].totalEurope += report.europe || 0;
            annualData[report.year].totalAsia += report.asia || 0;
            annualData[report.year].totalNorthAmerica += report.northAmerica || 0;
            annualData[report.year].totalLatAm += report.latAm || 0;
            annualData[report.year].totalOther += report.other || 0;
            annualData[report.year].regulatedMarketValues.push(report.regulatedMarket || 0);
            annualData[report.year].top5CustomersValues.push(report.Top5Customers || 0);
            annualData[report.year].count += 1;
        });

        return Object.values(annualData).map(report => ({
            year: report.year,
            operatingRevenues: report.totalOperatingRevenues,
            adjustedEBITDA: report.totalAdjustedEBITDA,
            adjustedEBITDAMargin: (report.totalAdjustedEBITDA / report.totalOperatingRevenues) * 100,
            adjustedOperatingProfit: report.totalAdjustedOperatingProfit,
            adjustedOperatingMargin: (report.totalAdjustedOperatingProfit / report.totalOperatingRevenues) * 100,
            adjustedProfitForPeriod: report.totalAdjustedProfitForPeriod,
            adjustedProfitMargin: (report.totalAdjustedProfitForPeriod / report.totalOperatingRevenues) * 100,
            adjustedEarningsPerShare: report.adjustedEarningsPerShare,
            equityPerShare: report.equityPerShare / report.count,
            ocfPerShare: report.ocfPerShare / report.count,
            averageNumberOfFTEs: report.averageNumberOfFTEs / report.count,
            totalBuybackShares: report.totalBuybackShares,
            totalLiveCasino: report.totalLiveCasino,
            totalRNG: report.totalRNG,
            totalEurope: report.totalEurope,
            totalAsia: report.totalAsia,
            totalNorthAmerica: report.totalNorthAmerica,
            totalLatAm: report.totalLatAm,
            totalOther: report.totalOther,
            totalRegulatedMarket: report.regulatedMarketValues.reduce((sum, value) => sum + value, 0) / report.regulatedMarketValues.length,
            totalTop5Customers: report.top5CustomersValues.reduce((sum, value) => sum + value, 0) / report.top5CustomersValues.length
        }));
    };

    const roundValue = (value) => (value ? value.toFixed(2) : '0.00');

    const renderFinancialTable = () => {
        const dataToRender = viewMode === 'annual' ? aggregateAnnualData() : financialReports;

        return (
            <div className="table-container">
                <table className="financial-report-table">
                    <thead>
                        <tr>
                            <th>År</th>
                            {viewMode === 'quarterly' && <th>Kvartal</th>}
                            <th>Operativa Intäkter (M€)</th>
                            <th>EBITDA (M€)</th>
                            <th>EBITDA Marginal (%)</th>
                            <th>Rörelseresultat (M€)</th>
                            <th>Rörelsemarginal (%)</th>
                            <th>Vinst för Perioden (M€)</th>
                            <th>Vinstmarginal (%)</th>
                            <th>Vinst per Aktie (€)</th>
                            <th>Eget Kapital per Aktie (€)</th>
                            <th>OCF per Aktie (M€)</th>
                            <th>Antal Heltidsanställda</th>
                            <th>Live Casino (M€)</th>
                            <th>RNG (M€)</th>
                            <th>Europa (M€)</th>
                            <th>Asien (M€)</th>
                            <th>Nordamerika (M€)</th>
                            <th>Latinamerika (M€)</th>
                            <th>Övrigt (M€)</th>
                            <th>Reglerad Marknad (%)</th>
                            <th>Topp 5 Kunder (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToRender.map((report, index) => (
                            <tr key={index}>
                                <td>{report.year}</td>
                                {viewMode === "quarterly" && <td>Q{report.quarter.replace(/\D/g, "")}</td>}
                                <td>{roundValue(report.operatingRevenues)} M€</td>
                                <td>{roundValue(report.adjustedEBITDA)} M€</td>
                                <td>{roundValue(report.adjustedEBITDAMargin)} %</td>
                                <td>{roundValue(report.adjustedOperatingProfit)} M€</td>
                                <td>{roundValue(report.adjustedOperatingMargin)} %</td>
                                <td>{roundValue(report.adjustedProfitForPeriod)} M€</td>
                                <td>{roundValue(report.adjustedProfitMargin)} %</td>
                                <td>{roundValue(report.adjustedEarningsPerShare)} €</td>
                                <td>{roundValue(report.equityPerShare)} €</td>
                                <td>{roundValue(report.ocfPerShare)} M€</td>
                                <td>{roundValue(report.averageNumberOfFTEs)}</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalLiveCasino : report.liveCasino)} M€</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalRNG : report.rng)} M€</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalEurope : report.europe)} M€</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalAsia : report.asia)} M€</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalNorthAmerica : report.northAmerica)} M€</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalLatAm : report.latAm)} M€</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalOther : report.other)} M€</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalRegulatedMarket : report.regulatedMarket)} %</td>
                                <td>{roundValue(viewMode === 'annual' ? report.totalTop5Customers : report.Top5Customers)} %</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const chartColors = {
        operatingRevenues: "#8884d8",
        adjustedEBITDA: "#82ca9d",
        adjustedEBITDAMargin: "#ffc658",
        adjustedOperatingProfit: "#ff7300",
        adjustedOperatingMargin: "#d88884",
        adjustedProfitForPeriod: "#8d44ad",
        adjustedEarningsPerShare: "#ff6666",
        totalLiveCasino: "#00C49F",
        totalRNG: "#FFBB28",
        totalEurope: "#0088FE",
        totalAsia: "#FF8042",
        totalNorthAmerica: "#A28DFF",
        totalLatAm: "#FF6384",
        totalOther: "#36A2EB",
        totalRegulatedMarket: "#FFCE56",
        totalTop5Customers: "#4BC0C0"
    };

    const renderGrowthChart = () => {
        const dataToRender = viewMode === 'annual' ? aggregateAnnualData() : financialReports;

        // Filtrera data baserat på det första och sista året/kvartalet med data för de valda nyckeltalen
        const filteredData = dataToRender.filter(report => {
            return selectedMetrics.some(metric => report[metric] !== undefined && report[metric] !== null);
        });

        if (filteredData.length === 0) {
            return <div>Ingen data att visa för de valda nyckeltalen.</div>;
        }

        // Hitta det första och sista året/kvartalet med data
        let firstYearQuarter = null;
        let lastYearQuarter = null;

        filteredData.forEach(report => {
            selectedMetrics.forEach(metric => {
                if (report[metric] !== undefined && report[metric] !== null) {
                    const yearQuarter = viewMode === 'annual' ? `${report.year}` : `${report.year} Q${report.quarter.replace(/\D/g, "")}`;
                    if (!firstYearQuarter || yearQuarter < firstYearQuarter) {
                        firstYearQuarter = yearQuarter;
                    }
                    if (!lastYearQuarter || yearQuarter > lastYearQuarter) {
                        lastYearQuarter = yearQuarter;
                    }
                }
            });
        });

        // Filtrera data ytterligare för att endast visa data från första till sista året/kvartalet
        const finalData = filteredData.filter(report => {
            const yearQuarter = viewMode === 'annual' ? `${report.year}` : `${report.year} Q${report.quarter.replace(/\D/g, "")}`;
            return yearQuarter >= firstYearQuarter && yearQuarter <= lastYearQuarter;
        });

        const data = finalData.map(report => ({
            yearQuarter: viewMode === 'annual'
                ? `${report.year}`
                : `${report.year} Q${report.quarter.replace(/\D/g, "")}`,
            operatingRevenues: report.operatingRevenues ? parseFloat(report.operatingRevenues.toFixed(2)) : 0,
            adjustedEBITDA: report.adjustedEBITDA ? parseFloat(report.adjustedEBITDA.toFixed(2)) : 0,
            adjustedEBITDAMargin: report.adjustedEBITDAMargin ? parseFloat(report.adjustedEBITDAMargin.toFixed(2)) : 0,
            adjustedOperatingProfit: report.adjustedOperatingProfit ? parseFloat(report.adjustedOperatingProfit.toFixed(2)) : 0,
            adjustedOperatingMargin: report.adjustedOperatingMargin ? parseFloat(report.adjustedOperatingMargin.toFixed(2)) : 0,
            adjustedProfitForPeriod: report.adjustedProfitForPeriod ? parseFloat(report.adjustedProfitForPeriod.toFixed(2)) : 0,
            adjustedProfitMargin: report.adjustedProfitMargin ? parseFloat(report.adjustedProfitMargin.toFixed(2)) : 0,
            adjustedEarningsPerShare: report.adjustedEarningsPerShare ? parseFloat(report.adjustedEarningsPerShare.toFixed(2)) : 0,
            equityPerShare: report.equityPerShare ? parseFloat(report.equityPerShare.toFixed(2)) : 0,
            ocfPerShare: report.ocfPerShare ? parseFloat(report.ocfPerShare.toFixed(2)) : 0,
            averageNumberOfFTEs: report.averageNumberOfFTEs ? parseFloat(report.averageNumberOfFTEs.toFixed(2)) : 0,
            totalBuybackShares: report.totalBuybackShares ? parseFloat(report.totalBuybackShares.toFixed(2)) : 0,
            totalLiveCasino: viewMode === 'annual' ? report.totalLiveCasino : report.liveCasino ? parseFloat(report.liveCasino.toFixed(2)) : 0,
            totalRNG: viewMode === 'annual' ? report.totalRNG : report.rng ? parseFloat(report.rng.toFixed(2)) : 0,
            totalEurope: viewMode === 'annual' ? report.totalEurope : report.europe ? parseFloat(report.europe.toFixed(2)) : 0,
            totalAsia: viewMode === 'annual' ? report.totalAsia : report.asia ? parseFloat(report.asia.toFixed(2)) : 0,
            totalNorthAmerica: viewMode === 'annual' ? report.totalNorthAmerica : report.northAmerica ? parseFloat(report.northAmerica.toFixed(2)) : 0,
            totalLatAm: viewMode === 'annual' ? report.totalLatAm : report.latAm ? parseFloat(report.latAm.toFixed(2)) : 0,
            totalOther: viewMode === 'annual' ? report.totalOther : report.other ? parseFloat(report.other.toFixed(2)) : 0,
            totalRegulatedMarket: viewMode === 'annual' ? report.totalRegulatedMarket : report.regulatedMarket,
            totalTop5Customers: viewMode === 'annual' ? report.totalTop5Customers : report.Top5Customers,
        }));

        return (
            <div>
                <h3>Nyckeltal - Stapeldiagram</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="yearQuarter" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
                        <Legend />
                        {selectedMetrics.map(metric => (
                            <Bar key={metric} dataKey={metric} fill={chartColors[metric]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const handleMetricSelection = (metric) => {
        setSelectedMetrics(prevMetrics =>
            prevMetrics.includes(metric)
                ? prevMetrics.filter(m => m !== metric)
                : [...prevMetrics, metric]
        );
    };

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
        }
    };

    const theme = createTheme({
        components: {
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        },
                        '&:hover': {
                            backgroundColor: '#e3f2fd',
                        },
                        border: '1px solid #1976d2',
                        borderRadius: '4px',
                        padding: '6px 16px',
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="analyze-chart">
                <h2>Finansiella Rapportdata</h2>

                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="visningsläge"
                    style={{ marginBottom: '20px' }}
                >
                    <ToggleButton value="quarterly">Kvartal</ToggleButton>
                    <ToggleButton value="annual">Helår</ToggleButton>
                </ToggleButtonGroup>

                <div style={{ marginTop: '20px' }}>
                    <Button variant="outlined" onClick={() => setShowMetricsFilter(!showMetricsFilter)}>
                        {showMetricsFilter ? 'Dölj nyckeltalsval' : 'Visa fler nyckeltal'}
                    </Button>
                    {!showMetricsFilter && (
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedMetrics.includes("operatingRevenues")}
                                        onChange={() => handleMetricSelection("operatingRevenues")}
                                        style={{ color: chartColors["operatingRevenues"] }}
                                    />
                                }
                                label="Operativa Intäkter"
                                style={{ width: 'auto', marginRight: '20px' }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedMetrics.includes("adjustedEBITDA")}
                                        onChange={() => handleMetricSelection("adjustedEBITDA")}
                                        style={{ color: chartColors["adjustedEBITDA"] }}
                                    />
                                }
                                label="EBITDA"
                                style={{ width: 'auto' }}
                            />
                        </div>
                    )}
                </div>

                <Collapse in={showMetricsFilter}>
                    <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                        <Typography variant="subtitle1">Välj nyckeltal:</Typography>
                        <FormGroup style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {Object.keys(chartColors).map(metric => (
                                <FormControlLabel
                                    key={metric}
                                    control={
                                        <Checkbox
                                            checked={selectedMetrics.includes(metric)}
                                            onChange={() => handleMetricSelection(metric)}
                                            style={{ color: chartColors[metric] }}
                                        />
                                    }
                                    label={metric}
                                    style={{ width: 'auto', marginRight: '20px', marginBottom: '10px' }}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Collapse>

                {renderFinancialTable()}
                {renderGrowthChart()}
            </div>
        </ThemeProvider>
    );
};

export default AnalyzeChart;