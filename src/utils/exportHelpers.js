import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx'
import jsPDF from 'jspdf'
import PptxGenJS from 'pptxgenjs'
import * as XLSX from 'xlsx'

function safe(value, fallback = '') {
    return value === null || value === undefined ? fallback : value
}

function makeFileName(projectName, ext) {
    const cleaned = String(projectName || 'Project')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '_')

    return `${cleaned || 'Project'}_Export.${ext}`
}

export async function exportBRDToDocx(data) {
    const { project, complexityDistribution, resourceAllocationTable, sprintPlanTable } = data

    const complexityTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    'Tier',
                    '% split',
                    'Integrations',
                    'Effort pts',
                    'Total effort hrs',
                    'Seniority level',
                ].map((h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })),
            }),
            ...complexityDistribution.map((row) =>
                new TableRow({
                    children: [
                        safe(row.tier),
                        String(safe(row.percentage, 0)),
                        String(safe(row.count, 0)),
                        String(safe(row.effort_points, 0)),
                        String(safe(row.total_effort_hours, 0)),
                        String(safe(row.seniority_level, '')),
                    ].map((v) => new TableCell({ children: [new Paragraph(String(v))] })),
                })
            ),
        ],
    })

    const resourceTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    'Department',
                    'Role',
                    'FTEs',
                    'Sprint from',
                    'Sprint to',
                    'Active sprints',
                    'Hrs / week',
                    'Total hours',
                ].map((h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })),
            }),
            ...resourceAllocationTable.map((row) =>
                new TableRow({
                    children: [
                        safe(row.department),
                        safe(row.role_name),
                        String(safe(row.ftes, 0)),
                        String(safe(row.active_from_sprint, 0)),
                        String(safe(row.active_to_sprint, 0)),
                        String(safe(row.active_sprints, 0)),
                        String(safe(row.hours_per_week, 0)),
                        String(safe(row.total_hours, 0)),
                    ].map((v) => new TableCell({ children: [new Paragraph(String(v))] })),
                })
            ),
        ],
    })

    const sprintTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    'Sprint',
                    'Phase',
                    'Start',
                    'End',
                    'Active FTE',
                    'Total effort hrs',
                ].map((h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })),
            }),
            ...sprintPlanTable.map((row) =>
                new TableRow({
                    children: [
                        String(safe(row.sprint_number, 0)),
                        safe(row.phase || row.phase_label),
                        safe(row.start_date),
                        safe(row.end_date),
                        String(safe(row.active_fte_count, 0)),
                        String(safe(row.total_effort_hours, 0)),
                    ].map((v) => new TableCell({ children: [new Paragraph(String(v))] })),
                })
            ),
        ],
    })

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        text: `${project.projectName} - Export`,
                        heading: HeadingLevel.TITLE,
                    }),
                    new Paragraph(`Client: ${safe(project.clientName)}`),
                    new Paragraph(`Project ID: ${safe(project.projectId)}`),
                    new Paragraph(`Integrations: ${safe(project.totalIntegrations, 0)}`),
                    new Paragraph(`Sprints: ${safe(project.totalSprints, 0)}`),
                    new Paragraph(`Total Weeks: ${safe(project.totalWeeks, 0)}`),
                    new Paragraph(`Total Hours: ${safe(project.totalHours, 0)}`),
                    new Paragraph(`Total FTEs: ${safe(project.totalFtes, 0)}`),

                    new Paragraph({ text: 'Complexity Distribution', heading: HeadingLevel.HEADING_1 }),
                    complexityTable,

                    new Paragraph({ text: 'Resource Allocation', heading: HeadingLevel.HEADING_1 }),
                    resourceTable,

                    new Paragraph({ text: 'Sprint Plan', heading: HeadingLevel.HEADING_1 }),
                    sprintTable,
                ],
            },
        ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, makeFileName(project.projectName, 'docx'))
}

