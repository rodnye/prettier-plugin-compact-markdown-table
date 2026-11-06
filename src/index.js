import * as prettierMarkdownPlugin from "prettier/plugins/markdown";
import { printCompactTable, printCompactDelimiterTable } from "./print-compact-table.js";
import options from "./options.js";

const originalPrinter = prettierMarkdownPlugin.printers.mdast;

export const parsers = {
    markdown: prettierMarkdownPlugin.parsers.markdown,
    mdx: prettierMarkdownPlugin.parsers.mdx,
    remark: prettierMarkdownPlugin.parsers.remark,
};

export const printers = {
    mdast: {
        ...originalPrinter,
        print(path, options, print) {
            if (path.node.type === "table") {
                if (options.tableLayout === "compact") {
                    return printCompactTable(path, options, print);
                }
                if (options.tableLayout === "compact-delimiter") {
                    return printCompactDelimiterTable(path, options, print, originalPrinter);
                }
            }
            return originalPrinter.print(path, options, print);
        },
    },
};

export { options };
