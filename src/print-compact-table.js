import { builders, printer as docPrinter } from "prettier/doc";

const { breakParent, hardlineWithoutBreakParent, join } = builders;
const { printDocToString } = docPrinter;

function printCompactTable(path, options, print) {
    const { node } = path;

    const contents = path.map(
        () => path.map(() => printDocToString(print(), options).formatted, "children"),
        "children",
    );

    const rows = [
        contents[0],
        printSeparator(node, options, contents[0].length),
        ...contents.slice(1),
    ].map((columns) => `|${columns.join("|")}|`);

    return [breakParent, join(hardlineWithoutBreakParent, rows)];
}

function printCompactDelimiterTable(path, options, print, originalPrinter) {
    const originalDoc = originalPrinter.print(path, options, print);
    const formatted = printDocToString(originalDoc, options).formatted.replace(/\n+$/, "");
    const lines = formatted.split("\n");

    const separatorIndex = lines.findIndex(
        (line, index) =>
            index > 0 &&
            line.includes("-") &&
            line.includes("|") &&
            /^\s*\|?[\s:|-]+\|?\s*$/.test(line),
    );

    if (separatorIndex === -1) {
        return originalDoc;
    }

    const headerLength = path.node.children[0]?.children.length ?? 0;
    lines[separatorIndex] = printCompactSeparatorLine(path.node, options, headerLength);

    return [breakParent, lines.join("\n")];
}

function printSeparator(node, options, headerLength) {
    return node.align
        .map((align, index) => {
            if (options.parser !== "mdx" && index >= headerLength) {
                return null;
            }
            const left = align === "center" || align === "left" ? ":" : "";
            const right = align === "center" || align === "right" ? ":" : "";
            return `${left}-${right}`;
        })
        .filter(Boolean);
}

function printCompactSeparatorLine(node, options, headerLength) {
    return `|${printSeparator(node, options, headerLength).join("|")}|`;
}

export { printCompactTable, printCompactDelimiterTable };