export async function exportBRDToPdf(data) {
    const { project, complexityDistribution, resourceAllocationTable, sprintPlanTable } = data

    const pdf = new jsPDF()
    let y = 15

    const addLine = (text, gap = 7) => {
        pdf.text(String(text), 14, y)
        y += gap
        if (y > 280) {
            pdf.addPage()
            y = 15
        }
    }

    pdf.setFontSize(16)
    addLine(`${project.projectName} - Export`, 10)

    pdf.setFontSize(11)
    addLine(`Client: ${safe(project.clientName)}`)
    addLine(`Project ID: ${safe(project.projectId)}`)
    addLine(`Integrations: ${safe(project.totalIntegrations, 0)}`)
    addLine(`Sprints: ${safe(project.totalSprints, 0)}`)
    addLine(`Total Hours: ${safe(project.totalHours, 0)}`)
    addLine(`Total FTEs: ${safe(project.totalFtes, 0)}`, 10)

    pdf.setFontSize(13)
    addLine('Complexity Distribution', 8)
    pdf.setFontSize(10)
    complexityDistribution.forEach((row) => {
        addLine(
            `${safe(row.tier)} | ${safe(row.percentage, 0)}% | Intg: ${safe(row.count, 0)} | Pts: ${safe(row.effort_points, 0)} | Hrs: ${safe(row.total_effort_hours, 0)}`
        )
    })

    y += 4
    pdf.setFontSize(13)
    addLine('Resource Allocation', 8)
    pdf.setFontSize(10)
    resourceAllocationTable.forEach((row) => {
        addLine(
            `${safe(row.role_name)} (${safe(row.department)}) | FTE: ${safe(row.ftes, 0)} | S${safe(row.active_from_sprint, 0)}-S${safe(row.active_to_sprint, 0)} | Hrs: ${safe(row.total_hours, 0)}`
        )
    })

    y += 4
    pdf.setFontSize(13)
    addLine('Sprint Plan', 8)
    pdf.setFontSize(10)
    sprintPlanTable.forEach((row) => {
        addLine(
            `Sprint ${safe(row.sprint_number, 0)} | ${safe(row.phase || row.phase_label)} | ${safe(row.start_date)} to ${safe(row.end_date)} | Effort Hrs: ${safe(row.total_effort_hours, 0)}`
        )
    })

    pdf.save(makeFileName(project.projectName, 'pdf'))
}

