const allRows = $input.all(); // array of all input items

if (allRows.length === 0) return [];

const lastRow = allRows[allRows.length - 1].json; // last item’s json

return [{
    lastStatus: lastRow.Status,
    timestamp: lastRow.Timestamp,
    row_number: lastRow.row_number,
    command: lastRow.Command
}];