export async function exportBRDToPptx(data) {
    const { project, complexityDistribution, resourceAllocationTable, sprintPlanTable } = data

    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_WIDE'
    pptx.author = 'OpenAI'
    pptx.company = 'OpenAI'
    pptx.subject = 'Project Export'
    pptx.title = `${project.projectName} Export`

    const slide1 = pptx.addSlide()
    slide1.addText(`${project.projectName}`, { x: 0.5, y: 0.3, w: 9, h: 0.4, fontSize: 24, bold: true })
    slide1.addText(`Client: ${safe(project.clientName)}`, { x: 0.5, y: 1.0, w: 4, h: 0.3, fontSize: 14 })
    slide1.addText(`Project ID: ${safe(project.projectId)}`, { x: 0.5, y: 1.4, w: 4, h: 0.3, fontSize: 14 })
    slide1.addText(`Integrations: ${safe(project.totalIntegrations, 0)}`, { x: 0.5, y: 1.8, w: 4, h: 0.3, fontSize: 14 })
    slide1.addText(`Sprints: ${safe(project.totalSprints, 0)}`, { x: 0.5, y: 2.2, w: 4, h: 0.3, fontSize: 14 })
    slide1.addText(`Total Hours: ${safe(project.totalHours, 0)}`, { x: 0.5, y: 2.6, w: 4, h: 0.3, fontSize: 14 })
    slide1.addText(`Total FTEs: ${safe(project.totalFtes, 0)}`, { x: 0.5, y: 3.0, w: 4, h: 0.3, fontSize: 14 })

    const slide2 = pptx.addSlide()
    slide2.addText('Complexity Distribution', { x: 0.5, y: 0.3, w: 5, h: 0.4, fontSize: 20, bold: true })
    slide2.addTable(
        [
            ['Tier', '% split', 'Integrations', 'Effort pts', 'Total effort hrs'],
            ...complexityDistribution.map((row) => [
                safe(row.tier),
                safe(row.percentage, 0),
                safe(row.count, 0),
                safe(row.effort_points, 0),
                safe(row.total_effort_hours, 0),
            ]),
        ],
        { x: 0.5, y: 1.0, w: 12.2, h: 4.5, fontSize: 10, border: { pt: 1 } }
    )

    const slide3 = pptx.addSlide()
    slide3.addText('Resource Allocation', { x: 0.5, y: 0.3, w: 5, h: 0.4, fontSize: 20, bold: true })
    slide3.addTable(
        [
            ['Role', 'Dept', 'FTEs', 'Sprint from', 'Sprint to', 'Total hours'],
            ...resourceAllocationTable.map((row) => [
                safe(row.role_name),
                safe(row.department),
                safe(row.ftes, 0),
                safe(row.active_from_sprint, 0),
                safe(row.active_to_sprint, 0),
                safe(row.total_hours, 0),
            ]),
        ],
        { x: 0.5, y: 1.0, w: 12.2, h: 5.0, fontSize: 10, border: { pt: 1 } }
    )

    const slide4 = pptx.addSlide()
    slide4.addText('Sprint Plan', { x: 0.5, y: 0.3, w: 5, h: 0.4, fontSize: 20, bold: true })
    slide4.addTable(
        [
            ['Sprint', 'Phase', 'Start', 'End', 'Active FTE', 'Effort Hrs'],
            ...sprintPlanTable.map((row) => [
                safe(row.sprint_number, 0),
                safe(row.phase || row.phase_label),
                safe(row.start_date),
                safe(row.end_date),
                safe(row.active_fte_count, 0),
                safe(row.total_effort_hours, 0),
            ]),
        ],
        { x: 0.5, y: 1.0, w: 12.2, h: 5.0, fontSize: 10, border: { pt: 1 } }
    )

    await pptx.writeFile({ fileName: makeFileName(project.projectName, 'pptx') })
}
export async function exportBRDToXlsx(data) {
    const {
        project,
        complexityDistribution = [],
        resourceAllocationTable = [],
        sprintPlanTable = [],
    } = data;

    const wb =
        XLSX.utils.book_new();

    // Summary
    const ws1 =
        XLSX.utils.json_to_sheet([
            {
                Project:
                    project.projectName,

                Client:
                    project.clientName,

                ProjectID:
                    project.projectId,

                Integrations:
                    project.totalIntegrations,

                Sprints:
                    project.totalSprints,

                Weeks:
                    project.totalWeeks,

                Hours:
                    project.totalHours,

                FTE:
                    project.totalFtes,
            }
        ]);

    ws1["!cols"] = [
        { wch: 25 },
        { wch: 25 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
    ];

    // Complexity
    const ws2 =
        XLSX.utils.json_to_sheet(
            complexityDistribution.map(
                r => ({
                    Tier: r.tier,
                    Percentage:
                        r.percentage,

                    Integrations:
                        r.count,

                    EffortPoints:
                        r.effort_points,

                    Hours:
                        r.total_effort_hours,

                    Seniority:
                        r.seniority_level,
                })
            )
        );

    ws2["!cols"] =
        Array(6).fill({
            wch: 20
        });

    // Resource
    const ws3 =
        XLSX.utils.json_to_sheet(
            resourceAllocationTable.map(
                r => ({
                    Department:
                        r.department,

                    Role:
                        r.role_name,

                    FTE:
                        r.ftes,

                    SprintFrom:
                        r.active_from_sprint,

                    SprintTo:
                        r.active_to_sprint,

                    TotalHours:
                        r.total_hours,
                })
            )
        );

    ws3["!cols"] =
        Array(6).fill({
            wch: 22
        });

    // Sprint plan with TIME
    const ws4 =
        XLSX.utils.json_to_sheet(
            sprintPlanTable.map(
                r => ({
                    Sprint:
                        r.sprint_number ||
                        r.name,

                    Phase:
                        r.phase,

                    StartDate:
                        r.start_date ||
                        r.sd,

                    EndDate:
                        r.end_date ||
                        r.ed,

                    Hours:
                        r.total_effort_hours ||
                        r.hrs,

                    Integrations:
                        r.intgs,
                })
            )
        );

    ws4["!cols"] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 25 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(
        wb,
        ws1,
        "Summary"
    );

    XLSX.utils.book_append_sheet(
        wb,
        ws2,
        "Complexity"
    );

    XLSX.utils.book_append_sheet(
        wb,
        ws3,
        "Resources"
    );

    XLSX.utils.book_append_sheet(
        wb,
        ws4,
        "Sprint Plan"
    );

    XLSX.writeFile(
        wb,
        `${project.projectName}.xlsx`
    );
}

export async function exportBRDToCsv(data) {

    const {
        project,
        complexityDistribution = [],
        resourceAllocationTable = [],
        sprintPlanTable = []
    } = data;

    let rows = [];

    rows.push([
        "PROJECT SUMMARY"
    ]);

    rows.push([
        "Project",
        project.projectName
    ]);

    rows.push([
        "Hours",
        project.totalHours
    ]);

    rows.push([
        "FTE",
        project.totalFtes
    ]);

    rows.push([]);

    rows.push([
        "COMPLEXITY"
    ]);

    rows.push([
        "Tier",
        "%",
        "Hours"
    ]);

    complexityDistribution
        .forEach(r => {

            rows.push([
                r.tier,
                r.percentage,
                r.total_effort_hours
            ]);

        });

    rows.push([]);

    rows.push([
        "RESOURCE"
    ]);

    rows.push([
        "Role",
        "Dept",
        "FTE",
        "Hours"
    ]);

    resourceAllocationTable
        .forEach(r => {

            rows.push([
                r.role_name,
                r.department,
                r.ftes,
                r.total_hours
            ]);

        });

    rows.push([]);

    rows.push([
        "SPRINT PLAN"
    ]);

    rows.push([
        "Sprint",
        "Phase",
        "Start Time",
        "End Time",
        "Hours"
    ]);

    sprintPlanTable.forEach(r => {

        rows.push([
            `"${r.sprint_number || r.name}"`,

            `"${r.phase || ""}"`,

            `"${r.start_date || r.sd || "-"}"`,

            `"${r.end_date || r.ed || "-"}"`,

            `"${r.total_effort_hours || r.hrs || 0}"`
        ]);

    });

    sprintPlanTable
        .forEach(r => {

            rows.push([
                r.sprint_number ||
                r.name,

                r.phase,

                r.start_date ||
                r.sd,

                r.end_date ||
                r.ed,

                r.total_effort_hours ||
                r.hrs
            ]);

        });

    const csv =
        rows.map(
            r => r.join(",")
        ).join("\n");

    saveAs(
        new Blob([csv]),
        `${project.projectName}.csv`
    );

}

export async function exportBRDToJson(data) {
    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        {
            type: 'application/json;charset=utf-8',
        }
    )

    saveAs(blob, makeFileName(data?.project?.projectName, 'json'))
}

export async function exportBRDToTxt(data) {
    const {
        project,
        complexityDistribution,
        resourceAllocationTable,
        sprintPlanTable,
    } = data

    let text = ''

    text += `PROJECT SUMMARY\n`
    text += `========================\n`
    text += `Project Name: ${safe(project.projectName)}\n`
    text += `Client Name: ${safe(project.clientName)}\n`
    text += `Project ID: ${safe(project.projectId)}\n`
    text += `Total Integrations: ${safe(project.totalIntegrations, 0)}\n`
    text += `Total Sprints: ${safe(project.totalSprints, 0)}\n`
    text += `Total Weeks: ${safe(project.totalWeeks, 0)}\n`
    text += `Total Hours: ${safe(project.totalHours, 0)}\n`
    text += `Total FTEs: ${safe(project.totalFtes, 0)}\n\n`

    text += `COMPLEXITY DISTRIBUTION\n`
    text += `========================\n`

    complexityDistribution.forEach((row) => {
        text += `${safe(row.tier)} | ${safe(row.percentage, 0)}% | Integrations: ${safe(row.count, 0)} | Effort: ${safe(row.total_effort_hours, 0)} hrs\n`
    })

    text += `\nRESOURCE ALLOCATION\n`
    text += `========================\n`

    resourceAllocationTable.forEach((row) => {
        text += `${safe(row.role_name)} (${safe(row.department)}) | FTE: ${safe(row.ftes, 0)} | Hours: ${safe(row.total_hours, 0)}\n`
    })

    text += `\nSPRINT PLAN\n`
    text += `========================\n`

    sprintPlanTable.forEach((row) => {
        text += `Sprint ${safe(row.sprint_number, 0)} | ${safe(row.phase || row.phase_label)} | ${safe(row.start_date)} - ${safe(row.end_date)}\n`
    })

    const blob = new Blob(
        [text],
        {
            type: 'text/plain;charset=utf-8',
        }
    )

    saveAs(blob, makeFileName(project.projectName, 'txt'))
}

export async function exportBRDToPng(data) {
    const rows = [
        ["Role", "Department", "FTE"],
        ...(data.resourceAllocationTable || []).map(r => [
            r.role_name || "-",
            r.department || "-",
            r.ftes || 0,
        ])
    ];

    const rowHeight = 50;
    const headerHeight = 70;

    const canvas =
        document.createElement("canvas");

    canvas.width = 1000;
    canvas.height =
        headerHeight +
        rows.length * rowHeight +
        100;

    const ctx =
        canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Title
    ctx.fillStyle = "#111827";
    ctx.font = "bold 28px Arial";

    ctx.fillText(
        `${data.project.projectName} - Resource Allocation`,
        40,
        50
    );

    let y = 100;

    rows.forEach((row, i) => {
        const isHeader = i === 0;

        row.forEach((cell, j) => {
            const x =
                40 + j * 300;

            // Cell background
            ctx.fillStyle =
                isHeader
                    ? "#2563EB"
                    : i % 2 === 0
                        ? "#F9FAFB"
                        : "#FFFFFF";

            ctx.fillRect(
                x,
                y,
                300,
                rowHeight
            );

            // Border
            ctx.strokeStyle =
                "#D1D5DB";

            ctx.strokeRect(
                x,
                y,
                300,
                rowHeight
            );

            // Text
            ctx.fillStyle =
                isHeader
                    ? "#fff"
                    : "#111827";

            ctx.font =
                isHeader
                    ? "bold 16px Arial"
                    : "14px Arial";

            ctx.fillText(
                String(cell),
                x + 15,
                y + 30
            );
        });

        y += rowHeight;
    });

    canvas.toBlob(blob => {
        saveAs(
            blob,
            `${data.project.projectName}_table.png`
        );
    });
}